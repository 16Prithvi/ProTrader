import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar({ setMobileOpen }) {
    const { currentUser } = useAuth();

    // Simple check: Market open 9:30 - 16:00 Local Time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const isMarketOpen = totalMinutes >= (9 * 60 + 30) && totalMinutes < (16 * 60);

    return (
        <header className="glass-header h-16 fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="lg:hidden p-2 text-textMuted hover:text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="hidden md:flex flex-col">
                    <h2 className="text-sm font-medium text-textMain">
                        Good afternoon, {currentUser?.name?.split(' ')[0]} 👋
                    </h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-surfaceHighlight/50 rounded-full px-4 py-1.5 border border-white/5 focus-within:border-primary/50 transition-colors w-64">
                    <Search className="w-4 h-4 text-textMuted" />
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        className="bg-transparent border-none focus:outline-none text-sm ml-2 text-textMain w-full placeholder:text-textMuted/70"
                    />
                </div>

                {currentUser ? (
                    <>
                        <button className="p-2 relative text-textMuted hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-surface"></span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/20">
                            {currentUser?.name?.charAt(0)}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm font-bold text-textMuted hover:text-white transition-colors">
                            Log In
                        </Link>
                        <Link to="/signup" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-background text-sm font-bold transition-colors">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
