"use client"
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface SideModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const SideModal: React.FC<SideModalProps> = ({
    isOpen,
    onClose,
    title,
    children
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            // We'll keep scrolling enabled since it's a non-overlay side sheet
        } else {
            const timer = setTimeout(() => {
                setMounted(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !mounted) return null;

    return (
        <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Transparent click-area (No overlay, no blur) */}
            <div 
                className="absolute inset-0 bg-transparent" 
                onClick={onClose}
            ></div>

            {/* Side Sheet */}
            <div 
                className={`relative w-full max-w-md sm:max-w-xl bg-white h-full shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gray-50/50 sticky top-0 z-10">
                    <div>
                        {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-all group"
                        aria-label="Close"
                    >
                        <X size={24} className="text-gray-500 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SideModal;
