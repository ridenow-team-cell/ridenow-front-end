'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/app/context/ThemeContext';

interface NavigationLink {
    label: string;
    href: string;
}

interface HeaderProps {
    currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'home' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    const navigationLinks: NavigationLink[] = [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Login', href: '/auth' },

    ];

    // Close mobile menu on resize
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const NavLink: React.FC<{ href: string; children: React.ReactNode; isActive?: boolean }> = ({
        href,
        children,
        isActive = false
    }) => (
        <a
            href={href}
            className={`transition-colors duration-200 text-base lg:text-lg ${isDark
                ? `text-white ${isActive ? 'text-[#005BAF]' : 'hover:text-[#005BAF]'}`
                : `text-[#343434] ${isActive ? 'text-[#005BAF]' : 'hover:text-[#005BAF]'}`
                }`}
        >
            {children}
        </a>
    );

    return (
        <header className="container mx-auto px-4 md:px-6 py-4 md:py-6">
            <nav className="flex items-center justify-between">
                {/* Logo */}
                <div className="relative w-[160px] md:w-[180px] lg:w-[215px] h-[45px] md:h-[50px] lg:h-[60px]">
                    <img
                        src="/assets/logo.png"
                        alt="RideNow Logo Light"
                        className={`absolute w-full h-auto transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <img
                        src="/assets/logo2.png"
                        alt="RideNow Logo Dark"
                        className={`absolute w-full h-auto transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}
                    />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-6 lg:gap-8">
                    {navigationLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            href={link.href}
                            isActive={currentPage === link.label.toLowerCase().replace(' ', '-')}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center gap-4 lg:hidden">
                    <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                    <button
                        className="p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className={`w-6 h-6 ${isDark ? 'text-white' : 'text-[#343434]'}`} />
                        ) : (
                            <Menu className={`w-6 h-6 ${isDark ? 'text-white' : 'text-[#343434]'}`} />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className={`lg:hidden mt-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4 transition-colors duration-300`}>
                    <div className="flex flex-col space-y-4">
                        {navigationLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className={`py-2 transition-colors duration-200 ${isDark
                                    ? `text-white ${currentPage === link.label.toLowerCase().replace(' ', '-') ? 'text-[#005BAF]' : 'hover:text-[#005BAF]'}`
                                    : `text-[#343434] ${currentPage === link.label.toLowerCase().replace(' ', '-') ? 'text-[#005BAF]' : 'hover:text-[#005BAF]'}`
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;