import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function StockInsightCard({ data, index }) {
    const isPositive = data.netChange >= 0;
    const color = isPositive ? '#22c55e' : '#ef4444';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-5 hover:scale-[1.02] hover:ring-2 hover:ring-primary/20 transition-all cursor-default"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">{data.ticker}</h3>
                    <p className="text-xs text-textMuted">{data.name}</p>
                </div>
                <div className={clsx("px-2 py-1 rounded-lg text-xs font-bold", isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                    {isPositive ? '+' : ''}{data.netChange.toFixed(2)}%
                </div>
            </div>

            <div className="h-24 -mx-2 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.history}>
                        <defs>
                            <linearGradient id={`grad-${data.ticker}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color }}
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                            labelFormatter={(label) => `Day ${label}`}
                        />
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            fill={`url(#grad-${data.ticker})`}
                            strokeWidth={2}
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                <div>
                    <p className="text-[10px] text-textMuted uppercase">Range</p>
                    <p className="text-xs font-medium text-white">${data.low.toFixed(0)} - ${data.high.toFixed(0)}</p>
                </div>
                <div>
                    <p className="text-[10px] text-textMuted uppercase">Volatility</p>
                    <p className="text-xs font-medium text-white">{data.volatility.toFixed(2)}%</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-textMuted uppercase">Sessions</p>
                    <p className="text-xs font-medium text-success">{data.positiveSessions} / 7 Green</p>
                </div>
            </div>
        </motion.div>
    );
}
