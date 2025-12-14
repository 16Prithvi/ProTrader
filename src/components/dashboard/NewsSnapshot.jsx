import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight } from 'lucide-react';

const MOCK_NEWS = [
    { id: 1, tag: 'TSLA', sentiment: 'Positive', title: 'Tesla surprises with Q4 deliveries beat', time: '5 min ago' },
    { id: 2, tag: 'Market', sentiment: 'Neutral', title: 'Fed Signals Pause in Rate Hikes', time: '1 hr ago' },
    { id: 3, tag: 'NVDA', sentiment: 'Positive', title: 'AI Chip Demand Soars to New Highs', time: '2 hrs ago' },
];

export default function NewsSnapshot() {
    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-textMuted" />
                    Market News
                </h3>
                <Link to="/news" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MOCK_NEWS.map(item => (
                    <Link to="/news" key={item.id} className="block p-4 rounded-xl bg-surfaceHighlight/30 border border-white/5 hover:bg-surfaceHighlight/50 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded mr-2">{item.tag}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.sentiment === 'Positive' ? 'text-success border-success/20 bg-success/5' :
                                    'text-textMuted border-white/10'
                                }`}>
                                {item.sentiment}
                            </span>
                        </div>
                        <h4 className="font-medium text-textMain text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                            {item.title}
                        </h4>
                        <p className="text-xs text-textMuted">{item.time}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
