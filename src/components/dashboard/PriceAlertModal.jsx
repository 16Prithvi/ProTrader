import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import clsx from 'clsx';
import { useStocks } from '../../context/StockContext';

export default function PriceAlertModal({ isOpen, onClose, stock }) {
    const { addAlert } = useStocks();
    const [alertType, setAlertType] = useState('ABOVE'); // 'ABOVE' or 'BELOW'
    const [price, setPrice] = useState('');

    // Reset or Initialize when modal opens
    useEffect(() => {
        if (isOpen && stock) {
            setPrice(stock.price ? stock.price.toFixed(2) : '');
            // Default to 'ABOVE' if current price is positive change, else 'BELOW' (optional heuristic)
        }
    }, [isOpen, stock]);

    if (!isOpen || !stock) return null;

    const handleCreate = () => {
        if (!price || isNaN(price)) return;
        addAlert(stock.ticker, alertType, price);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0B1221] border border-white/10 rounded-2xl shadow-2xl p-6 transform transition-all scale-100 opacity-100">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-xl text-primary">
                            <Bell className="w-5 h-5 fill-current" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Set Price Alert</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-textMuted hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Stock Info */}
                <div className="mb-6 space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-textMuted">Stock:</span>
                        <span className="font-bold text-white">{stock.ticker}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-textMuted">Current Price:</span>
                        <span className="font-bold text-white">${stock.price?.toFixed(2)}</span>
                    </div>
                </div>

                {/* Alert Type Toggle */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-textMuted mb-2">Alert Type</label>
                    <div className="grid grid-cols-2 gap-3 p-1 bg-surfaceHighlight/30 rounded-xl">
                        <button
                            onClick={() => setAlertType('ABOVE')}
                            className={clsx(
                                "py-2.5 px-4 rounded-lg font-bold text-sm transition-all text-center",
                                alertType === 'ABOVE'
                                    ? "bg-success text-white shadow-lg shadow-success/20"
                                    : "text-textMuted hover:text-white hover:bg-white/5"
                            )}
                        >
                            Above
                        </button>
                        <button
                            onClick={() => setAlertType('BELOW')}
                            className={clsx(
                                "py-2.5 px-4 rounded-lg font-bold text-sm transition-all text-center",
                                alertType === 'BELOW'
                                    ? "bg-danger text-white shadow-lg shadow-danger/20"
                                    : "text-textMuted hover:text-white hover:bg-white/5"
                            )}
                        >
                            Below
                        </button>
                    </div>
                </div>

                {/* Price Input */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-textMuted mb-2">Alert Price</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted font-medium">$</span>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-surfaceHighlight/50 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleCreate}
                    className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                    Create Alert
                </button>

            </div>
        </div>
    );
}
