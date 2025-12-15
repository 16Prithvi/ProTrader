import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { useStocks } from '../context/StockContext';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationDropdown() {
    const { notificationHistory, setNotificationHistory, notifications } = useStocks();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasUnread = notifications.length > 0;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 relative text-textMuted hover:text-primary transition-colors focus:outline-none"
            >
                <Bell className="w-5 h-5" />
                {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-surface animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-80 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-3 border-b border-white/5 flex items-center justify-between bg-surfaceHighlight/20">
                        <h3 className="font-bold text-white text-sm">Notifications</h3>
                        {notificationHistory.length > 0 && (
                            <button
                                onClick={() => setNotificationHistory([])}
                                className="text-[10px] text-textMuted hover:text-white flex items-center gap-1 transition-colors"
                            >
                                <CheckCheck className="w-3 h-3" />
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {notificationHistory.length === 0 ? (
                            <div className="py-8 text-center px-4">
                                <div className="w-10 h-10 rounded-full bg-surfaceHighlight/50 flex items-center justify-center mx-auto mb-3 text-textMuted">
                                    <Bell className="w-5 h-5 opacity-50" />
                                </div>
                                <p className="text-sm text-white font-medium">No price alerts are hit</p>
                                <p className="text-xs text-textMuted mt-1">Set alerts to stay updated on price movements.</p>
                            </div>
                        ) : (
                            <div>
                                {notificationHistory.map((item, index) => (
                                    <div
                                        key={item.id || index}
                                        className="p-3 border-b border-white/5 hover:bg-surfaceHighlight/30 transition-colors flex gap-3 group"
                                    >
                                        <div className="mt-1">
                                            <div className="w-2 h-2 rounded-full bg-success"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-white leading-snug">{item.message}</p>
                                            <p className="text-[10px] text-textMuted mt-1">
                                                {/* Fallback if date-fns fails or time is invalid */}
                                                {item.time ? new Date(item.time).toLocaleTimeString() : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
