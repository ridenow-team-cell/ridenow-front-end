"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarItem from './SidebarItem';
import LogoutModal from '../ui/modals/LogoutModal';
import SuccessModal from '../ui/modals/SuccessModal';

interface SidebarProps {
    activeMenu: string;
    onMenuClick: (label: string) => void;
    mobileMenuOpen: boolean;
    onCloseMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeMenu,
    onMenuClick,
    mobileMenuOpen,
    onCloseMobileMenu
}) => {
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const menuToPathMap: Record<string, string> = {
        'Dashboard': '/admin',
        'Manage Bus': '/admin/manage-bus',
        'Manage Users': '/admin/manage-users',
        'Manage Drivers': '/admin/manage-drivers',
        'Routes & Schedules': '/admin/routes-schedules',
        'Live Tracking': '/admin/live-tracking',
        'Revenue': '/admin/revenue',
        'Reports': '/admin/reports',
        'Support': '/admin/support',
        // 'Manage Roles': '/admin/manage-roles',
        'Tickets': '/admin/tickets',
        'Reviews': '/admin/reviews',
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clear authentication data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('user_role');
            sessionStorage.clear();

            // Clear any cookies if needed
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            // Close logout modal and show success
            setShowLogoutModal(false);
            setShowSuccessModal(true);

            // Redirect to login page after success message
            setTimeout(() => {
                router.push('/auth');
            }, 1500);

        } catch (error) {
            console.error('Logout failed:', error);
            // Could show an error modal here
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleMenuClick = (label: string) => {
        // Close mobile menu if open
        onCloseMobileMenu();

        // Set active menu
        onMenuClick(label);

        if (label === 'Logout') {
            // Show logout confirmation modal
            setShowLogoutModal(true);
        } else {
            // Navigate to other pages
            const path = menuToPathMap[label];
            if (path) {
                router.push(path);
            }
        }
    };

    const sidebarItems = [
        { iconSrc: '/assets/icons/dashboard.png', label: 'Dashboard' },
        { iconSrc: '/assets/icons/bus.png', label: 'Manage Bus' },
        { iconSrc: '/assets/icons/users.png', label: 'Manage Users' },
        { iconSrc: '/assets/icons/driver.png', label: 'Manage Drivers' },
        { iconSrc: '/assets/icons/calendar.png', label: 'Routes & Schedules' },
        { iconSrc: '/assets/icons/target.png', label: 'Live Tracking' },
        { iconSrc: '/assets/icons/revenue.png', label: 'Revenue' },
        { iconSrc: '/assets/icons/chart.png', label: 'Reports' },
        { iconSrc: '/assets/icons/support.png', label: 'Support' },
        // { iconSrc: '/assets/icons/shield.png', label: 'Manage Roles' },
        { iconSrc: '/assets/icons/ticket.png', label: 'Tickets' },
        { iconSrc: '/assets/icons/review.png', label: 'Reviews' },
        { iconSrc: '/assets/icons/logout.png', label: 'Logout' },
    ];

    return (
        <>
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-30
                w-72 bg-[#0066CC] flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div
                    className="relative w-[160px] md:w-[180px] lg:w-[215px] h-[45px] md:h-[50px] lg:h-[60px] p-4 mb-12 cursor-pointer"
                    onClick={() => handleMenuClick('Dashboard')}
                >
                    <img
                        src="/assets/logo2.png"
                        alt="RideNow Logo Light"
                        className="absolute w-full h-auto transition-opacity duration-300"
                        loading="eager"
                    />
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-2">
                    {sidebarItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            iconSrc={item.iconSrc}
                            label={item.label}
                            isActive={activeMenu === item.label}
                            onClick={() => handleMenuClick(item.label)}
                            isLogout={item.label === 'Logout'}
                        />
                    ))}
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => {
                    if (!isLoggingOut) {
                        setShowLogoutModal(false);
                    }
                }}
                onConfirm={handleLogout}
                isLoading={isLoggingOut}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Logged Out Successfully!"
                message="Redirecting to login page..."
            />
        </>
    );
};

export default Sidebar;