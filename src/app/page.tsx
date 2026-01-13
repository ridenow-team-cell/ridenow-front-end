'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Facebook, Instagram, Music } from 'lucide-react';

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
    className={`${isDark ? 'text-white hover:text-blue-400' : 'text-[#343434] hover:text-blue-600'} transition-colors duration-200`}
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
        className="h-14 w-auto"
      />
    </a>
  );
};

const SocialIcon: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <a
    href={href}
    className="text-white hover:text-blue-300 transition-colors duration-200"
    aria-label={label}
  >
    {icon}
  </a>
);

// Main Component
const RideNowLanding: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navigationLinks: NavigationLink[] = [
    { label: 'About Us', href: '#about' },
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
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          {/* Logo - Shows different logo based on theme */}
          <div className="relative w-[215px] h-[60px]">
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

          <div className="flex items-center gap-8">
            {navigationLinks.map((link) => (
              <NavLink key={link.label} href={link.href} isDark={isDark}>
                {link.label}
              </NavLink>
            ))}
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-6">
        <div className="flex flex-col items-center justify-start">
          {/* Hero Image with Download CTA positioned below */}
          <div className="relative w-full max-w-3xl mb-8">
            <img
              src="/assets/illustration.png"
              alt="Two people looking at phone with bus in background"
              className="w-full h-auto"
            />

            {/* Download CTA - Positioned below the image */}
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-md">
              <div className="text-center">
                <div className="inline-block backdrop-blur-sm bg-black/30 px-8 py-4 rounded-lg mb-6">
                  <h2 className="text-white text-2xl font-semibold">Download the app</h2>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <AppDownloadButton store="google" />
                  <AppDownloadButton store="apple" />
                </div>
              </div>
            </div>

          </div>
          <footer className={`${isDark ? 'bg-blue-700' : 'bg-blue-600'} text-white absolute -bottom-24 left-0 right-0`}>
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                {/* Copyright */}
                <div className="flex items-center gap-2">
                  <span className="text-xl">©</span>
                  <span>2025 RideNow.com</span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
                  <div className="flex items-center gap-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+2347033465786 | +2348087653978</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>info@ridenow.com</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  {socialLinks.map((social) => (
                    <SocialIcon
                      key={social.label}
                      href={social.href}
                      icon={social.icon}
                      label={social.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>


    </div>
  );
};

export default RideNowLanding;