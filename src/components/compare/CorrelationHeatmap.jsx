import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Info } from 'lucide-react';

// Math Helper: Pearson Correlation Calculator
const calculateCorrelation = (x, y) => {
    if (x.length !== y.length || x.length === 0) return 0;
    const n = x.length;
    let sum_x = 0, sum_y = 0, sum_xy = 0, sum_x2 = 0, sum_y2 = 0;
    for (let i = 0; i < n; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += x[i] * y[i];
        sum_x2 += x[i] * x[i];
        sum_y2 += y[i] * y[i];
    }
    const numerator = n * sum_xy - sum_x * sum_y;
    const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));
    return denominator === 0 ? 0 : numerator / denominator;
};

export default function CorrelationHeatmap({ stocks, stockData }) {
    const correlations = useMemo(() => {
        if (!stocks || stocks.length < 2) return null;
        const prices = {};
        stocks.forEach(t => {
            // Use last 50 data points for calculation
            prices[t] = stockData[t]?.history?.slice(-50).map(p => p.price) || [];
        });

        const matrix = {};
        stocks.forEach(rowTicker => {
            matrix[rowTicker] = {};
            stocks.forEach(colTicker => {
                const corr = calculateCorrelation(prices[rowTicker], prices[colTicker]);
                matrix[rowTicker][colTicker] = corr;
            });
        });
        return matrix;
    }, [stocks, stockData]);

    if (!correlations) return null;

    // Helper to get color
    const getColor = (val) => {
        if (val === 1) return 'bg-white/10 text-white'; // Self
        if (val > 0.7) return 'bg-green-500/20 text-green-400';
        if (val > 0.3) return 'bg-green-500/10 text-green-500/70';
        if (val < -0.3) return 'bg-red-500/20 text-red-400';
        return 'bg-white/5 text-textMuted'; // Neutral
    };

    return (
        <div className="bg-[#0f172a] rounded-2xl border border-white/5 p-6 md:col-span-1 lg:col-span-1 border-t-4 border-t-primary/50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Correlation Matrix</h3>
                    <p className="text-xs text-textMuted mt-1">Movement Co-efficiency (Last 50 periods)</p>
                </div>
                <Info size={16} className="text-textMuted hover:text-white cursor-pointer" />
            </div>

            <div className="overflow-x-auto">
                <div className="grid" style={{ gridTemplateColumns: `auto repeat(${stocks.length}, minmax(40px, 1fr))` }}>
                    {/* Header Row */}
                    <div className="h-10"></div>
                    {stocks.map(t => (
                        <div key={t} className="h-10 flex items-center justify-center font-bold text-xs text-textMuted">{t}</div>
                    ))}

                    {/* Data Rows */}
                    {stocks.map(row => (
                        <React.Fragment key={row}>
                            <div className="h-10 flex items-center pr-4 font-bold text-xs text-textMuted">{row}</div>
                            {stocks.map(col => {
                                const val = correlations[row][col];
                                return (
                                    <div
                                        key={`${row}-${col}`}
                                        className={clsx(
                                            "h-10 m-0.5 rounded flex items-center justify-center text-xs font-mono font-bold transition-all hover:scale-110 cursor-default",
                                            getColor(val)
                                        )}
                                        title={`${row} & ${col}: ${val.toFixed(2)}`}
                                    >
                                        {val.toFixed(2)}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="mt-4 text-[10px] text-textMuted italic bg-white/5 p-2 rounded text-center">
                Correlation range: -1.0 (Inverse) to +1.0 (Identical)
            </div>
        </div>
    );
}
