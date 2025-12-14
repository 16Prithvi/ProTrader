import React from 'react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass-card p-8 md:p-12 w-full max-w-md rounded-3xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-textMuted text-sm">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </motion.div>
        </div>
    );
}
