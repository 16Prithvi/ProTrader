import React, { useState } from 'react';
import { useStocks } from '../../context/StockContext';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Pin, Activity, Clock } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

export default function FocusedStockPanel() {
    const { pinnedStock, stockState, stocks, setPinnedStock } = useStocks();
    const [range, setRange] = useState('1m'); // Mock range: 1m, 5m, 15m

    if (!pinnedStock || !stockState[pinnedStock]) {
        return (
            <div className="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                <div className="p-4 bg-surfaceHighlight/50 rounded-full">
                    <Pin className="w-8 h-8 text-textMuted" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">No Stock Focused</h3>
                    <p className="text-sm text-textMuted mt-1">Pin a stock from your dashboard cards to see detailed real-time analysis here.</p>
                </div>
                <button
                    onClick={() => document.getElementById('my-stocks-grid')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors text-primary"
                >
                    Go to My Stocks
                </button>
            </div>
        );
    }

    const stock = stocks[pinnedStock];
    const data = stockState[pinnedStock];
    const isPositive = data.change >= 0;
    const color = isPositive ? '#22c55e' : '#ef4444';

    // Slice history based on mock range (just visual slicing for effect)
    const historySlice = range === '1m' ? data.history :
        range === '5m' ? data.history.slice(-30) :
            data.history.slice(-10);

    return (
        <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">{stock.name}</h3>
                        <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded text-textMuted">{pinnedStock}</span>
                    </div>
                    <div className="flex items-baseline gap-3 mt-1">
                        <span className="text-3xl font-bold text-white tabular-nums">${data.price.toFixed(2)}</span>
                        <span className={clsx("flex items-center text-sm font-semibold", isPositive ? "text-success" : "text-danger")}>
                            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {data.change > 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setPinnedStock(null)}
                    className="p-2 hover:bg-white/5 rounded-lg text-textMuted hover:text-white transition-colors"
                    title="Unpin"
                >
                    <Pin className="w-4 h-4 fill-current text-primary" />
                </button>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-[200px] mb-4 relative group">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historySlice}>
                        <YAxis domain={['auto', 'auto']} hide={true} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ display: 'none' }}
                            formatter={(val) => [`$${val.toFixed(2)}`, 'Price']}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke={color}
                            strokeWidth={3}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>

                {/* Range Selector Overlay */}
                <div className="absolute top-0 right-0 flex gap-1 bg-surface/50 backdrop-blur px-1 py-1 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {['1m', '5m', '15m'].map(r => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={clsx(
                                "px-2 py-0.5 text-[10px] font-bold rounded",
                                range === r ? "bg-white text-surface" : "text-textMuted hover:text-white"
                            )}
                        >
                            {r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                <div className="space-y-1">
                    <p className="text-[10px] uppercase text-textMuted font-semibold flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Volatility
                    </p>
                    <p className="text-sm font-medium text-white">Low (0.4%)</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] uppercase text-textMuted font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Updated
                    </p>
                    <p className="text-sm font-medium text-white tabular-nums">{format(new Date(), 'HH:mm:ss')}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase text-textMuted font-semibold">High (Session)</p>
                    <p className="text-sm font-medium text-white">${(data.price * 1.02).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase text-textMuted font-semibold">Low (Session)</p>
                    <p className="text-sm font-medium text-white">${(data.price * 0.98).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
