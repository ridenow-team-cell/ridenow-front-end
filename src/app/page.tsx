'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Facebook, Instagram, Music, Menu, X } from 'lucide-react';
import Header from '@/components/Header';
import { useTheme } from './context/ThemeContext';

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

// Updated NavLink to accept isDark prop
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isDark: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isDark }) => (
  <a
    href={href}
    className={`${isDark ? 'text-white hover:text-[#005BAF]' : 'text-[#343434] hover:text-[#005BAF]'} transition-all duration-500 ease-in-out text-base lg:text-lg hover:scale-105 transform`}
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
      className="inline-block transition-all duration-700 ease-out hover:scale-110 hover:rotate-1 transform"
    >
      <img
        src={imageUrl}
        alt={`Download on ${isGoogle ? 'Google Play' : 'App Store'}`}
        className="h-10 md:h-12 lg:h-14 w-auto transition-all duration-500"
      />
    </a>
  );
};

const SocialIcon: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <a
    href={href}
    className="text-white hover:text-[#005BAF] transition-all duration-500 ease-in-out transform hover:scale-125"
    aria-label={label}
  >
    {icon}
  </a>
);

// Main Component
const RideNowLanding: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setIsLoaded(true);
  }, []);

  const socialLinks: SocialLink[] = [
    { icon: <Facebook className="w-5 h-5" />, href: '#facebook', label: 'Facebook' },
    { icon: <Instagram className="w-5 h-5" />, href: '#instagram', label: 'Instagram' },
    { icon: <Music className="w-5 h-5" />, href: '#tiktok', label: 'TikTok' },
  ];

  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pb-0 mb-0 ${isDark ? 'bg-gray-900' : 'bg-white'} transition-all duration-700 ease-in-out`}>
      {/* Header */}
      <Header currentPage="home" />

      {/* Hero Section */}
      <main className="container mx-auto px-4 md:px-6 pb-0">
        <div className="flex flex-col items-center justify-start">
          {/* Hero Image Container */}
          <div className="relative w-full max-w-3xl lg:mb-8 transition-all duration-1000 ease-out">
            <img
              src="/assets/illustration.png"
              alt="Two people looking at phone with bus in background"
              className="w-full h-auto transition-all duration-700 hover:scale-105 transform"
            />

            {/* Download CTA - Responsive positioning with animations */}
            <div className={`absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-sm md:max-w-md px-4 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-center">
                <div className="inline-block backdrop-blur-sm bg-black/30 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg mb-3 sm:mb-4 md:mb-6 transition-all duration-700 hover:scale-105 transform hover:bg-black/40">
                  <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold transition-all duration-300 hover:tracking-wide">
                    Download the app
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                  <AppDownloadButton store="google" />
                  <AppDownloadButton store="apple" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Responsive positioning and layout with animations */}
          <footer className={`${isDark ? 'bg-[#005BAF]' : 'bg-[#005BAF]'} text-white w-full mt-8 lg:absolute lg:-bottom-24 lg:left-0 lg:right-0 lg:mt-0 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
                {/* Copyright */}
                <div className="flex items-center gap-2 order-2 lg:order-1 transition-all duration-500 hover:scale-105 transform">
                  <span className="text-xl transition-all duration-300 hover:rotate-12">©</span>
                  <span className="text-sm md:text-base transition-all duration-300 hover:tracking-wider">
                    2025 RideNow.com
                  </span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm order-1 lg:order-2">
                  <div className="flex items-center gap-2 md:gap-4 transition-all duration-500 hover:scale-105 transform">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 transition-all duration-300 hover:rotate-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-xs md:text-sm transition-all duration-300 hover:tracking-wide">
                      +2347033465786 | +2348087653978
                    </span>
                  </div>

                  <div className="flex items-center gap-2 transition-all duration-500 hover:scale-105 transform">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 transition-all duration-300 hover:rotate-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs md:text-sm transition-all duration-300 hover:tracking-wide">
                      info@ridenow.com
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 md:gap-4 order-3 lg:order-3">
                  {socialLinks.map((social) => (
                    <SocialIcon
                      key={social.label}
                      href={social.href}
                      icon={React.cloneElement(social.icon as React.ReactElement, {
                        className: "w-4 h-4 md:w-5 md:h-5 transition-all duration-300"
                      })}
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