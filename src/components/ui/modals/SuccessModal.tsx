"use client"
import React from 'react';
import { Check } from 'lucide-react';
import BaseModal from './BaseModal';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title = 'Success',
    message
}) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-[#0066CC] rounded-full flex items-center justify-center mb-4">
                    <Check className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                {message && <p className="text-gray-600">{message}</p>}
                <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0055AA] transition-colors"
                >
                    Done
                </button>
            </div>
        </BaseModal>
    );
};

export default SuccessModal;