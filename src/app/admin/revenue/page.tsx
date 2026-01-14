"use client"
import React, { useState } from 'react';
import { ChevronDown, MoreVertical, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

const RevenuePage = () => {
    const [selectedFilter, setSelectedFilter] = useState('2025');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const filterOptions = ['2024', '2025', '2026'];

    // Chart data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yAxisValues = ['0', '20', '40', '60', '80', '100'];

    // Generate random data for the chart bars
    const generateChartData = () => {
        return months.map(() => ({
            canceled: Math.floor(Math.random() * 60) + 20,
            inprogress: Math.floor(Math.random() * 40) + 30,
            completed: Math.floor(Math.random() * 50) + 40
        }));
    };

    const [chartData, setChartData] = useState(generateChartData());

    // Revenue statistics
    const revenueStats = [
        {
            label: 'Total Revenue Generated',
            value: '₦2,860,000',
            bgColor: 'bg-[#0066CC]',
            icon: '/assets/icons/bag.png',
            trend: 'up',
            percentage: '12%'
        },
        {
            label: 'Payout',
            value: '₦60,000',
            bgColor: 'bg-[#343434]',
            icon: '/assets/icons/revenue.png',
            trend: 'down',
            percentage: '5%'
        },
        {
            label: 'Available Balance',
            value: '₦2,800,000',
            bgColor: 'bg-[#3EAE49]',
            icon: '/assets/icons/wallet.png',
            trend: 'up',
            percentage: '8%'
        }
    ];

    return (
        <div className="p-4 sm:p-6">
            {/* Revenue Statistics Cards */}
            <div className="grid bg-white rounded-md p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {revenueStats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="flex justify-center my-4 sm:my-6">
                <button className="flex items-center gap-2 px-8 py-3 bg-[#0066CC] text-white rounded-lg font-medium hover:bg-[#0055AA] transition-colors whitespace-nowrap">
                    Payouts
                </button>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Generate Revenue</h2>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 whitespace-nowrap">Filter by:</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                            >
                                {selectedFilter}
                                <ChevronDown size={16} className="text-gray-400" />
                            </button>

                            {showFilterDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowFilterDropdown(false)}
                                    />
                                    <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        {filterOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setSelectedFilter(option);
                                                    setShowFilterDropdown(false);
                                                    setChartData(generateChartData());
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-end items-center gap-4 sm:gap-6 mb-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#B6C4D5] rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-600 whitespace-nowrap">Canceled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#617FA5] rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-600 whitespace-nowrap">Inprogress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#343434] rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-600 whitespace-nowrap">Completed</span>
                    </div>
                </div>

                {/* Chart Container - Fixed responsive design */}
                <div className="relative min-w-0 overflow-x-auto">
                    <div className="flex min-w-[400px]">
                        {/* Y-Axis Labels and Grid Lines */}
                        <div className="flex flex-col justify-between h-56 w-8 sm:w-10 pr-2 sm:pr-3 flex-shrink-0">
                            {yAxisValues.map((value, index) => (
                                <div key={index} className="relative text-xs text-gray-500 text-right">
                                    {value}
                                    <div className="absolute right-0 top-1/2 w-2 sm:w-4 h-px bg-gray-100 transform translate-y-1/2"></div>
                                </div>
                            ))}
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 min-w-0">
                            <div className="relative h-56">
                                {/* Horizontal Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="border-t border-gray-100"></div>
                                    ))}
                                </div>

                                {/* Bars Container - Scrollable horizontally if needed */}
                                <div className="flex h-full items-end justify-between px-2 sm:px-4 relative z-10">
                                    {chartData.map((monthData, monthIndex) => (
                                        <div key={monthIndex} className="flex flex-col items-center w-6 sm:w-8 md:w-10">
                                            {/* Bars Container */}
                                            <div className="flex flex-col-reverse h-48 w-4 sm:w-4 md:w-4 relative">
                                                {/* Completed Bar (Gray) - Bottom */}
                                                <div
                                                    className="w-full bg-[#343434] rounded-t"
                                                    style={{ height: `${monthData.completed}%` }}
                                                />

                                                {/* Inprogress Bar (Dark Gray) - Middle */}
                                                <div
                                                    className="w-full bg-[#617FA5] rounded-t"
                                                    style={{
                                                        height: `${monthData.inprogress}%`,
                                                        marginTop: '-1px'
                                                    }}
                                                />

                                                {/* Canceled Bar (Black) - Top */}
                                                <div
                                                    className="w-full bg-[#B6C4D5] rounded-t"
                                                    style={{
                                                        height: `${monthData.canceled}%`,
                                                        marginTop: '-1px'
                                                    }}
                                                />
                                            </div>

                                            {/* Month Label */}
                                            <span className="text-xs text-gray-500 mt-2 whitespace-nowrap">
                                                {months[monthIndex]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* X-Axis Label */}
                    <div className="text-center mt-4 ml-8 sm:ml-10">
                        <span className="text-xs text-gray-500">Months</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenuePage;