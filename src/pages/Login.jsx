import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake network delay
            login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }

    return (
        <AuthLayout title="Welcome Back" subtitle="Enter your credentials to access the dashboard">
            {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center mt-6"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Log In'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-textMuted">
                Don't have an account?{' '}
                <Link to="/signup" className="text-secondary hover:text-primary transition-colors font-medium">
                    Sign Up
                </Link>
            </div>
        </AuthLayout>
    );
}
