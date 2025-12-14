import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Newspaper, X, Lightbulb, ArrowRightLeft } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
    const location = useLocation();
    const { logout, currentUser } = useAuth();

    const allNavItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, public: true },
        { label: 'Analytics', path: '/analytics', icon: TrendingUp, public: false },
        { label: 'Compare', path: '/compare', icon: ArrowRightLeft, public: false },
        { label: 'Insights', path: '/insights', icon: Lightbulb, public: false },
        { label: 'News', path: '/news', icon: Newspaper, public: false },
    ];

    const navItems = currentUser ? allNavItems : allNavItems.filter(item => item.public);

    const sidebarClass = clsx(
        "fixed top-0 left-0 h-screen bg-surface border-r border-white/5 transition-transform duration-300 z-50 flex flex-col w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    );

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <div className={sidebarClass}>
                <div className="h-16 flex items-center px-6 border-b border-white/5 justify-between">
                    <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ProTrader
                    </Link>
                    <button onClick={() => setMobileOpen(false)} className="lg:hidden text-textMuted hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={item.label}
                                onClick={() => setMobileOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-textMuted hover:bg-white/5 hover:text-textMain"
                                )}
                            >
                                <Icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-textMuted group-hover:text-white")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    {currentUser ? (
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-textMuted hover:text-danger hover:bg-danger/10 transition-colors"
                        >
                            Sign Out
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-white/5 text-white hover:bg-white/10 transition-colors"
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
