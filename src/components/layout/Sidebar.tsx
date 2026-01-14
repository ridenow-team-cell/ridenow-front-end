"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import SidebarItem from './SidebarItem';

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

    const sidebarItems = [
        { iconSrc: '/assets/icons/dashboard.png', label: 'Dashboard' },
        { iconSrc: '/assets/icons/users.png', label: 'Manage Bus' },
        { iconSrc: '/assets/icons/users.png', label: 'Manage Users' },
        { iconSrc: '/assets/icons/driver.png', label: 'Manage Drivers' },
        { iconSrc: '/assets/icons/calendar.png', label: 'Routes & Schedules' },
        { iconSrc: '/assets/icons/target.png', label: 'Live Tracking' },
        { iconSrc: '/assets/icons/revenue.png', label: 'Revenue' },
        { iconSrc: '/assets/icons/chart.png', label: 'Reports' },
        { iconSrc: '/assets/icons/support.png', label: 'Support' },
        { iconSrc: '/assets/icons/shield.png', label: 'Manage Roles' },
        { iconSrc: '/assets/icons/ticket.png', label: 'Tickets' },
        { iconSrc: '/assets/icons/review.png', label: 'Reviews' },
        { iconSrc: '/assets/icons/logout.png', label: 'Logout' },
    ];

    return (
        <div className={`
      fixed lg:relative inset-y-0 left-0 z-30
      w-72 bg-[#0066CC] flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
            {/* Logo */}
            <div className="relative w-[160px] md:w-[180px] lg:w-[215px] h-[45px] md:h-[50px] lg:h-[60px] p-4 mb-12 cursor-pointer"
                onClick={() => {
                    onMenuClick('Dashboard');
                }}>
                <img
                    src="/assets/logo2.png"
                    alt="RideNow Logo Light"
                    className="absolute w-full h-auto transition-opacity duration-300"
                    loading="eager"
                />
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
                {sidebarItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        iconSrc={item.iconSrc}
                        label={item.label}
                        isActive={activeMenu === item.label}
                        onClick={() => onMenuClick(item.label)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;