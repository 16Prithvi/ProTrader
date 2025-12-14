import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, Info, PieChart } from 'lucide-react';

const ICONS = {
    volatility: AlertTriangle,
    outperformance: Lightbulb,
    concentration: PieChart,
    risk: Info
};

const COLORS = {
    volatility: 'text-amber-500',
    outperformance: 'text-yellow-400',
    concentration: 'text-blue-400',
    risk: 'text-purple-400'
};

export default function InsightTextCard({ type, title, subtext, index }) {
    const Icon = ICONS[type] || Info;
    const color = COLORS[type] || 'text-primary';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + (index * 0.1) }}
            className="glass-card p-5 rounded-xl border border-white/5 flex gap-4 items-start"
        >
            <div className={`p-2 rounded-lg bg-white/5 ${color} shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-white font-medium text-sm leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: title }} />
                <p className="text-xs text-textMuted">{subtext}</p>
            </div>
        </motion.div>
    );
}
