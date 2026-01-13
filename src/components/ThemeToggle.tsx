'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => (
    <button
        onClick={onToggle}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="Toggle theme"
    >
        {isDark ? (
            <Sun className="w-5 h-5 text-gray-300" />
        ) : (
            <Moon className="w-5 h-5 text-gray-700" />
        )}
    </button>
);

export default ThemeToggle;