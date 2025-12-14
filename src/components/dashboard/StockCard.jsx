import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';
import { useStocks } from '../../context/StockContext';

export default function StockCard({ ticker, quantity = 1 }) {
    const { stocks, stockState, unsubscribe } = useStocks();

    const stockInfo = stocks[ticker];
    const stockData = stockState[ticker];

    if (!stockInfo || !stockData) return null;

    const isPositive = stockData.change >= 0;
    const color = isPositive ? '#22c55e' : '#ef4444';

    // Format history for sparkline
    const chartData = stockData.history.map(point => ({ value: point.price }));

    // Calculate position value
    const positionValue = stockData.price * quantity;

    return (
        <div className="glass-card rounded-2xl p-5 relative group hover:-translate-y-1 transition-transform duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">{stockInfo.name} ({ticker})</h3>
                    <div className="text-sm font-medium text-textMuted mt-1">
                        {quantity} Share{quantity > 1 ? 's' : ''} • <span className="text-white font-semibold tabular-nums">${positionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
                <button
                    onClick={() => unsubscribe(ticker)}
                    className="p-1.5 rounded-lg text-textMuted hover:text-danger hover:bg-white/5 transition-colors"
                    title="Unsubscribe"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Big Price & Change */}
            <div className="mb-6">
                <div className="text-4xl font-bold text-white tabular-nums tracking-tight">
                    ${stockData.price.toFixed(2)}
                </div>
                <div className={clsx("flex items-center gap-2 mt-1 font-medium", isPositive ? "text-success" : "text-danger")}>
                    {stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                    <span className="text-textMuted text-xs ml-1 font-normal">Today</span>
                </div>
            </div>

            {/* Sparkline (Smaller) */}
            <div className="h-16 -mx-2 mb-6 relative opacity-80 hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={`gradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="90%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin', 'dataMax']} hide={true} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            fill={`url(#gradient-${ticker})`}
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm pt-4 border-t border-white/5">
                <div className="flex justify-between">
                    <span className="text-textMuted">Open</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.open?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textMuted">Volume</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.volume}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textMuted">Day High</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.dayHigh?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textMuted">Mkt Cap</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.marketCap}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textMuted">Day Low</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.dayLow?.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-textMuted">P/E Ratio</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.peRatio}</span>
                </div>
            </div>
        </div>
    );
}
