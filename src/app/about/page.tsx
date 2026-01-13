'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Facebook, Instagram, Music, Menu, X } from 'lucide-react';

// Type definitions
interface NavigationLink {
    label: string;
    href: string;
}

interface SocialLink {
    icon: React.ReactNode;
    href: string;
    label: string;
}

interface ContactInfo {
    type: 'phone' | 'email';
    value: string;
    display: string;
}

// Reusable Components

const ThemeToggle: React.FC<{ isDark: boolean; onToggle: () => void }> = ({ isDark, onToggle }) => (
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

// Updated NavLink to accept isDark prop
interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    isDark: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isDark }) => (
    <a
        href={href}
        className={`${isDark ? 'text-white hover:text-[#005BAF]' : 'text-[#343434] hover:text-[#005BAF]'} transition-colors duration-200 text-base lg:text-lg`}
    >
        {children}
    </a>
);

const AppDownloadButton: React.FC<{ store: 'google' | 'apple' }> = ({ store }) => {
    const isGoogle = store === 'google';
    const imageUrl = isGoogle
        ? 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
        : 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg';

    return (
        <a
            href={isGoogle ? '#google-play' : '#app-store'}
            className="inline-block transition-transform duration-200 hover:scale-105"
        >
            <img
                src={imageUrl}
                alt={`Download on ${isGoogle ? 'Google Play' : 'App Store'}`}
                className="h-10 md:h-12 lg:h-14 w-auto"
            />
        </a>
    );
};

const SocialIcon: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
    <a
        href={href}
        className="text-white hover:text-[#005BAF] transition-colors duration-200"
        aria-label={label}
    >
        {icon}
    </a>
);

// Main Component
const RideNowLanding: React.FC = () => {
    const [isDark, setIsDark] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const navigationLinks: NavigationLink[] = [
        { label: 'About Us', href: '/about' },
        { label: 'Quick Links', href: '#links' },
        { label: 'Contact Us', href: '#contact' },
    ];

    const socialLinks: SocialLink[] = [
        { icon: <Facebook className="w-5 h-5" />, href: '#facebook', label: 'Facebook' },
        { icon: <Instagram className="w-5 h-5" />, href: '#instagram', label: 'Instagram' },
        { icon: <Music className="w-5 h-5" />, href: '#tiktok', label: 'TikTok' },
    ];

    const contactInfo: ContactInfo[] = [
        { type: 'phone', value: '+2347033465786', display: '+2347033465786' },
        { type: 'phone', value: '+2348087653978', display: '+2348087653978' },
        { type: 'email', value: 'info@ridenow.com', display: 'info@ridenow.com' },
    ];

    return (
        <div className={`min-h-screen pb-0 mb-0 ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
            {/* Header */}
            <header className="container mx-auto px-4 md:px-6 py-4 md:py-6">
                <nav className="flex items-center justify-between">
                    {/* Logo - Shows different logo based on theme */}
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

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className={`w-6 h-6 ${isDark ? 'text-white' : 'text-[#343434]'}`} />
                        ) : (
                            <Menu className={`w-6 h-6 ${isDark ? 'text-white' : 'text-[#343434]'}`} />
                        )}
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6 lg:gap-8">
                        {navigationLinks.map((link) => (
                            <NavLink key={link.label} href={link.href} isDark={isDark}>
                                {link.label}
                            </NavLink>
                        ))}
                        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
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
                                    className={`${isDark ? 'text-white hover:text-[#005BAF]' : 'text-[#343434] hover:text-[#005BAF]'} transition-colors duration-200 py-2`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-300 dark:border-gray-700">
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Theme</span>
                                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 md:px-6 pb-0">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16 py-8 md:py-12 lg:py-16">
                    {/* Hero Image Container */}
                    <div className="w-full lg:w-1/2">
                        <img
                            src="/assets/illustration2.png"
                            alt="Two people looking at phone with bus in background"
                            className="w-full h-auto max-w-2xl mx-auto lg:mx-0"
                        />
                    </div>

                    {/* About Us Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="space-y-6 md:space-y-8">
                            {/* Title */}
                            <h1 className={`font-bold text-2xl md:text-3xl lg:text-4xl ${isDark ? 'text-white' : 'text-[#343434]'}`}>
                                About Us
                            </h1>

                            {/* Divider */}


                            {/* Content */}
                            <div className="space-y-4 md:space-y-6">
                                <p className={`font-light text-base md:text-lg lg:text-xl leading-relaxed ${isDark ? 'text-white' : 'text-[#343434]'}`}>
                                    RideNow is a smart, on-demand ride service built to move people faster, safer, and more conveniently. We connect riders with trusted drivers in real time, making everyday transportation simple, reliable, and stress-free.
                                </p>

                                <p className={`font-light text-base md:text-lg lg:text-xl leading-relaxed ${isDark ? 'text-white' : 'text-[#343434]'}`}>
                                    Our mission is to transform how people move within their cities by using technology to deliver seamless ride experiences at the tap of a button. Whether you're commuting to work, running errands, or heading out with friends, RideNow is designed to get you there comfortably and on time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
            <footer className={`${isDark ? 'bg-[#005BAF]' : 'bg-[#005BAF]'} text-white w-full mt-8 lg:-bottom-24 lg:left-0 lg:right-0 lg:mt-0`}>
                <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
                        {/* Copyright */}
                        <div className="flex items-center gap-2 order-2 lg:order-1">
                            <span className="text-xl">©</span>
                            <span className="text-sm md:text-base">2025 RideNow.com</span>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm order-1 lg:order-2">
                            <div className="flex items-center gap-2 md:gap-4">
                                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-xs md:text-sm">+2347033465786 | +2348087653978</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs md:text-sm">info@ridenow.com</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 md:gap-4 order-3 lg:order-3">
                            {socialLinks.map((social) => (
                                <SocialIcon
                                    key={social.label}
                                    href={social.href}
                                    icon={React.cloneElement(social.icon as React.ReactElement, {
                                        className: "w-4 h-4 md:w-5 md:h-5"
                                    })}
                                    label={social.label}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default RideNowLanding;