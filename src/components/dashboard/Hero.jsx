import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import clsx from 'clsx';

export default function Hero({ totalValue, change, changePercent, topGainer, marketStats }) {
    const isPositive = change >= 0;

    return (
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-textMuted text-sm font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" /> Portfolio Value
                    </h2>
                    <h1 className="text-5xl font-bold text-white mb-2 tabular-nums">
                        ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h1>
                    <div className={clsx("inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg text-sm", isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>${Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Top Gainer Card */}
                    {topGainer && (
                        <div className="bg-white/5 rounded-xl p-3 w-40 backdrop-blur-sm border border-white/5 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-3 h-3 text-success" />
                                <span className="text-[10px] text-textMuted font-medium uppercase tracking-wider">Top Gainer</span>
                            </div>
                            <div className="font-bold text-white text-lg tabular-nums leading-tight">
                                {topGainer.ticker}
                            </div>
                            <span className="text-xs text-success font-semibold">
                                +{topGainer.changePercent.toFixed(2)}%
                            </span>
                        </div>
                    )}

                    {/* Market Overview Card */}
                    {marketStats && (
                        <div className="bg-white/5 rounded-xl p-3 w-40 backdrop-blur-sm border border-white/5 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] text-textMuted font-medium uppercase tracking-wider">Watchlist</span>
                            </div>
                            <div className="flex flex-col gap-0.5 mt-0.5">
                                <div className="flex items-center gap-1.5">
                                    <ArrowUpRight className="w-3 h-3 text-success" />
                                    <span className="text-xs font-medium text-white">{marketStats.rising} Rising</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ArrowDownRight className="w-3 h-3 text-danger" />
                                    <span className="text-xs font-medium text-white">{marketStats.falling} Falling</span>
                                </div>
                            </div>
                        </div>
                    )}



                </div>
            </div>
        </div>
    );
}
