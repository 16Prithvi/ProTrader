import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { Loader2 } from 'lucide-react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        try {
            setError('');
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake network delay
            signup(name, email, password);
            navigate('/login');
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <AuthLayout title="ProTrader" subtitle="Create your account to start trading">
            {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-surfaceHighlight/50 border border-white/10 rounded-xl px-4 py-3 text-textMain focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-surfaceHighlight/50 border border-white/10 rounded-xl px-4 py-3 text-textMain focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full bg-surfaceHighlight/50 border border-white/10 rounded-xl px-4 py-3 text-textMain focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Confirm Password</label>
                    <input
                        type="password"
                        required
                        className="w-full bg-surfaceHighlight/50 border border-white/10 rounded-xl px-4 py-3 text-textMain focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center mt-2"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-textMuted">
                Already have an account?{' '}
                <Link to="/login" className="text-secondary hover:text-primary transition-colors font-medium">
                    Log In
                </Link>
            </div>
            <div className="mt-8 text-center text-xs text-textMuted/50 border-t border-white/5 pt-4">
                Frontend-only demo – no real authentication.
            </div>
        </AuthLayout>
    );
}
