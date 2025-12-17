import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useStocks } from '../../context/StockContext';
import { useAuth } from '../../context/AuthContext';
import { AVAILABLE_TICKERS } from '../../data/stocks';
import clsx from 'clsx';

export default function SubscriptionBar({ inputRef }) {
    const { subscribe } = useStocks();
    const { currentUser } = useAuth();
    const [selectedTicker, setSelectedTicker] = useState('');
    const [quantity, setQuantity] = useState(1);

    // subscribedTickers can be strings (old) or objects (new)
    const subscribed = currentUser?.subscribedTickers || [];
    const getTicker = (item) => typeof item === 'string' ? item : item.ticker;
    const isSubscribed = (ticker) => subscribed.some(s => getTicker(s) === ticker);

    const handleSubscribe = () => {
        if (!selectedTicker) return;
        subscribe(selectedTicker, Number(quantity));
        setSelectedTicker('');
        setQuantity(1);
    };

    const isMaxReached = subscribed.length >= 5;

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center py-2">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative group flex-1 md:flex-none">
                    <select
                        ref={inputRef}
                        value={selectedTicker}
                        onChange={(e) => setSelectedTicker(e.target.value)}
                        disabled={isMaxReached}
                        className="appearance-none bg-surfaceHighlight border border-white/5 text-textMain rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-full md:w-48 disabled:opacity-50"
                    >
                        <option value="" disabled>Select stock...</option>
                        {AVAILABLE_TICKERS.map(ticker => (
                            <option
                                key={ticker}
                                value={ticker}
                                disabled={isSubscribed(ticker)}
                                className="bg-surface"
                            >
                                {ticker} {isSubscribed(ticker) ? '(Added)' : ''}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-textMuted">
                        ▼
                    </div>
                </div>

                <div className="relative group">
                    <input
                        type="number"
                        min="1"
                        max="1000"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="bg-surfaceHighlight border border-white/5 text-textMain rounded-xl px-4 py-2.5 w-24 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-center"
                        placeholder="Qty"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-textMuted pointer-events-none">Shares</span>
                </div>

                <button
                    onClick={handleSubscribe}
                    disabled={!selectedTicker || isMaxReached}
                    className="bg-primary hover:bg-primary/90 disabled:bg-surfaceHighlight disabled:text-textMuted text-background font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Subscribe</span>
                </button>
                {isMaxReached && <span className="text-xs text-amber-500 font-medium">Max 5</span>}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">



            </div>
        </div>
    );
}
