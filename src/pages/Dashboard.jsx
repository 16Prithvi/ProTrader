import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStocks } from '../context/StockContext';
import DashboardLayout from '../layouts/DashboardLayout';
import Hero from '../components/dashboard/Hero';
import SubscriptionBar from '../components/dashboard/SubscriptionBar';
import MyStocksGrid from '../components/dashboard/MyStocksGrid';
import LiveMultiChart from '../components/dashboard/LiveMultiChart';
import ActivityPanel from '../components/dashboard/ActivityPanel';
import NewsSnapshot from '../components/dashboard/NewsSnapshot';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const { stockState } = useStocks();

    // Demo User for Guests
    const DEMO_USER = {
        name: 'Guest Trader',
        subscribedTickers: ['NVDA', 'TSLA', 'AMZN', 'GOOG', 'META']
    };

    const activeUser = currentUser || DEMO_USER;

    // Calculate Portfolio Value
    const portfolioData = useMemo(() => {
        if (!activeUser || !activeUser.subscribedTickers) return { total: 0, history: [] };

        let totalValue = 0;
        let totalChange = 0;

        let topGainer = null;
        let risingCount = 0;
        let fallingCount = 0;

        // Sum up prices and find stats
        activeUser.subscribedTickers.forEach(sub => {
            // Normalize sub: could be string (legacy) or object { ticker, quantity }
            const ticker = typeof sub === 'string' ? sub : sub.ticker;
            // Demo quantity logic
            const quantity = typeof sub === 'string' ? (currentUser ? 1 : 10) : sub.quantity;

            const stock = stockState[ticker];
            if (stock) {
                const stockValue = stock.price * quantity;
                const stockChange = stock.change * quantity;

                totalValue += stockValue;
                totalChange += stockChange;

                // Track Top Gainer (Per stock performance, not total value change)
                if (!topGainer || stock.changePercent > topGainer.changePercent) {
                    topGainer = { ...stock, ticker };
                }

                // Track Market Stats
                if (stock.change >= 0) risingCount++;
                else fallingCount++;
            }
        });

        return {
            total: totalValue,
            change: totalChange,
            changePercent: totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0,
            topGainer,
            marketStats: { rising: risingCount, falling: fallingCount }
        };
    }, [currentUser, activeUser, stockState]);

    return (
        <DashboardLayout>
            {!currentUser && (
                <div className="w-full bg-gradient-to-r from-primary to-secondary p-4 rounded-xl mb-6 flex justify-between items-center shadow-lg shadow-primary/20">
                    <div>
                        <h2 className="text-white font-bold text-lg">Welcome to ProTrader Preview</h2>
                        <p className="text-white/80 text-sm">You are viewing a live demo. Sign up to manage your own real-time portfolio.</p>
                    </div>
                    <a href="/signup" className="px-6 py-2 bg-white text-primary font-bold rounded-lg shadow-sm hover:scale-105 transition-transform">
                        Get Started
                    </a>
                </div>
            )}
            <Hero
                totalValue={portfolioData.total}
                change={portfolioData.change}
                changePercent={portfolioData.changePercent}
                subscribedCount={activeUser?.subscribedTickers?.length || 0}
                topGainer={portfolioData.topGainer}
                marketStats={portfolioData.marketStats}
            />

            <SubscriptionBar />

            {/* Full Width Stock Grid */}
            <div id="my-stocks-grid" className="mb-8">
                <MyStocksGrid />
            </div>

            {/* Main Content Split: Charts & Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <div className="xl:col-span-2 space-y-6">
                    <div className="glass-card p-6">
                        <LiveMultiChart />
                    </div>
                    <NewsSnapshot />
                </div>

                <div className="xl:col-span-1">
                    <ActivityPanel />
                </div>
            </div>
        </DashboardLayout>
    );
}
