import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertCircle, Zap } from 'lucide-react';

export default function SmartInsights({ stocks, stockData }) {
    const insights = useMemo(() => {
        if (!stocks || stocks.length < 2) return [];
        const items = [];

        // 1. Performance Insight
        const sorted = [...stocks].sort((a, b) => (stockData[b]?.changePercent || 0) - (stockData[a]?.changePercent || 0));
        const winner = sorted[0];
        const loser = sorted[stocks.length - 1];
        const diff = (stockData[winner].changePercent - stockData[loser].changePercent).toFixed(2);

        items.push({
            icon: TrendingUp,
            color: 'green',
            text: `${winner} displays stronger momentum, outperforming ${loser} by +${diff}% in the current session.`
        });

        // 2. Volatility Insight (Mock)
        items.push({
            icon: AlertCircle,
            color: 'orange',
            text: `${loser} shows elevated volatility (Beta > 1.2), suggesting higher risk relative to the portfolio.`
        });

        // 3. Sector Insight (Mock)
        const techStocks = stocks.filter(s => ['NVDA', 'GOOG', 'META'].includes(s));
        if (techStocks.length >= 2) {
            items.push({
                icon: Zap,
                color: 'blue',
                text: `Tech sector cohesion: ${techStocks.join(' & ')} are moving in sympathy with broad sector trends.`
            });
        }

        return items;
    }, [stocks, stockData]);

    if (stocks.length < 2) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lightbulb className="text-yellow-400" size={20} /> Smart Insights
            </h3>
            <div className="space-y-3">
                {insights.map((insight, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-xl bg-[#0f172a] border border-white/5 flex gap-4 hover:bg-white/5 transition-colors"
                    >
                        <div className={`p-2 rounded-lg bg-${insight.color}-500/10 text-${insight.color}-500 h-fit`}>
                            <insight.icon size={18} />
                        </div>
                        <p className="text-sm text-textMuted leading-relaxed">
                            {insight.text}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
