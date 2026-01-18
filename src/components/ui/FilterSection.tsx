"use client"
import React, { useState } from 'react';
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
    const [searchValue, setSearchValue] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch?.(value);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch?.(searchValue);
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col gap-6">
                {/* Search and Filter Row */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 w-full lg:w-auto">
                        {/* Date Range */}
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
                            <Calendar size={20} className="text-gray-400" />
                            <span className="text-sm text-gray-700">Today</span>
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => {
                                setShowFilters(!showFilters);
                                onFilter?.();
                            }}
                            className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-sm text-gray-700">Filter</span>
                            <ChevronDown size={20} className="text-gray-400" />
                        </button>

                        {/* Search Input */}
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 flex-1 w-full sm:w-auto">
                            <Search size={20} className="text-gray-400" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleSearch}
                                onKeyPress={handleKeyPress}
                                placeholder="Search by name, email, or phone"
                                className="border-none outline-none text-sm flex-1 bg-transparent placeholder-gray-400 text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        {/* Search Button */}
                        <button
                            onClick={() => onSearch?.(searchValue)}
                            className="flex items-center justify-center gap-2 bg-[#E7A533] text-gray-800 px-6 py-2 rounded-lg hover:bg-[#d69420] transition-colors flex-1 lg:flex-initial"
                        >
                            <span className="text-base font-medium">Search</span>
                        </button>

                        {/* Add Button */}
                        {showAddButton && (
                            <button
                                onClick={onAdd}
                                className="flex items-center justify-center gap-2 bg-[#0066CC] text-white px-6 py-2 rounded-lg hover:bg-[#0052a3] transition-colors flex-1 lg:flex-initial"
                            >
                                <PlusCircle size={20} />
                                <span className="text-base font-medium">{addButtonText}</span>
                            </button>
                        )}

                        {/* Unblock All Button */}
                        {showUnblockAll && (
                            <button
                                onClick={onUnblockAll}
                                className="flex items-center justify-center gap-2 bg-[#0066CC] text-white px-6 py-2 rounded-lg hover:bg-[#0052a3] transition-colors flex-1 lg:flex-initial"
                            >
                                <span className="text-base font-medium">Activate All</span>
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FilterSection;