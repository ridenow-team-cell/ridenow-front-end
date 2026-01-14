"use client"
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

// Move this outside component to prevent recreation
const pathToMenuMap: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/manage-bus': 'Manage Bus',
    '/admin/manage-users': 'Manage Users',
    '/admin/manage-drivers': 'Manage Drivers',
    '/admin/routes-schedules': 'Routes & Schedules',
    '/admin/live-tracking': 'Live Tracking',
    '/admin/revenue': 'Revenue',
    '/admin/reports': 'Reports',
    '/admin/support': 'Support',
    '/admin/manage-roles': 'Manage Roles',
    '/admin/tickets': 'Tickets',
    '/admin/reviews': 'Reviews',
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Dashboard');

    // Optimized path matching - runs only when pathname changes
    useEffect(() => {
        // Use exact match first, then find the best matching path
        let matchedMenu = pathToMenuMap[pathname];

        if (!matchedMenu) {
            // Find the closest matching path (for nested routes)
            const matchedPath = Object.keys(pathToMenuMap).find(path =>
                pathname?.startsWith(path)
            );
            matchedMenu = matchedPath ? pathToMenuMap[matchedPath] : 'Dashboard';
        }

        setActiveMenu(matchedMenu);
    }, [pathname]);

    const handleMenuClick = (label: string) => {
        // Immediately update the UI state
        setActiveMenu(label);
        setMobileMenuOpen(false);

        // Get the path and navigate - state is already updated
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
            'Manage Roles': '/admin/manage-roles',
            'Tickets': '/admin/tickets',
            'Reviews': '/admin/reviews',
            'Logout': '/admin/logout'
        };

        const path = menuToPathMap[label];
        if (path && path !== '/admin/logout') {
            router.push(path);
        } else if (path === '/admin/logout') {
            // Handle logout
            console.log('Logging out...');
            // router.push('/login');
        }
    };

    return (
        <div className="flex font-inter h-screen bg-[#f3f3f3]">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <Sidebar
                activeMenu={activeMenu}
                onMenuClick={handleMenuClick}
                mobileMenuOpen={mobileMenuOpen}
                onCloseMobileMenu={() => setMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto w-full">
                {/* Header */}
                <Header
                    title={activeMenu}
                    onMenuToggle={() => setMobileMenuOpen(true)}
                />

                {/* Page Content */}
                <div className="p-4 sm:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;