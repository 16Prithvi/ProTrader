import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
import { format } from 'date-fns';

const formatCompactNumber = (number) => {
    return Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(number);
};

// Mock fundamentals
const getFundamentals = (ticker, price) => {
    const seed = ticker.length + price;
    return {
        mktCap: (100 + (seed % 500)).toFixed(1) + 'B',
        pe: (15 + (seed % 60)).toFixed(1),
        beta: (0.8 + (seed % 150) / 100).toFixed(2),
        eps: (2 + (seed % 10)).toFixed(2),
        yield: (0.5 + (seed % 5)).toFixed(2) + '%',
        growth6M: (5 + (seed % 20)).toFixed(1) + '%'
    };
};

export default function CompareStockCard({ ticker, data, color, onRemove }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const fundamentals = getFundamentals(ticker, data.price);
    const isPositive = data.changePercent >= 0;

    // Sparkline data (last 20 points)
    const sparkData = data.history.slice(-20).map(p => ({ value: p.price }));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            className="group relative bg-[#0f172a] rounded-2xl border border-white/5 overflow-hidden hover:border-white/20 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] transition-all"
        >
            {/* Top Gloss */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Header / Main Stat */}
            <div className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: color }} />
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight leading-none">{ticker}</h3>
                            <span className="text-[10px] text-textMuted font-medium uppercase tracking-wider">Equity</span>
                        </div>
                    </div>
                    {onRemove && (
                        <button
                            onClick={() => onRemove(ticker)}
                            className="p-1.5 rounded-full text-textMuted hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                <div className="flex items-end justify-between mt-4">
                    <div>
                        <div className="text-2xl font-bold text-white font-mono">${data.price.toFixed(2)}</div>
                        <div className={clsx("flex items-center gap-1 text-sm font-bold", isPositive ? "text-green-500" : "text-red-500")}>
                            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%</span>
                        </div>
                    </div>

                    {/* Sparkline */}
                    <div className="w-24 h-12 opacity-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparkData}>
                                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-textMuted">
                        <DollarSign size={12} className="text-primary" />
                        <span>Mkt Cap: <span className="text-white font-mono">{fundamentals.mktCap}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-textMuted">
                        <Zap size={12} className="text-yellow-400" />
                        <span>P/E: <span className="text-white font-mono">{fundamentals.pe}</span></span>
                    </div>
                </div>
            </div>

            {/* Expand Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-textMuted transition-colors border-t border-white/5"
            >
                {isExpanded ? 'Hide Details' : 'Show Details'}
                {isExpanded ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
            </button>

            {/* Collapsible Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#0b1120]"
                    >
                        <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-4 border-t border-white/5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-textMuted">Beta</span>
                                <span className="text-white font-mono">{fundamentals.beta}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textMuted">EPS</span>
                                <span className="text-white font-mono">${fundamentals.eps}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textMuted">Yield</span>
                                <span className="text-white font-mono">{fundamentals.yield}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-textMuted">6M Growth</span>
                                <span className={clsx("font-mono", parseFloat(fundamentals.growth6M) >= 0 ? "text-green-500" : "text-red-500")}>
                                    {fundamentals.growth6M}
                                </span>
                            </div>
                            <div className="col-span-2 pt-2 mt-1 border-t border-white/5">
                                <span className="text-textMuted block mb-1">Analyst Rating</span>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-green-500 w-[60%]" />
                                    <div className="h-full bg-yellow-500 w-[30%]" />
                                    <div className="h-full bg-red-500 w-[10%]" />
                                </div>
                                <div className="flex justify-between text-[10px] text-textMuted mt-1">
                                    <span>Buy (60%)</span>
                                    <span>Hold</span>
                                    <span>Sell</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
