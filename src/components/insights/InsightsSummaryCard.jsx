import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { TrendingUp, Activity, Zap } from 'lucide-react';

export default function InsightsSummaryCard({ metrics }) {
    const riskColor =
        metrics.riskLevel === 'Stable' ? 'text-success bg-success/10 border-success/20' :
            metrics.riskLevel === 'Moderate' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' :
                'text-danger bg-danger/10 border-danger/20';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white mb-1">This Week's Performance Summary</h2>
                    <p className="text-sm text-textMuted">High-level view of how your portfolio behaved over the last simulated week.</p>
                </div>
                <div className={clsx("px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.3)] animate-pulse-slow", riskColor)}>
                    <div className="w-2 h-2 rounded-full bg-current" />
                    {metrics.riskLevel} Risk
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricTile
                    label="Total Weekly Return"
                    value={`${metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn}%`}
                    icon={TrendingUp}
                    color={metrics.totalReturn >= 0 ? 'text-success' : 'text-danger'}
                    delay={0.1}
                />
                <MetricTile
                    label="Best Performer"
                    value={`${metrics.bestPerformer.ticker} ${metrics.bestPerformer.change}`}
                    icon={Zap}
                    color="text-yellow-400"
                    delay={0.2}
                />
                <MetricTile
                    label="Most Volatile"
                    value={`${metrics.mostVolatile.ticker} ${metrics.mostVolatile.vol} var`}
                    icon={Activity}
                    color="text-purple-400"
                    delay={0.3}
                />
            </div>
        </motion.div>
    );
}

function MetricTile({ label, value, icon: Icon, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="bg-surfaceHighlight/30 rounded-xl p-4 border border-white/5 flex items-center gap-4"
        >
            <div className={clsx("p-3 rounded-lg bg-white/5", color)}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-xs text-textMuted uppercase tracking-wider font-semibold">{label}</div>
                <div className={clsx("text-lg font-bold", color)}>{value}</div>
            </div>
        </motion.div>
    );
}
