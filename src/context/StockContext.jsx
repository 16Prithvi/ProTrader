import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { STOCKS_DATA, AVAILABLE_TICKERS } from '../data/stocks';

const StockContext = createContext();

export function useStocks() {
    return useContext(StockContext);
}

export function StockProvider({ children }) {
    const { currentUser, login, updateUser } = useAuth();

    // --- State ---
    const [stockState, setStockState] = useState(() => {
        const initial = {};
        AVAILABLE_TICKERS.forEach(ticker => {
            initial[ticker] = {
                price: STOCKS_DATA[ticker].basePrice,
                prevPrice: STOCKS_DATA[ticker].basePrice,
                history: Array(60).fill({ price: STOCKS_DATA[ticker].basePrice, time: Date.now() }),
                change: 0,
                changePercent: 0,
            };
        });
        return initial;
    });

    const [marketActivity, setMarketActivity] = useState([]);
    const [alerts, setAlerts] = useState([]); // { id, ticker, type, price, active }
    const [notifications, setNotifications] = useState([]); // { id, message, type }
    const [notificationHistory, setNotificationHistory] = useState([]); // Persistent history

    // --- Effects ---

    // Reset user-specific state
    useEffect(() => {
        setMarketActivity([]);
        setAlerts([]);
    }, [currentUser?.email]);

    // Helper to persist subscriptions
    const updateSubscriptions = (newSubscriptions) => {
        if (!currentUser) return;
        updateUser({ subscribedTickers: newSubscriptions });
    };

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            // 1. Update Stock Prices
            setStockState(prev => {
                const nextState = { ...prev };
                const now = Date.now();

                Object.keys(nextState).forEach(ticker => {
                    const current = nextState[ticker];
                    const volatility = 0.01; // 1%
                    const change = current.price * (Math.random() * volatility * 2 - volatility);
                    const newPrice = Math.max(0.01, current.price + change);

                    const newPoint = { price: newPrice, time: now };
                    const newHistory = [...current.history.slice(1), newPoint];

                    nextState[ticker] = {
                        price: newPrice,
                        prevPrice: current.price,
                        history: newHistory,
                        change: newPrice - STOCKS_DATA[ticker].basePrice,
                        changePercent: ((newPrice - STOCKS_DATA[ticker].basePrice) / STOCKS_DATA[ticker].basePrice) * 100
                    };
                });

                // 2. Check Alerts against NEW state (nextState) within this scope
                // We must use functional state update for alerts to access latest alerts state if we were inside, 
                // but since we are in `setStockState` callback, we can't setAlerts easily.
                // BETTER: Use a separate check or ref. 
                // However, for simplicity in this simulation, we can "trigger" side effects here or in a separate useEffect on stockState.
                // But separate useEffect might be too frequent.
                // Let's do the Alert check in a separate minimal useEffect that runs on [stockState] or inside the interval but with access to refs.

                return nextState;
            });

            // Separate Trigger Logic (accessing latest stockState via closure if we use prev, but simplified here)
            // To fix the closure issue, I'll use a functional update on ALERTS that reads the LATEST stockState.
            // But wait, `setAlerts` functional update won't give me `stockState`.
            // I'll resort to using a Ref for stockState or just checking inside the setAlerts using the state from the previous line? 
            // React state updates are batched. 
            // Let's do the check inside `setAlerts` using a `stockStateRef`.
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Effect to check alerts whenever stockState changes (every 1s)
    // This is cleaner than mixing inside the interval
    useEffect(() => {
        if (alerts.length === 0) return;

        setAlerts(prevAlerts => {
            const updates = [];
            const nextAlerts = prevAlerts.map(alert => {
                if (!alert.active) return alert;

                const currentPrice = stockState[alert.ticker]?.price;
                if (!currentPrice) return alert;

                let triggered = false;
                if (alert.type === 'ABOVE' && currentPrice >= alert.price) triggered = true;
                if (alert.type === 'BELOW' && currentPrice <= alert.price) triggered = true;

                if (triggered) {
                    const notificationId = `alert-${alert.id}-${Date.now()}`;
                    // Use a unique ID but maybe check if we just added this alert?
                    // Actually, if we mark active: false immediately, it shouldn't re-trigger in next loop.
                    // But if React StrictMode runs this effect twice, both times it sees active: true.
                    // We can use a REF to track processed alerts in this render cycle? No, refs are persistent.
                    // The best way is to check `notifications` state, but we can't see "future" state in dedupe easily without functional update.

                    // Deduplication Strategy:
                    // 1. Generate a semi-stable ID that avoids collision if same alert triggers twice in ms range
                    // But here the issue is likely double-mount.
                    // Let's check if we already have a notification for this alert ID?

                    updates.push({
                        id: Date.now() + Math.random(), // This causes duplicates if run twice
                        message: `Price Alert: ${alert.ticker} passed ${alert.type === 'ABOVE' ? 'above' : 'below'} $${alert.price}`,
                        type: 'success',
                        alertId: alert.id // metadata
                    });

                    // Add to History
                    setNotificationHistory(prev => [{
                        id: Date.now() + Math.random(),
                        message: `Price Alert: ${alert.ticker} passed ${alert.type === 'ABOVE' ? 'above' : 'below'} $${alert.price}`,
                        time: new Date(),
                        ticker: alert.ticker,
                        type: 'alert'
                    }, ...prev]);

                    return { ...alert, active: false };
                }
                return alert;
            });

            if (updates.length > 0) {
                // Check if we really need to add these.
                // Ideally, we filter out any updates that match an alertId already in notifications (if we tracked it).
                // For now, let's just debounce or trust the active flag update? 
                // If double-run happens, the state update is batched.
                // Fix: Don't use Date.now() + Math.random(). Use a deterministic ID based on alert.id + timestamp (floored to second?).
                // Or better: Check if we have processed this alert recently.

                setTimeout(() => {
                    setNotifications(prev => {
                        // Filter out duplicates based on content/uniqueness?
                        // If strict mode runs twice, it queues two setState actions?
                        // Actually, React Strict Mode runs the *effect* twice, but it usually discards the result of one if it's pure? 
                        // But here we are calling `setNotifications` in setTimeout. That escapes React's protection.

                        // Fix: Filter updates.
                        const newUnique = updates.filter(u => !prev.some(p => p.message === u.message && (Date.now() - p.id) < 1000));
                        if (newUnique.length === 0) return prev;
                        return [...prev, ...newUnique];
                    });
                }, 0);
                return nextAlerts;
            }
            return prevAlerts;
        });
    }, [stockState]); // Runs every second

    // Activity Generation (Separate interval or piggyback?)
    useEffect(() => {
        const interval = setInterval(() => {
            const activeTickers = currentUser
                ? (currentUser.subscribedTickers || []).map(s => typeof s === 'string' ? s : s.ticker)
                : ['NVDA', 'TSLA', 'AMZN', 'GOOG', 'META'];

            if (activeTickers.length > 0 && Math.random() > 0.95) { // 5% chance
                const ticker = activeTickers[Math.floor(Math.random() * activeTickers.length)];
                const types = ['positive', 'negative', 'neutral'];
                const type = types[Math.floor(Math.random() * types.length)];
                let message = "";

                if (type === 'positive') message = `${ticker} seeing high buy volume`;
                else if (type === 'negative') message = `${ticker} under selling pressure`;
                else message = `Analyst update for ${ticker}`;

                addActivity(message, type);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [currentUser]);


    // --- Actions ---

    const subscribe = (ticker, quantity = 1) => {
        if (!currentUser) return;
        const currentSubs = currentUser.subscribedTickers || [];
        const isAlreadySubscribed = currentSubs.some(s => (typeof s === 'string' ? s : s.ticker) === ticker);
        if (isAlreadySubscribed) return;

        if (currentSubs.length >= 5) {
            alert("Max 5 subscriptions allowed");
            return;
        }

        const newSub = { ticker, quantity, addedAt: new Date().toISOString() };
        const uniqueExisting = currentSubs.filter(s => (typeof s === 'string' ? s : s.ticker) !== ticker);
        const newSubscriptions = [...uniqueExisting, newSub];
        updateSubscriptions(newSubscriptions);
        addActivity(`Subscribed to ${quantity} share(s) of ${ticker}`, "neutral");
    };

    const unsubscribe = (ticker) => {
        if (!currentUser) return;
        const currentSubs = currentUser.subscribedTickers || [];
        const newSubs = currentSubs.filter(s => (typeof s === 'string' ? s : s.ticker) !== ticker);
        updateSubscriptions(newSubs);
        addActivity(`Unsubscribed from ${ticker}`, "neutral");
    };

    const addActivity = (message, type = "neutral") => {
        setMarketActivity(prev => [{
            id: Date.now() + Math.random(),
            message,
            type,
            time: new Date()
        }, ...prev].slice(0, 50));
    };

    const addAlert = (ticker, type, price) => {
        setAlerts(prev => [...prev, {
            id: Date.now(),
            ticker,
            type,
            price: parseFloat(price),
            active: true
        }]);
        addActivity(`Set alert for ${ticker} ${type === 'ABOVE' ? '>' : '<'} ${price}`, "neutral");
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <StockContext.Provider value={{
            stocks: STOCKS_DATA,
            stockState,
            subscribe,
            unsubscribe,
            marketActivity,
            alerts,
            addAlert,
            notifications,
            removeNotification,
            notificationHistory,
            setNotificationHistory
        }}>
            {children}
        </StockContext.Provider>
    );
}
