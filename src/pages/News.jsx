import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Search, Tag, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import clsx from 'clsx';

import { MOCK_HEADLINES } from '../data/news';

const SENTIMENT_DATA = [
    { name: 'Positive', value: 3, color: '#22c55e' },
    { name: 'Neutral', value: 2, color: '#eab308' },
    { name: 'Negative', value: 1, color: '#ef4444' },
];

export default function News() {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const categories = ['All', 'Tech', 'Auto', 'AI', 'E-commerce', 'Macro'];

    const filteredNews = MOCK_HEADLINES.filter(item => {
        const matchesFilter = filter === 'All' || item.category === filter || item.tag === filter;
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.tag.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6 h-full">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Market News</h1>
                    <p className="text-textMuted">Stay updated with the latest headlines moving the market.</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surfaceHighlight/30 p-2 rounded-xl border border-white/5">
                    <div className="flex bg-surfaceHighlight/50 p-1 rounded-lg overflow-x-auto w-full md:w-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={clsx(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                    filter === cat
                                        ? "bg-primary/20 text-primary shadow-sm"
                                        : "text-textMuted hover:text-white"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search headlines..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 pl-10 text-sm text-textMain focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <Search className="w-4 h-4 text-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    {/* Main Feed */}
                    <div className="xl:col-span-2 space-y-4">
                        {filteredNews.map(item => (
                            <div key={item.id} className="glass-card p-5 rounded-2xl hover:bg-surfaceHighlight/50 transition-all border border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2">
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{item.tag}</span>
                                        <span className="text-xs text-textMuted bg-white/5 px-2 py-1 rounded border border-white/5">{item.category}</span>
                                    </div>
                                    <span className={clsx(
                                        "text-xs px-2 py-1 rounded border",
                                        item.sentiment === 'Positive' ? 'text-success border-success/20 bg-success/5' :
                                            item.sentiment === 'Negative' ? 'text-danger border-danger/20 bg-danger/5' :
                                                'text-amber-400 border-amber-400/20 bg-amber-400/5'
                                    )}>
                                        {item.sentiment}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-textMuted text-sm mb-3">{item.summary}</p>
                                <div className="flex items-center gap-2 text-xs text-textMuted">
                                    <span>{item.time}</span>
                                    <span>•</span>
                                    <span>MarketWire</span>
                                </div>
                            </div>
                        ))}
                        {filteredNews.length === 0 && (
                            <div className="text-center py-12 text-textMuted">No news found matching your filters.</div>
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" /> Trending Tickers
                            </h3>
                            <div className="space-y-3">
                                {['NVDA', 'TSLA', 'AI', 'RateCut'].map((tag, i) => (
                                    <div key={tag} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                                        <span className="text-sm font-medium text-white flex items-center gap-2">
                                            <span className="text-textMuted">#{i + 1}</span> {tag}
                                        </span>
                                        <span className="text-xs text-success font-medium">+{(5 - i) * 12}% visits</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <PieIcon className="w-5 h-5 text-secondary" /> Sentiment Analysis
                            </h3>
                            <div className="h-[200px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={SENTIMENT_DATA}
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {SENTIMENT_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                    <span className="text-2xl font-bold text-white">6</span>
                                    <span className="block text-[10px] text-textMuted uppercase">Stories</span>
                                </div>
                            </div>
                            <p className="text-sm text-center text-textMuted mt-2">
                                Today's market mood is <span className="text-success font-bold">Positive</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
