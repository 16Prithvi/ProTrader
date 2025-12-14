import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStocks } from '../../context/StockContext';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import { format } from 'date-fns';

const COLORS = ['#38bdf8', '#22c55e', '#ef4444', '#eab308', '#a855f7'];

export default function LiveMultiChart() {
    const { stockState } = useStocks();
    const { currentUser } = useAuth();
    const [mode, setMode] = useState('Normalized'); // 'Price' or 'Normalized'
    const [hiddenSeries, setHiddenSeries] = useState([]);

    const subscribed = currentUser?.subscribedTickers || ['NVDA', 'TSLA', 'AMZN', 'GOOG', 'META'];

    const toggleSeries = (dataKey) => {
        setHiddenSeries(prev =>
            prev.includes(dataKey) ? prev.filter(k => k !== dataKey) : [...prev, dataKey]
        );
    };

    const chartData = useMemo(() => {
        if (subscribed.length === 0) return [];

        // Normalize tickers
        const tickers = subscribed.map(s => typeof s === 'string' ? s : s.ticker);
        const baseTicker = tickers[0];
        const baseHistory = stockState[baseTicker]?.history || [];

        return baseHistory.map((point, index) => {
            const dataPoint = { time: point.time };
            tickers.forEach(ticker => {
                const stockHistory = stockState[ticker]?.history;
                if (stockHistory && stockHistory[index]) {
                    if (mode === 'Normalized') {
                        const startPrice = stockHistory[0].price;
                        const currentPrice = stockHistory[index].price;
                        dataPoint[ticker] = ((currentPrice - startPrice) / startPrice) * 100;
                    } else {
                        dataPoint[ticker] = stockHistory[index].price;
                    }
                }
            });
            return dataPoint;
        });
    }, [stockState, subscribed, mode]);

    if (subscribed.length === 0) return null;

    // Snapshot Data for Header
    const snapshot = subscribed.map(sub => {
        const ticker = typeof sub === 'string' ? sub : sub.ticker;
        const data = stockState[ticker];
        return { ticker, change: data?.changePercent || 0 };
    });

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white">Live Market Lines</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                        {snapshot.map((s, i) => (
                            <span key={s.ticker} className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                                <span className="text-textMuted">{s.ticker}</span>
                                <span className={s.change >= 0 ? "text-success" : "text-danger"}>
                                    {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                                </span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex bg-surfaceHighlight/50 p-1 rounded-lg border border-white/5">
                    {['Price', 'Normalized'].map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={clsx(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                mode === m
                                    ? "bg-primary/20 text-primary border border-primary/20"
                                    : "text-textMuted hover:text-white"
                            )}
                        >
                            {m === 'Normalized' ? '%' : '$'} {m}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="time"
                            hide={true}
                            tickFormatter={(t) => format(t, 'ss')}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            domain={['auto', 'auto']}
                            tickFormatter={(val) => mode === 'Normalized' ? `${val.toFixed(2)}%` : `$${val}`}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '12px' }}
                            labelStyle={{ display: 'none' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                            formatter={(value, name) => [
                                mode === 'Normalized' ? `${Number(value).toFixed(2)}%` : `$${Number(value).toFixed(2)}`,
                                name
                            ]}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                            onClick={(e) => toggleSeries(e.dataKey)}
                            iconType="circle"
                        />
                        {subscribed.map((sub, i) => {
                            const ticker = typeof sub === 'string' ? sub : sub.ticker;
                            return (
                                <Line
                                    key={ticker}
                                    type="monotone"
                                    dataKey={ticker}
                                    stroke={COLORS[i % COLORS.length]}
                                    strokeWidth={hiddenSeries.includes(ticker) ? 0 : 2}
                                    strokeOpacity={hiddenSeries.includes(ticker) ? 0 : 1}
                                    dot={false}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    isAnimationActive={false}
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>

                {/* Legend Hint */}
                <div className="absolute top-2 right-2 text-[10px] text-textMuted/40 pointer-events-none">
                    Click legend to filter
                </div>
            </div>
        </div>
    );
}
