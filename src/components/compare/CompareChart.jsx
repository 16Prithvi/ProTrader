import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import clsx from 'clsx';
import { GitCompare, Maximize } from 'lucide-react';

const COLORS = {
    NVDA: '#a78bfa',
    TSLA: '#f472b6',
    AMZN: '#fbbf24',
    GOOG: '#22d3ee',
    META: '#34d399'
};

export default function CompareChart({ stocks, stockData }) {
    // Modes: 'Price' | 'Normalized'
    const [mode, setMode] = useState('Normalized');
    const [range, setRange] = useState('1M');

    // Prepare Data
    const chartData = useMemo(() => {
        if (!stocks.length) return [];
        const baseTicker = stocks[0];
        // Ensure we have history
        if (!stockData[baseTicker]?.history) return [];

        const history = stockData[baseTicker].history;
        let slice = history;
        if (range === '1W') slice = history.slice(-20);
        if (range === '1M') slice = history.slice(-50);
        if (range === '3M') slice = history.slice(-100);

        return slice.map((point, index) => {
            const entry = {
                time: point.time,
                label: format(new Date(point.time), 'MMM d')
            };

            stocks.forEach(t => {
                const h = stockData[t]?.history;
                if (!h) return;
                // Safe access with matching length logic (simple index match for simulation)
                const dataPoint = h[h.length - slice.length + index];
                if (!dataPoint) return;

                if (mode === 'Price') {
                    entry[t] = dataPoint.price;
                } else {
                    const basePrice = h[h.length - slice.length].price;
                    entry[t] = ((dataPoint.price - basePrice) / basePrice) * 100;
                }
            });
            return entry;
        });
    }, [stocks, stockData, mode, range]);

    return (
        <div className="bg-[#0f172a] rounded-2xl border border-white/5 p-1 pb-4 md:col-span-2 lg:col-span-2 relative">
            {/* Header / Controls */}
            <div className="flex flex-wrap justify-between items-center p-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <GitCompare size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">Performance Differential</h3>
                        <div className="text-xs text-textMuted">Comp. Return vs Price Action</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-[#0b1120] rounded-lg p-1 border border-white/5">
                        {['Price', 'Normalized'].map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={clsx(
                                    "px-3 py-1 rounded text-xs font-bold transition-all",
                                    mode === m ? "bg-white/10 text-white shadow" : "text-textMuted hover:text-white"
                                )}
                            >
                                {m === 'Normalized' ? '% Change' : 'Price'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-[320px] w-full mt-4 px-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            {stocks.map(t => (
                                <linearGradient key={t} id={`grad-${t}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={COLORS[t] || '#fff'} stopOpacity={0.1} />
                                    <stop offset="100%" stopColor={COLORS[t] || '#fff'} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="label" hide />
                        <YAxis
                            orientation="right"
                            tickFormatter={v => mode === 'Normalized' ? `${v.toFixed(0)}%` : `${v}`}
                            stroke="#475569"
                            fontSize={10}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', fontSize: '12px' }}
                            itemStyle={{ fontWeight: 'bold' }}
                            formatter={(val) => mode === 'Normalized' ? `${val.toFixed(2)}%` : val.toFixed(2)}
                            labelStyle={{ color: '#94a3b8' }}
                        />
                        {mode === 'Normalized' && <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />}

                        {stocks.map(t => (
                            <Area
                                key={t}
                                type="monotone"
                                dataKey={t}
                                stroke={COLORS[t] || '#fff'}
                                fill={`url(#grad-${t})`}
                                strokeWidth={2}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend / Range */}
            <div className="flex justify-between items-center px-6 mt-2">
                <div className="flex gap-4">
                    {stocks.map(t => (
                        <div key={t} className="flex items-center gap-2 text-xs font-bold text-textMuted">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[t] || '#fff' }} />
                            {t}
                        </div>
                    ))}
                </div>
                <div className="flex bg-white/5 rounded p-0.5">
                    {['1W', '1M', '3M'].map(r => (
                        <button key={r} onClick={() => setRange(r)} className={clsx("px-2 py-0.5 rounded text-[10px] font-bold", range === r ? "bg-primary/20 text-primary" : "text-textMuted")}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
