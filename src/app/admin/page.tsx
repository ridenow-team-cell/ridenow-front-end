"use client"
import React, { useState, useEffect } from 'react';
import { Users, User, Ticket, Bus, MoreVertical, ChevronDown } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import DropdownMenu from '@/components/ui/DropdownMenu';

interface TripData {
    trip: number;
    bus: string;
    route: string;
    driver: string;
    status: string;
    statusColor: string;
}

interface LocationData {
    name: string;
    percentage: number;
    color: string;
}

interface ChartData {
    completed: number;
    inprogress: number;
    canceled: number;
}

const DashboardPage: React.FC = () => {
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Area');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const stats = [
        { icon: '/assets/icons/users.png', label: 'Users', value: '345', bgColor: 'bg-[#0066CC]' },
        { icon: '/assets/icons/driver.png', label: 'Drivers', value: '64', bgColor: 'bg-[#E7A533]' },
        { icon: '/assets/icons/ticket.png', label: 'Sold Tickets', value: '345', bgColor: 'bg-gray-800' },
        { icon: '/assets/icons/bus.png', label: 'Trips', value: '200', bgColor: 'bg-green-600' },
    ];

    const tripData: TripData[] = [
        { trip: 23, bus: 'Bus06', route: 'Route 9', driver: 'Ade', status: 'Upcoming', statusColor: 'text-[orange-500]' },
        { trip: 32, bus: 'Bus 05', route: 'Route 45', driver: 'Musa', status: 'In progress', statusColor: 'text-blue-600' },
    ];

    const locationData: LocationData[] = [
        { name: 'Nile University', percentage: 35, color: 'bg-[#0066CC]' },
        { name: 'Central Area', percentage: 25, color: 'bg-red-500' },
        { name: 'Maitama', percentage: 20, color: 'bg-green-500' },
        { name: 'Asokoro', percentage: 18, color: 'bg-[#E7A533]' },
        { name: 'Wuse', percentage: 10, color: 'bg-purple-500' },
    ];

    const filterMenuItems = [
        { label: 'Area', onClick: () => setSelectedFilter('Area') },
        { label: 'District', onClick: () => setSelectedFilter('District') },
        { label: 'Bus', onClick: () => setSelectedFilter('Bus') },
        { label: 'Driver', onClick: () => setSelectedFilter('Driver') },
        { label: 'User', onClick: () => setSelectedFilter('User') },
    ];

    const filterOptions = ['Area', 'District', 'Bus', 'Driver', 'User'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yAxisValues = ['0', '25', '50', '75', '100'];

    // Generate random chart data
    const generateChartData = (): ChartData[] => {
        return months.map(() => ({
            completed: Math.floor(Math.random() * 30) + 10, // 10-40%
            inprogress: Math.floor(Math.random() * 30) + 20, // 20-50%
            canceled: Math.floor(Math.random() * 20) + 5, // 5-25%
        }));
    };

    useEffect(() => {
        setChartData(generateChartData());
    }, []);

    return (
        <>
            {/* Stats Cards */}
            <div className="grid bg-white rounded-md p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Updated Chart Section */}
                <div className="lg:col-span-2 bg-white rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Bus Trip Overview</h2>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Filter by:</span>
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 text-gray-500"
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
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-gray-500"
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
                        <div className="flex min-w-[300px]">
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
                                        {[...Array(5)].map((_, index) => (
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

                {/* Revenue Card */}
                <div className="bg-white rounded-lg p-4 flex flex-col gap-6 sm:p-6">
                    <div className='flex flex-col sm:gap-4 gap-4 border border-[#E4E4E4] rounded-lg p-4'>
                        <div className="flex items-start justify-between mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DE5753] rounded-full flex font-medium sm:text-2xl items-center justify-center text-white flex-shrink-0">
                                    ₦
                                </div>
                                <span className="text-base sm:text-lg font-semibold text-gray-800 whitespace-nowrap">Total Revenue</span>
                            </div>
                            <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                                <MoreVertical size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="text-center mb-2">
                            <p className="text-2xl sm:text-4xl font-bold text-gray-800 break-words">
                                ₦ <span className='text-[#005BAF]'>2,860,000.00</span>
                            </p>
                        </div>
                        <p className="text-center text-sm text-gray-500 mb-6 sm:mb-8">Since Last Month</p>
                    </div>

                    {/* Donut Chart */}
                    <div className="border border-[#E4E4E4] rounded-lg p-4 mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-between">
                            <span className="whitespace-nowrap">Bus Booking By Location</span>
                            <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                                <MoreVertical size={20} className="text-gray-400" />
                            </button>
                        </h3>

                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 sm:mb-6">
                            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 192 192">
                                <circle cx="96" cy="96" r="80" fill="none" stroke="#e5e7eb" strokeWidth="32" />
                                <circle cx="96" cy="96" r="80" fill="none" stroke="#0066CC" strokeWidth="32"
                                    strokeDasharray={`${2 * Math.PI * 80 * 0.35} ${2 * Math.PI * 80}`} />
                                <circle cx="96" cy="96" r="80" fill="none" stroke="#ef4444" strokeWidth="32"
                                    strokeDasharray={`${2 * Math.PI * 80 * 0.25} ${2 * Math.PI * 80}`}
                                    strokeDashoffset={`-${2 * Math.PI * 80 * 0.35}`} />
                                <circle cx="96" cy="96" r="80" fill="none" stroke="#22c55e" strokeWidth="32"
                                    strokeDasharray={`${2 * Math.PI * 80 * 0.20} ${2 * Math.PI * 80}`}
                                    strokeDashoffset={`-${2 * Math.PI * 80 * 0.60}`} />
                                <circle cx="96" cy="96" r="80" fill="none" stroke="#E7A533" strokeWidth="32"
                                    strokeDasharray={`${2 * Math.PI * 80 * 0.18} ${2 * Math.PI * 80}`}
                                    strokeDashoffset={`-${2 * Math.PI * 80 * 0.80}`} />
                                <circle cx="96" cy="96" r="80" fill="none" stroke="#a855f7" strokeWidth="32"
                                    strokeDasharray={`${2 * Math.PI * 80 * 0.10} ${2 * Math.PI * 80}`}
                                    strokeDashoffset={`-${2 * Math.PI * 80 * 0.98}`} />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">100%</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-2">
                            {locationData.map((location, index) => (
                                <div key={index} className="flex items-center justify-between text-xs sm:text-sm border-b pb-2 last:border-b-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-3 h-3 ${location.color} rounded-full flex-shrink-0`}></div>
                                        <span className="text-[#3F3F3F] font-light truncate">{location.name}</span>
                                    </div>
                                    <span className="text-[#3F3F3F] font-light flex-shrink-0 ml-2">{location.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bus Movement Table */}
            <div className="mt-4 sm:mt-6 bg-white rounded-lg p-4 sm:p-6 overflow-x-auto">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Bus Movement</h2>
                <div className="min-w-full">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-[#f3f3f3]">
                                <th className="text-left py-3 px-2 sm:px-4 text-[#010237] font-semibold text-sm sm:text-base whitespace-nowrap">Trips</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-[#010237] font-semibold text-sm sm:text-base whitespace-nowrap">Bus</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-[#010237] font-semibold text-sm sm:text-base whitespace-nowrap">Route</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-[#010237] font-semibold text-sm sm:text-base whitespace-nowrap">Driver</th>
                                <th className="text-left py-3 px-2 sm:px-4 text-[#010237] font-semibold text-sm sm:text-base whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tripData.map((trip, index) => (
                                <tr key={index} className="border hover:bg-gray-50 text-gray-500">
                                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-700 text-sm whitespace-nowrap">{trip.trip}</td>
                                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-700 text-sm whitespace-nowrap">{trip.bus}</td>
                                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-700 text-sm whitespace-nowrap">{trip.route}</td>
                                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-700 text-sm whitespace-nowrap">{trip.driver}</td>
                                    <td className="py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">
                                        <span className={`text-sm text-gray-600`}>{trip.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;