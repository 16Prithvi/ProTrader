import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, AlertTriangle, Activity, BarChart2 } from 'lucide-react';
import clsx from 'clsx';

const StatBox = ({ label, value, subvalue, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="flex-1 bg-[#0f172a]/80 backdrop-blur border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors"
    >
        <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-500`}>
            <Icon size={20} />
        </div>
        <div>
            <div className="text-xs text-textMuted font-bold uppercase tracking-wider">{label}</div>
            <div className="text-lg font-bold text-white">{value}</div>
            {subvalue && <div className="text-[10px] text-textMuted">{subvalue}</div>}
        </div>
    </motion.div>
);

export default function CompareOverview({ stocks, stockData }) {
    if (!stocks || stocks.length < 2) return null;

    // Calculate metrics
    const sortedByPerf = [...stocks].sort((a, b) =>
        (stockData[b]?.changePercent || 0) - (stockData[a]?.changePercent || 0)
    );

    const best = sortedByPerf[0];
    const worst = sortedByPerf[stocks.length - 1];

    // Avg Volatility (Standard Deviation of changes - Mocked for now using beta-like proxy)
    const volatility = (stocks.reduce((acc, ticker) => acc + Math.abs(stockData[ticker]?.changePercent || 0), 0) / stocks.length).toFixed(2);

    // Market Stance
    const avgChange = stocks.reduce((acc, ticker) => acc + (stockData[ticker]?.changePercent || 0), 0) / stocks.length;
    let stance = 'Neutral';
    let stanceColor = 'gray';
    if (avgChange > 0.5) { stance = 'Bullish'; stanceColor = 'green'; }
    else if (avgChange < -0.5) { stance = 'Bearish'; stanceColor = 'red'; }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatBox
                label="Best Performer"
                value={best}
                subvalue={`+${stockData[best]?.changePercent.toFixed(2)}%`}
                icon={Trophy}
                color="yellow"
                delay={0}
            />
            <StatBox
                label="Market Stance"
                value={stance}
                subvalue={`Avg Change: ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}%`}
                icon={Activity}
                color={stanceColor}
                delay={0.1}
            />
            <StatBox
                label="Avg Volatility"
                value={`${volatility}%`}
                subvalue="Daily Deviation"
                icon={AlertTriangle}
                color="orange"
                delay={0.2}
            />
            <StatBox
                label="Laggard"
                value={worst}
                subvalue={`${stockData[worst]?.changePercent.toFixed(2)}%`}
                icon={BarChart2}
                color="blue"
                delay={0.3}
            />
        </div>
    );
}
