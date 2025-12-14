import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useStocks } from '../context/StockContext';
import { motion } from 'framer-motion';

// Components
import InsightsSummaryCard from '../components/insights/InsightsSummaryCard';
import StockInsightCard from '../components/insights/StockInsightCard';
import InsightTextCard from '../components/insights/InsightTextCard';
import WeeklyHeatmap from '../components/insights/WeeklyHeatmap';

export default function Insights() {
    const { currentUser } = useAuth();
    const { stocks, stockState } = useStocks();
    const [isLoading, setIsLoading] = useState(true);

    const subscribed = (currentUser?.subscribedTickers || []).map(s =>
        typeof s === 'string' ? s : s.ticker
    );

    // Simulate "Loading" analysis
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // --------------------------------------------------------------------------
    // Data Simulation Logic (The "Hack")
    // --------------------------------------------------------------------------
    const insightsData = useMemo(() => {
        if (subscribed.length === 0 || !stockState) return null;

        // Helper for seeded random (so past days don't flicker)
        const seededRandom = (seed) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        const stockMetrics = subscribed.map(ticker => {
            const data = stockState[ticker];
            const baseInfo = stocks[ticker]; // Access static base info
            if (!data || !baseInfo) return null;

            // Generate "Past 4 Days" deterministically based on ticker char codes
            const seedSum = ticker.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

            const weeklyPoints = [];
            // Days 1-4 (Fixed/Static History based on BASE PRICE, not live price)
            let currentRefPrice = baseInfo.basePrice;
            for (let i = 0; i < 4; i++) {
                const move = (seededRandom(seedSum + i) - 0.5) * 5; // Random move -2.5% to +2.5%
                currentRefPrice = currentRefPrice * (1 + move / 100);
                weeklyPoints.push({ name: `Day ${i + 1}`, value: currentRefPrice, isLive: false });
            }

            // Day 5 (Live Data)
            weeklyPoints.push({ name: 'Day 5', value: data.price, isLive: true });

            // Calculate metrics
            const startPrice = weeklyPoints[0].value;
            const endPrice = weeklyPoints[4].value; // Day 5
            const netChange = ((endPrice - startPrice) / startPrice) * 100;

            // Volatility
            const vals = weeklyPoints.map(p => p.value);
            const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
            const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
            // Normalize vol relative to price
            const volatility = (Math.sqrt(variance) / mean) * 100;

            const positiveSessions = weeklyPoints.filter((p, i) => {
                if (i === 0) return true;
                return p.value >= weeklyPoints[i - 1].value;
            }).length;

            const low = Math.min(...vals);
            const high = Math.max(...vals);

            // Heatmap Change %s
            // Day 1-4 (Fixed), Day 5 (Live), Day 6-7 (Weekend/Null)
            const dailyChanges = weeklyPoints.map((p, i) => {
                if (i === 0) return 0;
                return ((p.value - weeklyPoints[i - 1].value) / weeklyPoints[i - 1].value) * 100;
            });
            // Fill 7 days: [Day1, Day2, Day3, Day4, Day5, Weekend, Weekend]
            const heatmapDays = [...dailyChanges, null, null];

            return {
                ticker,
                name: data.name || ticker,
                history: weeklyPoints, // Only 5 points for the chart
                netChange,
                volatility,
                positiveSessions,
                low,
                high,
                dailyChanges: heatmapDays
            };
        }).filter(Boolean);

        if (stockMetrics.length === 0) return null;

        // Portfolio Aggregates
        const totalReturn = stockMetrics.reduce((sum, s) => sum + s.netChange, 0) / stockMetrics.length;
        const avgVolatility = stockMetrics.reduce((sum, s) => sum + s.volatility, 0) / stockMetrics.length;

        const bestPerformer = [...stockMetrics].sort((a, b) => b.netChange - a.netChange)[0];
        const mostVolatile = [...stockMetrics].sort((a, b) => b.volatility - a.volatility)[0];

        // Risk Level
        let riskLevel = 'Stable';
        if (avgVolatility > 1.5) riskLevel = 'Risky'; // Adjusted threshold since calc changed
        else if (avgVolatility > 0.8) riskLevel = 'Moderate';

        // Text Insights Generation
        const textInsights = [];

        // Volatility Insight
        textInsights.push({
            type: 'volatility',
            title: `Your most volatile stock this week was <b>${mostVolatile.ticker}</b> with a variance of <b>${mostVolatile.volatility.toFixed(1)}%</b>.`,
            subtext: "High volatility can create trading opportunities, but also increases risk."
        });

        // Outperformance Insight
        if (bestPerformer.netChange > totalReturn + 1) {
            textInsights.push({
                type: 'outperformance',
                title: `<b>${bestPerformer.ticker}</b> outperformed your portfolio average by <b>${(bestPerformer.netChange - totalReturn).toFixed(1)}%</b> this week.`,
                subtext: "Strong momentum driver."
            });
        }

        // Concentration Risk (Simplified)
        if (stockMetrics.length < 3) {
            textInsights.push({
                type: 'concentration',
                title: `Your portfolio is concentrated in <b>${stockMetrics.length} stocks</b>.`,
                subtext: "Consider adding more stocks to diversify risk."
            });
        } else {
            textInsights.push({
                type: 'risk',
                title: `Based on simulated volatility and drawdowns, your portfolio is currently classified as <b>${riskLevel}</b>.`,
                subtext: "Keep monitoring your allocation."
            });
        }

        const heatmapData = stockMetrics.map(s => ({
            ticker: s.ticker,
            days: s.dailyChanges
        }));

        return {
            stockMetrics,
            summary: {
                totalReturn: totalReturn.toFixed(2),
                bestPerformer: { ticker: bestPerformer.ticker, change: bestPerformer.netChange.toFixed(1) + '%' },
                mostVolatile: { ticker: mostVolatile.ticker, vol: mostVolatile.volatility.toFixed(1) + '%' },
                riskLevel
            },
            textInsights,
            heatmapData
        };

    }, [stockState, subscribed]);


    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-white/10 w-1/3 rounded"></div>
                    <div className="h-48 bg-white/10 rounded-2xl"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-40 bg-white/10 rounded-2xl"></div>
                        <div className="h-40 bg-white/10 rounded-2xl"></div>
                        <div className="h-40 bg-white/10 rounded-2xl"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!subscribed.length) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                    <div className="p-6 rounded-full bg-surfaceHighlight/30 border border-white/5">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            👋
                        </motion.div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">No insights yet</h2>
                    <p className="text-textMuted max-w-md">
                        Subscribe to at least one stock from your Dashboard to see detailed AI-generated insights and trend analysis.
                    </p>
                    <Link
                        to="/dashboard"
                        className="bg-primary hover:bg-primary/90 text-background font-bold px-8 py-3 rounded-xl transition-all"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    if (!insightsData) return null;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Insights</h1>
                    <p className="text-textMuted">Auto-generated summaries of your portfolio and market trends.</p>
                </motion.div>

                {/* Section A: Summary */}
                <InsightsSummaryCard metrics={insightsData.summary} />

                {/* Section B: Grid of Charts */}
                <div>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-white">Per-Stock Weekly Trends</h3>
                        <p className="text-sm text-textMuted">Each card shows a 7-point simulated trend for the stock this week.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {insightsData.stockMetrics.map((data, index) => (
                            <StockInsightCard key={data.ticker} data={data} index={index} />
                        ))}
                    </div>
                </div>

                {/* Section C & D: Text Insights & Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Text Insights Feed */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-white">Key Observations</h3>
                        </div>
                        {insightsData.textInsights.map((insight, i) => (
                            <InsightTextCard key={i} index={i} {...insight} />
                        ))}
                    </div>

                    {/* Heatmap */}
                    <div className="lg:col-span-2">
                        <WeeklyHeatmap data={insightsData.heatmapData} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
