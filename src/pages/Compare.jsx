import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';
import { useStocks } from '../context/StockContext';
import { AVAILABLE_TICKERS } from '../data/stocks';

// Sub-Components
import CompareOverview from '../components/compare/CompareOverview';
import CompareStockCard from '../components/compare/CompareStockCard';
import CompareChart from '../components/compare/CompareChart';
import CorrelationHeatmap from '../components/compare/CorrelationHeatmap';
import SmartInsights from '../components/compare/SmartInsights';
import QuarterlyGrowth from '../components/compare/QuarterlyGrowth';
import CompareNews from '../components/compare/CompareNews';

const STOCK_COLORS = {
    NVDA: '#a78bfa', // Violet
    TSLA: '#f472b6', // Pink
    AMZN: '#fbbf24', // Amber
    GOOG: '#22d3ee', // Cyan
    META: '#34d399'  // Emerald
};

export default function Compare() {
    const { stockState } = useStocks();
    const [selectedTickers, setSelectedTickers] = useState(['NVDA', 'TSLA']);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // Helper to add/remove
    const toggleStock = (ticker) => {
        if (selectedTickers.includes(ticker)) {
            setSelectedTickers(prev => prev.filter(t => t !== ticker));
        } else {
            if (selectedTickers.length >= 5) return; // Limit 5
            setSelectedTickers(prev => [...prev, ticker]);
        }
        setIsSelectorOpen(false);
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1600px] mx-auto pb-20 space-y-8">

                {/* 1. Header & Controls */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-2 mb-1"
                        >
                            <Link to="/dashboard" className="text-textMuted hover:text-white transition-colors">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Market Comparison</h1>
                        </motion.div>
                        <p className="text-textMuted text-sm pl-7">Advanced multi-asset performance analysis</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelectedTickers([])}
                            className="p-2 text-textMuted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <RefreshCw size={18} />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-background font-bold rounded-xl transition-all shadow-lg shadow-primary/25"
                            >
                                <Plus size={18} /> Add Asset
                            </button>

                            <AnimatePresence>
                                {isSelectorOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        <div className="p-3 border-b border-white/5">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-black/20 rounded-lg">
                                                <Search size={14} className="text-textMuted" />
                                                <input
                                                    autoFocus
                                                    placeholder="Search ticker..."
                                                    className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-textMuted/50"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto p-1 text-sm">
                                            {AVAILABLE_TICKERS.map(t => {
                                                const isSelected = selectedTickers.includes(t);
                                                return (
                                                    <button
                                                        key={t}
                                                        onClick={() => toggleStock(t)}
                                                        disabled={isSelected}
                                                        className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center ${isSelected ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 text-white'}`}
                                                    >
                                                        <span className="font-bold">{t}</span>
                                                        {isSelected && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">Added</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* 2. Overview Bar */}
                <CompareOverview stocks={selectedTickers} stockData={stockState} />

                {/* 3. Stock Cards Grid */}
                {selectedTickers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {selectedTickers.map(t => (
                                <CompareStockCard
                                    key={t}
                                    ticker={t}
                                    data={stockState[t] || { price: 0, changePercent: 0, history: [] }}
                                    color={STOCK_COLORS[t] || '#fff'}
                                    onRemove={() => toggleStock(t)}
                                />
                            ))}
                        </AnimatePresence>

                        {/* Empty Slot Placeholder */}
                        {selectedTickers.length < 4 && (
                            <div
                                onClick={() => setIsSelectorOpen(true)}
                                className="rounded-2xl border-2 border-dashed border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col items-center justify-center cursor-pointer min-h-[200px]"
                            >
                                <Plus size={32} className="text-white/20 mb-2" />
                                <span className="text-sm font-bold text-textMuted">Add Comparison</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search size={32} className="text-textMuted" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Start Comparison</h2>
                        <p className="text-textMuted">Select stocks to analyze performance difference</p>
                        <button onClick={() => setIsSelectorOpen(true)} className="mt-6 text-primary font-bold hover:underline">Select Tickers</button>
                    </div>
                )}

                {/* 4. Main Chart */}
                {selectedTickers.length > 0 && (
                    <CompareChart stocks={selectedTickers} stockData={stockState} />
                )}

                {/* 5. Analysis Section */}
                {selectedTickers.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Heatmap & Insights */}
                        <div className="lg:col-span-1 space-y-8">
                            <CorrelationHeatmap stocks={selectedTickers} stockData={stockState} />
                            <SmartInsights stocks={selectedTickers} stockData={stockState} />
                        </div>

                        {/* Right Column: Growth Table */}
                        <div className="lg:col-span-2">
                            <QuarterlyGrowth stocks={selectedTickers} />
                        </div>
                    </div>
                )}

                {/* 6. News Stream */}
                {selectedTickers.length > 0 && (
                    <CompareNews stocks={selectedTickers} />
                )}

            </div>
        </DashboardLayout>
    );
}
