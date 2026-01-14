import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    // Accept either a React component (icon) or a string (image path)
    icon: React.ReactNode | string;
    label: string;
    value: string | number;
    bgColor: string;
    iconBgColor?: string; // Optional background color for the icon container
    iconColor?: string; // Optional color for SVG icons
    iconSize?: number; // Optional size for SVG icons
}

const StatCard: React.FC<StatCardProps> = ({
    icon,
    label,
    value,
    bgColor,
    iconBgColor,
    iconColor = 'white',
    iconSize = 24
}) => {
    const renderIcon = () => {
        // If icon is a string, treat it as an image path
        if (typeof icon === 'string') {
            return (
                <img
                    src={icon}
                    alt={label}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    loading="lazy"
                />
            );
        }

        // If icon is a React element (like Lucide icon), render it directly
        if (React.isValidElement(icon)) {
            // Clone the icon element to pass props if needed
            return React.cloneElement(icon, {
                size: iconSize,
                color: iconColor,
                className: 'w-6 h-6 sm:w-8 sm:h-8'
            });
        }

        // If it's already a rendered component, just return it
        return icon;
    };

    return (
        <div className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-4 transition-shadow duration-200">
            <div
                className={`w-12 h-12 sm:w-16 sm:h-16 ${iconBgColor || bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                style={{ backgroundColor: iconBgColor || bgColor }}
            >
                {renderIcon()}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[#343434] text-sm sm:text-base font-medium mb-1 truncate">{label}</p>
                <p className="text-xl sm:text-3xl font-bold text-[#343434] truncate">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;