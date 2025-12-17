import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StockCard from './StockCard';
import { PlusCircle } from 'lucide-react';

export default function MyStocksGrid({ tickers, isFiltered, onAddStock }) {
    const { currentUser } = useAuth();
    // Use props if available (filtered view), otherwise fallback to all subscriptions
    const displayTickers = tickers || currentUser?.subscribedTickers || [];

    if (displayTickers.length === 0) {
        return (
            <div className="glass-card rounded-2xl p-8 text-center border-dashed border-white/20">
                <button
                    onClick={onAddStock}
                    className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-surfaceHighlight text-primary animate-pulse hover:bg-primary/20 cursor-pointer transition-colors"
                >
                    <PlusCircle className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold text-white mb-2">
                    {isFiltered ? "No stocks match filter" : "No stocks yet"}
                </h3>
                <p className="text-textMuted mb-4">
                    {isFiltered
                        ? "Try changing your filter or adding more stocks."
                        : "Subscribe to stocks using the bar above to start tracking your portfolio."}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayTickers.map(sub => {
                const ticker = typeof sub === 'string' ? sub : sub.ticker;
                const quantity = typeof sub === 'string' ? 1 : sub.quantity;
                return <StockCard key={ticker} ticker={ticker} quantity={quantity} />;
            })}
        </div>
    );
}
