import React from 'react';
import { motion } from 'framer-motion';

export default function WeeklyHeatmap({ data }) {
    // Expected data: array of { ticker, days: [PercentChange, ...] }

    const getColor = (val) => {
        if (val > 3) return 'bg-green-500';
        if (val > 1) return 'bg-green-600';
        if (val > 0) return 'bg-green-800';
        if (val === 0) return 'bg-slate-700'; // Flat
        if (val > -1) return 'bg-red-900';
        if (val > -3) return 'bg-red-700';
        return 'bg-red-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="glass-card rounded-2xl p-6 mt-8"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Weekly Performance Heatmap</h3>
                <p className="text-sm text-textMuted">See which days and stocks drove your returns.</p>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[600px] grid grid-cols-[80px_repeat(7,1fr)] gap-2">
                    {/* Header Row */}
                    <div className="text-xs font-bold text-textMuted self-center">Ticker</div>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="text-center text-xs text-textMuted font-medium">Day {i + 1}</div>
                    ))}

                    {/* Rows */}
                    {data.map(stock => (
                        <React.Fragment key={stock.ticker}>
                            <div className="text-sm font-bold text-white self-center">{stock.ticker}</div>
                            {stock.days.map((val, i) => (
                                <div
                                    key={i}
                                    title={val !== null ? `${stock.ticker} - Day ${i + 1}: ${val > 0 ? '+' : ''}${val.toFixed(2)}%` : 'Market Closed'}
                                    className={`h-8 rounded md:rounded-lg ${val !== null ? getColor(val) : 'bg-surfaceHighlight/20'} hover:opacity-80 transition-opacity cursor-pointer`}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
