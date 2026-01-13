'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        // Check localStorage on initial load
        const savedTheme = localStorage.getItem('ridenow-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else if (prefersDark) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }

        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (!isInitialized) return;

        // Apply theme to document
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('ridenow-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('ridenow-theme', 'light');
        }
    }, [isDark, isInitialized]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const setTheme = (value: boolean) => {
        setIsDark(value);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};