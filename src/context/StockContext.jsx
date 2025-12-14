import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { STOCKS_DATA, AVAILABLE_TICKERS } from '../data/stocks';

const StockContext = createContext();

export function useStocks() {
    return useContext(StockContext);
}

export function StockProvider({ children }) {
    const { currentUser, login, updateUser } = useAuth(); // We need login to update the session user properly or a way to update currentUser
    // Actually, updating currentUser in AuthContext is better. Ideally AuthContext exposes an update method.
    // For now, I'll manually update localStorage and assume re-login or just local state update.

    // Simulation State
    const [stockState, setStockState] = useState(() => {
        const initial = {};
        AVAILABLE_TICKERS.forEach(ticker => {
            initial[ticker] = {
                price: STOCKS_DATA[ticker].basePrice,
                prevPrice: STOCKS_DATA[ticker].basePrice,
                history: Array(60).fill({ price: STOCKS_DATA[ticker].basePrice, time: Date.now() }), // Fill with valid data
                change: 0,
                changePercent: 0,
            };
        });
        return initial;
    });



    const [marketActivity, setMarketActivity] = useState([]);

    // Reset Activity when user changes (e.g. login/logout)
    useEffect(() => {
        setMarketActivity([]);
    }, [currentUser?.email]); // Use email as unique ID to trigger reset

    // Helper to persist subscriptions
    const updateSubscriptions = (newSubscriptions) => {
        if (!currentUser) return;
        updateUser({ subscribedTickers: newSubscriptions });
    };

    // Simulation Effect
    useEffect(() => {
        const interval = setInterval(() => {
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
                return nextState;
            });

            // Personalized Activity Generation
            // Use active user logic matching Dashboard (Guest or Logged In)
            // For Guest: Demo tickers (NVDA, TSLA, etc.)
            // For User: explicitly subscribed tickers
            const activeTickers = currentUser
                ? (currentUser.subscribedTickers || []).map(s => typeof s === 'string' ? s : s.ticker)
                : ['NVDA', 'TSLA', 'AMZN', 'GOOG', 'META'];

            if (activeTickers.length > 0 && Math.random() > 0.98) { // 2% chance
                const ticker = activeTickers[Math.floor(Math.random() * activeTickers.length)];
                const types = ['positive', 'negative', 'neutral'];
                const type = types[Math.floor(Math.random() * types.length)];
                let message = "";

                if (type === 'positive') message = `${ticker} seeing high buy volume`;
                else if (type === 'negative') message = `${ticker} under selling pressure`;
                else message = `Analyst update for ${ticker}`;

                // Only add if not duplicate of very recent
                setMarketActivity(prev => {
                    const isrecent = prev.some(a => a.message === message && (new Date() - new Date(a.time)) < 5000);
                    if (isrecent) return prev;

                    return [{
                        id: Date.now() + Math.random(),
                        message: message,
                        type: type,
                        time: new Date()
                    }, ...prev].slice(0, 50);
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [currentUser]); // Re-run effect if user changes (to update activeTickers closure)

    const subscribe = (ticker, quantity = 1) => {
        if (!currentUser) return;
        const currentSubs = currentUser.subscribedTickers || [];

        // Handle migration/normalization: Ensure we work with objects or strings
        const isAlreadySubscribed = currentSubs.some(s => (typeof s === 'string' ? s : s.ticker) === ticker);

        if (isAlreadySubscribed) return;

        if (currentSubs.length >= 5) {
            alert("Max 5 subscriptions allowed");
            return;
        }

        // Add Subscription
        const newSub = { ticker, quantity, addedAt: new Date().toISOString() };
        const newSubscriptions = [...currentSubs, newSub];
        updateSubscriptions(newSubscriptions);

        // Log Activity
        addActivity(`Subscribed to ${quantity} share(s) of ${ticker}`, "neutral");
    };

    const unsubscribe = (ticker) => {
        if (!currentUser) return;
        const currentSubs = currentUser.subscribedTickers || [];

        // FIlter out the ticker (handling both string and object for backward compat)
        const newSubs = currentSubs.filter(s => (typeof s === 'string' ? s : s.ticker) !== ticker);

        updateSubscriptions(newSubs);
        addActivity(`Unsubscribed from ${ticker}`, "neutral");
    };

    const addActivity = (message, type = "neutral") => {
        setMarketActivity(prev => [{
            id: Date.now(),
            message,
            type, // positive, negative, neutral
            time: new Date()
        }, ...prev].slice(0, 50));
    };

    return (
        <StockContext.Provider value={{
            stocks: STOCKS_DATA,
            stockState,
            subscribe,
            unsubscribe,
            marketActivity
        }}>
            {children}
        </StockContext.Provider>
    );
}
