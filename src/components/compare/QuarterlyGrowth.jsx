import React from 'react';
import clsx from 'clsx';
import { Calendar } from 'lucide-react';

const COLORS = {
    NVDA: '#a78bfa',
    TSLA: '#f472b6',
    AMZN: '#fbbf24',
    GOOG: '#22d3ee',
    META: '#34d399'
};

// Deterministic Growth Generator
const getGrowth = (ticker, q) => {
    const seed = ticker.charCodeAt(0) + q;
    const val = (Math.sin(seed) * 10).toFixed(1);
    return val;
};

export default function QuarterlyGrowth({ stocks }) {
    if (!stocks.length) return null;

    return (
        <div className="bg-[#0f172a] rounded-2xl border border-white/5 p-6 md:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="text-primary" size={20} /> Quarterly Growth Overview
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="py-3 px-4 text-xs font-bold text-textMuted uppercase">Stock</th>
                            <th className="py-3 px-4 text-xs font-bold text-textMuted uppercase text-right">Q1 Growth</th>
                            <th className="py-3 px-4 text-xs font-bold text-textMuted uppercase text-right">Q2 Growth</th>
                            <th className="py-3 px-4 text-xs font-bold text-textMuted uppercase text-right">Q3 Growth</th>
                            <th className="py-3 px-4 text-xs font-bold text-textMuted uppercase text-right">Q4 (Est)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map(ticker => (
                            <tr key={ticker} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[ticker] }} />
                                    {ticker}
                                </td>
                                {[1, 2, 3, 4].map(q => {
                                    const val = getGrowth(ticker, q);
                                    const isPos = parseFloat(val) > 0;
                                    return (
                                        <td key={q} className={clsx("py-4 px-4 text-right font-mono text-sm", isPos ? "text-green-500" : "text-red-500")}>
                                            {isPos ? '+' : ''}{val}%
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
