import React from 'react';
import { Newspaper } from 'lucide-react';
import { MOCK_HEADLINES } from '../../data/news';

export default function CompareNews({ stocks }) {
    if (!stocks || stocks.length === 0) return null;

    const relevantNews = MOCK_HEADLINES.filter(n => stocks.includes(n.tag));
    if (relevantNews.length === 0) return null;

    return (
        <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Newspaper className="text-textMuted" size={20} /> Relevant Headlines
                </h3>
                <button className="text-xs text-primary font-bold hover:underline">View All News</button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {relevantNews.map(news => (
                    <div
                        key={news.id}
                        className="min-w-[280px] md:min-w-[320px] p-5 rounded-2xl bg-[#0f172a] border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{news.tag}</span>
                            <span className="text-[10px] text-textMuted">{news.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-2">{news.title}</h4>
                        <div className="mt-auto pt-3 border-t border-white/5 flex gap-2">
                            <span className={`text-[10px] uppercase font-bold ${news.sentiment === 'Positive' ? 'text-green-500' : 'text-red-500'}`}>
                                {news.sentiment} Sentiment
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
