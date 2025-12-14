import React from 'react';
import clsx from 'clsx';

export default function SkeletonLoader({ className }) {
    return (
        <div
            className={clsx(
                "bg-surfaceHighlight/50 rounded-2xl animate-pulse",
                className
            )}
        />
    );
}
