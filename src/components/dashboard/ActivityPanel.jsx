import React from 'react';
import { useStocks } from '../../context/StockContext';
import { Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export default function ActivityPanel() {
    const { marketActivity } = useStocks();

    return (
        <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {marketActivity.length === 0 ? (
                    <p className="text-textMuted text-sm text-center py-8">No recent activity</p>
                ) : (
                    marketActivity.map((activity) => (
                        <div key={activity.id} className="flex gap-3 items-start animate-fade-in">
                            <div className={clsx(
                                "w-2 h-2 mt-1.5 rounded-full shrink-0",
                                activity.type === 'positive' ? 'bg-success' :
                                    activity.type === 'negative' ? 'bg-danger' : 'bg-primary'
                            )} />
                            <div>
                                <p className="text-sm text-textMain">{activity.message}</p>
                                <p className="text-xs text-textMuted">{formatDistanceToNow(activity.time, { addSuffix: true })}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
