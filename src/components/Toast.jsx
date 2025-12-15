import React, { useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import clsx from 'clsx';

export default function Toast({ message, type = 'info', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0B1221] border border-white/10 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-sm w-full">
            <div className={clsx(
                "p-2 rounded-lg",
                type === 'success' ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
            )}>
                <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="text-white font-medium text-sm">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="text-textMuted hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
