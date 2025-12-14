import React, { useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useStocks } from '../context/StockContext';
import clsx from 'clsx';

const COLORS = ['#38bdf8', '#22c55e', '#ef4444', '#eab308', '#a855f7'];

export default function Analytics() {
    const { currentUser } = useAuth();
    const { stocks, stockState } = useStocks();
    const [range, setRange] = useState('1M');

    const subscribed = (currentUser?.subscribedTickers || []).map(s =>
        typeof s === 'string' ? s : s.ticker
    );

    // Mock Data for "Portfolio Value Over Time"
    const portfolioHistoryData = useMemo(() => {
        const days = range === '1D' ? 24 : range === '5D' ? 5 : 30;
        const multiplier = range === '1D' ? 10 : 100;
        return Array.from({ length: days }, (_, i) => ({
            name: range === '1D' ? `${i}:00` : `${i + 1}`, // Simplified to just numbers
            value: 10000 + Math.random() * 200 * multiplier + (i * multiplier),
        }));
    }, [range]);

    // Volatility Data (Bar Chart)
    const volData = subscribed.map(t => ({
        name: t,
        volatility: Math.abs(stockState[t]?.changePercent || 0) * 1.5 // Mock multiplier
    }));

    // Sector Data (Pie)
    const sectorData = subscribed.reduce((acc, ticker) => {
        const sector = stocks[ticker].sector;
        const existing = acc.find(item => item.name === sector);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: sector, value: 1 });
        }
        return acc;
    }, []);

    // Performance Table Data
    const performanceData = subscribed.map(ticker => ({
        ticker,
        name: stocks[ticker].name,
        price: stockState[ticker]?.price || 0,
        changePercent: stockState[ticker]?.changePercent || 0,
    })).sort((a, b) => b.changePercent - a.changePercent);

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                    <p className="text-textMuted">Detailed insights into your portfolio and market trends.</p>
                </div>

                {/* Top: Portfolio Area Chart */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Portfolio Value Over Time</h3>
                        <div className="flex bg-surfaceHighlight/50 p-1 rounded-lg border border-white/5">
                            {['1D', '5D', '1M'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRange(r)}
                                    className={clsx(
                                        "px-3 py-1 rounded-md text-xs font-bold transition-all",
                                        range === r ? "bg-primary text-white shadow-lg" : "text-textMuted hover:text-white"
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={portfolioHistoryData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={range === '1M' ? 2 : 0} // Show every 3rd tick for 30d view
                                />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#38bdf8' }}
                                    formatter={(value) => [`$${value.toFixed(2)}`, 'Value']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Middle: Volatility & Sector */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Volatility */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Stock Volatility</h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={volData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                    <Bar dataKey="volatility" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sector Allocation */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Sector Allocation</h3>
                        <div className="h-[250px] flex items-center justify-center">
                            {sectorData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sectorData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {sectorData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-textMuted">No stocks subscribed</p>
                            )}
                        </div>
                        {sectorData.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-4 mt-2">
                                {sectorData.map((entry, index) => (
                                    <div key={entry.name} className="flex items-center gap-2 text-xs text-textMuted">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        {entry.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom: Performers Table */}
                <div className="glass-card rounded-2xl p-6 overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-4">Performance Ranking</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-textMuted uppercase tracking-wider border-b border-white/5">
                                    <th className="py-3 px-4">Ticker</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4 text-right">Price</th>
                                    <th className="py-3 px-4 text-right">Change %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceData.map((stock) => (
                                    <tr key={stock.ticker} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 font-bold text-white">{stock.ticker}</td>
                                        <td className="py-3 px-4 text-textMain">{stock.name}</td>
                                        <td className="py-3 px-4 text-right tabular-nums text-textMain">${stock.price.toFixed(2)}</td>
                                        <td className={clsx("py-3 px-4 text-right font-medium tabular-nums", stock.changePercent >= 0 ? "text-success" : "text-danger")}>
                                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                                {performanceData.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-textMuted">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
