
import React from 'react';
import './FourSquaresLoader.css';

export const FourSquaresLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-8">
            <div className="loader">
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
            </div>
            <span className="text-foreground-muted text-sm font-mono animate-pulse">loading...</span>
        </div>
    );
};
