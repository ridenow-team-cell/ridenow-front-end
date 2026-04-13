'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Music } from 'lucide-react';
import { SocialIcon } from '../about/page';
import Header from '@/components/Header';
import { useTheme } from '../context/ThemeContext';

// Type definitions
interface ContactInfo {
    icon: React.ReactNode;
    title: string;
    value: string;
    href: string;
}

interface SocialLink {
    icon: React.ReactNode;
    href: string;
    label: string;
}

const ContactUsPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger fade-in animation on mount
        setIsLoaded(true);
    }, []);

    const contactInfo: ContactInfo[] = [
        {
            icon: <Phone className="w-6 h-6 transition-all duration-500" />,
            title: 'Phone',
            value: '+2347033465786\n+2348087653978',
            href: 'tel:+2347033465786'
        },
        {
            icon: <Mail className="w-6 h-6 transition-all duration-500" />,
            title: 'Email',
            value: 'info@ridenow.com\nsupport@ridenow.com',
            href: 'mailto:info@ridenow.com'
        },
        {
            icon: <MapPin className="w-6 h-6 transition-all duration-500" />,
            title: 'Address',
            value: 'Lagos, Nigeria\nWest Africa',
            href: 'https://maps.google.com/?q=Lagos,Nigeria'
        }
    ];

    const socialLinks: SocialLink[] = [
        { icon: <Facebook className="w-5 h-5" />, href: '#facebook', label: 'Facebook' },
        { icon: <Instagram className="w-5 h-5" />, href: '#instagram', label: 'Instagram' },
        { icon: <Music className="w-5 h-5" />, href: '#tiktok', label: 'TikTok' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const { isDark } = useTheme();

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} transition-all duration-700 ease-in-out`}>
            {/* Header */}
            <Header currentPage="contact-us" />

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 lg:py-16">
                {/* Page Header with fade-in animation */}
                <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 ${isDark ? 'text-white' : 'text-[#343434]'} hover:tracking-wide`}>
                        Contact Us
                    </h1>
                    <p className={`mt-6 text-lg md:text-xl max-w-2xl mx-auto transition-all duration-700 ${isDark ? 'text-gray-300' : 'text-gray-600'} hover:leading-loose`}>
                        Get in touch with us. We're here to help with any questions about our services.
                    </p>
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className={`text-2xl md:text-3xl font-bold mb-6 transition-all duration-700 ${isDark ? 'text-white' : 'text-[#343434]'} hover:tracking-wide`}>
                                Get in Touch with Ridenow
                            </h2>

                            <div className="space-y-6">
                                {contactInfo.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ease-in-out hover:scale-[1.02] transform ${isDark
                                            ? 'bg-gray-800/50 hover:bg-gray-800 hover:shadow-lg hover:shadow-blue-900/20'
                                            : 'bg-gray-50 hover:bg-gray-100 hover:shadow-lg hover:shadow-blue-500/10'
                                            }`}
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                    >
                                        <div className={`p-3 rounded-full transition-all duration-500 hover:scale-110 transform ${isDark ? 'bg-gray-700 hover:bg-[#005BAF]' : 'bg-gray-200 hover:bg-[#005BAF]'}`}>
                                            <div className={isDark ? 'text-white' : 'text-[#005BAF]'}>
                                                {item.icon}
                                            </div>
                                        </div>
                                        <div className="transition-all duration-500">
                                            <h3 className={`font-bold text-lg mb-1 transition-all duration-300 ${isDark ? 'text-white' : 'text-[#343434]'} hover:tracking-wide`}>
                                                {item.title}
                                            </h3>
                                            <p className={`whitespace-pre-line transition-all duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'} hover:leading-relaxed`}>
                                                {item.value}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h3 className={`text-xl font-bold mb-4 transition-all duration-700 ${isDark ? 'text-white' : 'text-[#343434]'} hover:tracking-wide`}>
                                Follow Us
                            </h3>
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className={`p-3 rounded-full transition-all duration-500 ease-in-out transform hover:scale-125 hover:rotate-12 ${isDark
                                            ? 'bg-gray-800 hover:bg-[#005BAF] text-white hover:shadow-lg hover:shadow-blue-900/30'
                                            : 'bg-gray-100 hover:bg-[#005BAF] hover:text-white text-gray-700 hover:shadow-lg hover:shadow-blue-500/20'
                                            }`}
                                        aria-label={social.label}
                                        style={{ transitionDelay: `${index * 100}ms` }}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={`p-6 md:p-8 rounded-2xl transition-all duration-700 ease-out ${isDark ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-gray-50 hover:bg-gray-100'} hover:shadow-xl`}>
                        <h2 className={`text-2xl md:text-3xl font-bold mb-6 transition-all duration-700 ${isDark ? 'text-white' : 'text-[#343434]'} hover:tracking-wide`}>
                            Send us a Message
                        </h2>

                        {submitSuccess && (
                            <div className={`mb-6 p-4 rounded-lg transition-all duration-700 ease-out transform ${isDark ? 'bg-green-900/30 text-green-300 hover:scale-105' : 'bg-green-50 text-green-700 hover:scale-105'}`}>
                                Thank you for your message! We'll get back to you within 24 hours.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="transition-all duration-500 hover:scale-105 transform">
                                    <label className={`block text-sm font-medium mb-2 transition-all duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'} hover:tracking-wide`}>
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-500 ease-in-out focus:scale-105 transform ${isDark
                                            ? 'bg-gray-700 border-gray-600 text-white focus:border-[#005BAF] focus:ring-2 focus:ring-[#005BAF]/20 hover:border-[#005BAF]'
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-[#005BAF] focus:ring-2 focus:ring-[#005BAF]/20 hover:border-[#005BAF]'
                                            }`}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="transition-all duration-500 hover:scale-105 transform">
                                    <label className={`block text-sm font-medium mb-2 transition-all duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'} hover:tracking-wide`}>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-500 ease-in-out focus:scale-105 transform ${isDark
                                            ? 'bg-gray-700 border-gray-600 text-white focus:border-[#005BAF] focus:ring-2 focus:ring-[#005BAF]/20 hover:border-[#005BAF]'
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-[#005BAF] focus:ring-2 focus:ring-[#005BAF]/20 hover:border-[#005BAF]'
                                            }`}
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="transition-all duration-500 hover:scale-105 transform">
                                <label className={`block text-sm font-medium mb-2 transition-all duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'} hover:tracking-wide`}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-500 ease-in-out focus:scale-105 transform ${isDark
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-[#005BAF] focus:ring-2 focus:ring-[#005BAF]/20 hover:border-[#005BAF]'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-[#005BAF] focus:ring-2 focus:ring-[#005BAF]/20 hover:border-[#005BAF]'
                                        }`}
                                    placeholder="+234 123 456 7890"
                                />
                            </div>

                            <div className="transition-all duration-500 hover:scale-105 transform">
                                <label className={`block text-sm font-medium mb-2 transition-all duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'} hover:tracking-wide`}>
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-500 ease-in-out focus:scale-105 transform ${isDark
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-[#005BAF] focus:ring-2 focus:ring-[#005BAF]/20 hover:border-[#005BAF]'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-[#005BAF] focus:ring-2 focus:ring-[#005BAF]/20 hover:border-[#005BAF]'
                                        }`}
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-700 ease-in-out flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-xl ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#005BAF] hover:bg-[#004a94] text-white hover:shadow-lg'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="transition-all duration-300 hover:tracking-wide">Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 transition-all duration-500 hover:rotate-12" />
                                        <span className="transition-all duration-300 hover:tracking-wide">Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <p className={`mt-6 text-sm transition-all duration-500 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                            * Required fields. We respect your privacy and will not share your information.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer with smooth animations */}
            <footer className={`${isDark ? 'bg-[#005BAF]' : 'bg-[#005BAF]'} text-white w-full mt-8 lg:-bottom-24 lg:left-0 lg:right-0 lg:mt-0 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                                        className: "w-4 h-4 md:w-5 md:h-5 transition-all duration-500"
                                    })}
                                    label={social.label}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ContactUsPage;