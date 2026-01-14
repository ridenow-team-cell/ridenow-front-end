"use client"
import React from 'react';

interface SidebarItemProps {
    iconSrc: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ iconSrc, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full font-light flex items-center gap-3 px-4 sm:px-6 py-3 transition-colors ${isActive
            ? 'text-white font-bold border-r-8 border-[#E7A533]'
            : 'text-white hover:font-medium hover:bg-[#0055AA]'
            }`}
    >
        <img
            src={iconSrc}
            alt={label}
            className="w-5 h-5 object-contain"
            loading="eager"
        />
        <span className={`${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
);

export default SidebarItem;