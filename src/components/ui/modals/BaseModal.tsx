"use client"
import React from 'react';
import { X } from 'lucide-react';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const BaseModal: React.FC<BaseModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    };

    return (
        <>
            <div className="fixed inset-0  bg-black/50 bg-opacity-50 z-40" onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className={`bg-white rounded-lg w-full ${sizeClasses[size]} mx-auto max-h-[90vh] overflow-y-auto`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {title && (
                        <div className="flex items-center justify-between p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>
                    )}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BaseModal;