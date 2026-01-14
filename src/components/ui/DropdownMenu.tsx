import React from 'react';

interface DropdownMenuProps {
    isOpen: boolean;
    onClose: () => void;
    items: Array<{ label: string; onClick: () => void }>;
    position: { top: number; right: number };
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose, items, position }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-10" onClick={onClose}></div>
            <div
                className="absolute bg-white rounded-lg shadow-xl py-2 z-20 min-w-[180px]"
                style={{ top: position.top, right: position.right }}
            >
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            item.onClick();
                            onClose();
                        }}
                        className="w-full text-left px-6 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </>
    );
};

export default DropdownMenu;