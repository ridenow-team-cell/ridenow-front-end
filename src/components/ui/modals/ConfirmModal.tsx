"use client"
import React from 'react';
import BaseModal from './BaseModal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Yes',
    cancelText = 'No'
}) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 border-4 border-gray-800 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl text-gray-800">?</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-8">{message}</p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0055AA] transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};