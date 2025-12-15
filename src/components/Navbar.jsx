import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { AVAILABLE_TICKERS, STOCKS_DATA } from '../data/stocks';
import { useState } from 'react';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ setMobileOpen }) {
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 0) {
            const results = AVAILABLE_TICKERS.filter(ticker =>
                ticker.toLowerCase().includes(term.toLowerCase()) ||
                STOCKS_DATA[ticker].name.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectStock = (ticker) => {
        setSearchTerm('');
        setSearchResults([]);

        // Try to find the element
        const element = document.getElementById(ticker);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a highlight effect temporarily
            element.classList.add('ring-2', 'ring-primary');
            setTimeout(() => element.classList.remove('ring-2', 'ring-primary'), 2000);
        } else {
            // Optional: Provide feedback if not on page (e.g. not subscribed)
            // For now, we simply don't do anything as per "dont create some extra card"
        }
    };

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
                <div className="hidden md:flex flex-col relative">
                    <div className="flex items-center bg-surfaceHighlight/50 rounded-full px-4 py-1.5 border border-white/5 focus-within:border-primary/50 transition-colors w-64">
                        <Search className="w-4 h-4 text-textMuted" />
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="bg-transparent border-none focus:outline-none text-sm ml-2 text-textMain w-full placeholder:text-textMuted/70"
                        />
                    </div>
                    {/* Search Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-12 left-0 right-0 bg-surface border border-white/10 rounded-xl shadow-xl overflow-hidden z-40 max-h-64 overflow-y-auto custom-scrollbar">
                            {searchResults.map(ticker => (
                                <button
                                    key={ticker}
                                    onClick={() => handleSelectStock(ticker)}
                                    className="w-full text-left px-4 py-3 hover:bg-surfaceHighlight flex justify-between items-center group transition-colors"
                                >
                                    <div>
                                        <span className="font-bold text-white block">{ticker}</span>
                                        <span className="text-xs text-textMuted">{STOCKS_DATA[ticker].name}</span>
                                    </div>
                                    <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        Jump to
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {currentUser ? (
                    <>
                        <NotificationDropdown />

                        <ProfileDropdown />
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
