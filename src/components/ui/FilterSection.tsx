"use client"
import React from 'react';
import { Calendar, ChevronDown, Search, PlusCircle } from 'lucide-react';

interface FilterSectionProps {
    onAdd?: () => void;
    onSearch?: (value: string) => void;
    onFilter?: () => void;
    showAddButton?: boolean;
    addButtonText?: string;
    showUnblockAll?: boolean;
    onUnblockAll?: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
    onAdd,
    onSearch,
    onFilter,
    showAddButton = false,
    addButtonText = 'Add User',
    showUnblockAll = false,
    onUnblockAll
}) => {
    const [searchValue, setSearchValue] = React.useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        onSearch?.(e.target.value);
    };

    return (
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 w-full lg:w-auto">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
                        <Calendar size={20} className="text-gray-400" />
                        <span className="text-sm text-gray-700">Dec 29,2025</span>
                        <span className="text-gray-400">-</span>
                        <span className="text-sm text-gray-700">Dec 30,2025</span>
                    </div>

                    <button
                        onClick={onFilter}
                        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-sm text-gray-700">Filter</span>
                        <ChevronDown size={20} className="text-gray-400" />
                    </button>

                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 flex-1 w-full sm:w-auto">
                        <Search size={20} className="text-gray-400" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={handleSearch}
                            placeholder="Search"
                            className="border-none outline-none text-sm flex-1 bg-transparent placeholder-gray-400 text-gray-700"
                        />
                    </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                    <button className="flex items-center justify-center gap-2 bg-[#E7A533] text-gray-800 px-6 py-2 rounded-lg hover:bg-[#d69420] transition-colors flex-1 lg:flex-initial">
                        <span className="text-base font-medium">Search</span>
                    </button>

                    {showAddButton && (
                        <button
                            onClick={onAdd}
                            className="flex items-center justify-center gap-2 bg-[#0066CC] text-white px-6 py-2 rounded-lg hover:bg-[#0052a3] transition-colors flex-1 lg:flex-initial"
                        >
                            <PlusCircle size={20} />
                            <span className="text-base font-medium">{addButtonText}</span>
                        </button>
                    )}

                    {showUnblockAll && (
                        <button
                            onClick={onUnblockAll}
                            className="flex items-center justify-center gap-2 bg-[#0066CC] text-white px-6 py-2 rounded-lg hover:bg-[#0052a3] transition-colors flex-1 lg:flex-initial"
                        >
                            <span className="text-base font-medium">Unblock all</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterSection;