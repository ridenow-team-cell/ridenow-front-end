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
    const [isLoading, setIsLoading] = useState(false);
    const [nextPath, setNextPath] = useState('');

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
            // Show loader
            setIsLoading(true);
            setNextPath(path);

            // Small delay to show the loader
            setTimeout(() => {
                router.push(path);
            }, 300);
        } else if (path === '/admin/logout') {
            // Handle logout
            console.log('Logging out...');
        }
    };

    // Effect to hide loader when navigation is complete
    useEffect(() => {
        if (pathname) {
            const timer = setTimeout(() => {
                setIsLoading(false);
                setNextPath('');
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    return (
        <div className="flex font-inter h-screen bg-[#f3f3f3]">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar - Always visible */}
            <Sidebar
                activeMenu={activeMenu}
                onMenuClick={handleMenuClick}
                mobileMenuOpen={mobileMenuOpen}
                onCloseMobileMenu={() => setMobileMenuOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-auto w-full relative">
                {/* Loader Overlay - Only over content area */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center">
                            {/* Logo */}
                            <div className="relative w-[120px] h-[35px] sm:w-[140px] sm:h-[40px] mb-6">
                                <img
                                    src="/assets/logo.png"
                                    alt="RideNow Logo"
                                    className="absolute w-full h-auto"
                                />
                            </div>

                            {/* Spinner */}
                            <div className="relative w-14 h-14">
                                <div className="absolute inset-0 border-3 border-gray-300 rounded-full"></div>
                                <div className="absolute inset-0 border-3 border-[#0066CC] border-t-transparent rounded-full animate-spin"></div>
                            </div>


                        </div>
                    </div>
                )}
                {/* Header */}
                <Header
                    title={activeMenu}
                    onMenuToggle={() => setMobileMenuOpen(true)}
                />

                {/* Page Content */}
                <div className="p-4 sm:p-8 relative">


                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;