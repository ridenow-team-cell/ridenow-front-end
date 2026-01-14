"use client"
import React, { useState } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';

interface Column {
    key: string;
    header: string;
    className?: string;
}

interface Action {
    label: string;
    onClick: (item: any) => void;
    icon?: React.ReactNode;
    className?: string;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    actions?: Action[];
    onRowClick?: (item: any) => void;
    showCheckbox?: boolean;
    selectedItems?: any[];
    onSelectItem?: (item: any) => void;
    onSelectAll?: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    actions,
    onRowClick,
    showCheckbox = false,
    selectedItems = [],
    onSelectItem,
    onSelectAll
}) => {
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

    const allSelected = data.length > 0 && selectedItems.length === data.length;

    return (
        <div className="bg-white rounded-lg p-4 sm:p-6 overflow-x-auto">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="border bg-[#f3f3f3] rounded-lg">
                        {showCheckbox && (
                            <th className="text-left py-3 px-4 text-[#010237] font-semibold text-sm sm:text-base">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={onSelectAll}
                                    className="rounded border-gray-300"
                                />
                            </th>
                        )}
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`text-left py-3 px-4 text-[#010237] font-semibold text-sm sm:text-base ${column.className || ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                        {actions && actions.length > 0 && (
                            <th className="text-left py-3 px-4 text-[#010237] font-semibold text-sm sm:text-base">Action</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={item.id || index}
                            className="border hover:bg-gray-50 cursor-pointer"
                            onClick={() => onRowClick?.(item)}
                        >
                            {showCheckbox && (
                                <td className="py-4 px-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.some(selected => selected.id === item.id)}
                                        onChange={() => onSelectItem?.(item)}
                                        className="rounded border-gray-300"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                            )}
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={`py-4 px-4 text-gray-700 text-sm ${column.className || ''}`}
                                >
                                    {item[column.key]}
                                </td>
                            ))}
                            {actions && actions.length > 0 && (
                                <td className="py-4 px-4 relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDropdownOpen(dropdownOpen === index ? null : index);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <img src="/assets/icons/drop.png" alt="" width={20} />
                                    </button>
                                    {dropdownOpen === index && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDropdownOpen(null);
                                                }}
                                            />
                                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                                {actions.map((action, actionIndex) => (
                                                    <button
                                                        key={actionIndex}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            action.onClick(item);
                                                            setDropdownOpen(null);
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${'text-[#010237]'}`}
                                                    >
                                                        {action.icon}
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;