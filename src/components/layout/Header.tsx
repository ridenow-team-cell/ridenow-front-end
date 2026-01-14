"use client"
import React, { useState } from 'react';
import { Bell, Settings, Search, User, Menu } from 'lucide-react';
import DropdownMenu from '../ui/DropdownMenu';

interface HeaderProps {
    title: string;
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuToggle }) => {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const userMenuItems = [
        { label: 'Profile', onClick: () => console.log('Profile') },
        { label: 'Change Password', onClick: () => console.log('Change Password') },
        { label: 'Logout', onClick: () => console.log('Logout') },
    ];

    return (
        <div className="bg-[#f3f3f3] shadow-sm sticky top-0 z-10">
            <div className="px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} className="text-gray-700" />
                    </button>
                    <h1 className="text-xl sm:text-3xl font-semibold font-roboto text-[#343434]">{title}</h1>
                </div>

                <div className="flex items-center gap-2 ">
                    {/* Search - Hidden on small screens */}
                    <div className="hidden md:block relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#005BAF]" size={20} />
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="pl-10 pr-4 py-2 bg-white rounded-lg w-64 lg:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#34343470] text-[#34343470]"
                        />
                    </div>

                    {/* Icons */}
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <img src="/assets/not.png" alt="" />
                    </button>
                    <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <img src="/assets/set.png" alt="" />
                    </button>

                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-2 sm:gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                        >
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-gray-800">Jerry Attah</p>
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                                <img src="/assets/user.png" alt="" />
                            </div>
                        </button>
                        <DropdownMenu
                            isOpen={userDropdownOpen}
                            onClose={() => setUserDropdownOpen(false)}
                            items={userMenuItems}
                            position={{ top: 60, right: 20 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;