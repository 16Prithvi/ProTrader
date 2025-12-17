import React, { useState, useRef, useEffect } from 'react';
import {
    User, Wallet, Settings, LogOut, FileText,
    Briefcase, Headphones, ChevronRight, CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function ProfileDropdown() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
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

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const MenuItem = ({ icon: Icon, label, subLabel, onClick, isDanger }) => (
        <button
            onClick={onClick}
            className={clsx(
                "w-full flex items-center gap-3 p-2.5 hover:bg-surfaceHighlight transition-colors text-left group",
                isDanger ? "hover:bg-danger/10" : ""
            )}
        >
            <div className={clsx(
                "p-1.5 rounded-lg transition-colors",
                isDanger ? "bg-danger/10 text-danger group-hover:bg-danger group-hover:text-white" : "bg-surface text-textMuted group-hover:bg-surfaceHighlight group-hover:text-primary"
            )}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
                <h4 className={clsx("font-medium text-sm", isDanger ? "text-danger" : "text-white")}>{label}</h4>
                {subLabel && <p className="text-[10px] text-textMuted mt-0.5">{subLabel}</p>}
            </div>
            {!isDanger && <ChevronRight className="w-4 h-4 text-textMuted/50 group-hover:text-primary transition-colors" />}
        </button>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
                {currentUser?.name?.charAt(0)}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-14 w-80 bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-b from-surfaceHighlight to-surface border-b border-white/5 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 mx-auto mb-3 shadow-xl">
                            <img
                                src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}`}
                                alt="Profile"
                                className="w-full h-full rounded-full bg-surface object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-white">{currentUser?.name}</h3>
                        <p className="text-sm text-textMuted">Growing since Jan '24</p>
                    </div>

                    {/* Quick Wallet Actions */}
                    <div className="p-3 border-b border-white/5 bg-surfaceHighlight/30 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-textMuted">Wallet Balance</p>
                            <p className="text-lg font-bold text-white">$0.00</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-success/20 text-success text-xs font-bold hover:bg-success hover:text-white transition-all">
                            + Add Money
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <MenuItem icon={Briefcase} label="Orders" subLabel="Track your investment history" />
                        <MenuItem icon={User} label="Account Details" subLabel="Profile, KYC & more" />
                        <MenuItem icon={CreditCard} label="Bank & AutoPay" subLabel="Manage payment methods" />
                        <MenuItem icon={Headphones} label="Customer Support" subLabel="24x7 Assistance" />
                        <MenuItem icon={FileText} label="Reports" subLabel="Tax, P&L, Ledger" />

                        <div className="h-px bg-white/5 my-1" />

                        <MenuItem icon={LogOut} label="Sign Out" isDanger onClick={handleLogout} />
                    </div>


                </div>
            )}
        </div>
    );
}
