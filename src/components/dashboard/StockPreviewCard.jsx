import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { X, Bell } from 'lucide-react';
import PriceAlertModal from './PriceAlertModal';

export default function StockPreviewCard() {
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    // Hardcoded mock data to match the visual reference (Alphabet Inc. GOOG)
    const stockInfo = {
        name: 'Alphabet Inc.',
        ticker: 'GOOG',
        price: 318.20,
        change: 9.20,
        changePercent: 2.98,
        open: 308.00,
        volume: '15.2M',
        dayHigh: 312.20,
        marketCap: '1.95T',
        dayLow: 305.50,
        peRatio: 26.5
    };

    // Simulated chart data for the sparkline (upward trend)
    const chartData = [
        { value: 308 }, { value: 306 }, { value: 309 }, { value: 307 }, { value: 311 },
        { value: 310 }, { value: 315 }, { value: 314 }, { value: 313 }, { value: 316 },
        { value: 314 }, { value: 315 }, { value: 317 }, { value: 316 }, { value: 318 },
        { value: 318.20 }
    ];

    const isPositive = stockInfo.change >= 0;
    const color = isPositive ? '#22c55e' : '#ef4444';

    return (
        <div className="bg-[#0B1221] rounded-2xl p-5 relative border border-white/10 w-full max-w-sm shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">{stockInfo.name} ({stockInfo.ticker})</h3>
                    <div className="text-sm font-medium text-textMuted mt-1">
                        1 Share • <span className="text-white font-semibold">${stockInfo.price.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAlertOpen(true)}
                        className="text-textMuted/50 hover:text-white transition-colors cursor-default"
                        title="Set Price Alert"
                    >
                        <Bell className="w-4 h-4" />
                    </button>
                    <button className="text-textMuted/50 hover:text-white transition-colors cursor-default" title="Dismiss">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Big Price & Change */}
            <div className="mb-4">
                <div className="text-4xl font-bold text-white tabular-nums tracking-tight">
                    ${stockInfo.price.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 mt-1 font-medium text-success">
                    {stockInfo.change.toFixed(2)} ({stockInfo.changePercent.toFixed(2)}%)
                    <span className="text-textMuted text-xs ml-1 font-normal">Today</span>
                </div>
            </div>

            {/* Sparkline */}
            <div className="h-16 -mx-2 mb-6 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="gradient-preview" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="90%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin', 'dataMax']} hide={true} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            fill="url(#gradient-preview)"
                            strokeWidth={2}
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm pt-4 border-t border-white/5">
                <div className="flex justify-between">
                    <span className="text-textMuted">Open</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.open.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textMuted">Volume</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.volume}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textMuted">Day High</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.dayHigh.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textMuted">Mkt Cap</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.marketCap}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textMuted">Day Low</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.dayLow.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-textMuted">P/E Ratio</span>
                    <span className="text-white font-medium tabular-nums">{stockInfo.peRatio}</span>
                </div>
            </div>

            <PriceAlertModal
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                stock={stockInfo}
            />
        </div>
    );
}
