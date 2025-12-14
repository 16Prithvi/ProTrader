import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="bg-background min-h-screen">
            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            <Navbar setMobileOpen={setMobileOpen} />

            <main className="lg:pl-64 pt-16 min-h-screen transition-all duration-300">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
