import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const signup = (name, email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[email]) {
            throw new Error('User already exists');
        }

        const newUser = { name, email, password, subscribedTickers: [] };
        users[email] = newUser;
        localStorage.setItem('users', JSON.stringify(users));

        // Auto-login
        login(email, password);
    };

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[email];

        if (!user) {
            throw new Error('Account not found. Please sign up first.');
        }

        if (user.password !== password) {
            throw new Error('Invalid email or password');
        }

        const sessionUser = { ...user };
        // We might want to avoid storing password in session if possible, but for prototype it's okay or strictly filter.
        // Keeping it simple as per previous logic, but ensuring stats/subs are kept.
        delete sessionUser.password;

        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        setCurrentUser(sessionUser);
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
    };

    const updateUser = (updates) => {
        setCurrentUser(prev => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('currentUser', JSON.stringify(updated));
            // Also update the 'users' db to persist across sessions
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            if (updated.email && users[updated.email]) {
                users[updated.email] = { ...users[updated.email], ...updates };
                localStorage.setItem('users', JSON.stringify(users));
            }
            return updated;
        });
    };

    const value = {
        currentUser,
        signup,
        login,
        logout,
        updateUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
