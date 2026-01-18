"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Download, FileText, BarChart, Users, Bus, Route, Clock, Ticket, ChevronDown, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import FilterSection from '@/components/ui/FilterSection';
import {
    useDashboardStatistics,
    useGenerateBusReport,
    useGenerateDriverReport,
    useGenerateRouteReport,
    useGenerateScheduleReport,
    useGenerateTicketReport,
    useGenerateComprehensiveReport
} from '@/hooks/use-report';
import { reportService } from '@/services/report-service';
import { toast } from 'react-hot-toast';

const ReportsPage = () => {
    const [selectedReport, setSelectedReport] = useState<string>('');
    const [generatedReport, setGeneratedReport] = useState<any>(null);
    const [showReportPreview, setShowReportPreview] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Statistics hooks
    const { data: dashboardStats, isLoading: statsLoading } = useDashboardStatistics();

    // Add a slight delay before showing content
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 100); // 100ms delay
        return () => clearTimeout(timer);
    }, []);

    const reportTypes = [
        {
            id: 'bus',
            title: 'Bus Fleet Report',
            icon: <Bus className="text-orange-600" size={24} />,
            description: 'Bus fleet status and utilization analytics',
            color: 'bg-orange-100 text-orange-800',
            stats: dashboardStats?.buses
        },
        {
            id: 'driver',
            title: 'Driver Performance Report',
            icon: <Users className="text-blue-600" size={24} />,
            description: 'Driver activity and performance analytics',
            color: 'bg-blue-100 text-blue-800',
            stats: dashboardStats?.drivers
        },
        {
            id: 'route',
            title: 'Route Analytics Report',
            icon: <Route className="text-green-600" size={24} />,
            description: 'Route performance and traffic analytics',
            color: 'bg-green-100 text-green-800',
            stats: dashboardStats?.routes
        },
        {
            id: 'schedule',
            title: 'Schedule Management Report',
            icon: <Clock className="text-purple-600" size={24} />,
            description: 'Schedule efficiency and occupancy analytics',
            color: 'bg-purple-100 text-purple-800',
            stats: dashboardStats?.schedules
        },
        {
            id: 'ticket',
            title: 'Ticket & Revenue Report',
            icon: <Ticket className="text-red-600" size={24} />,
            description: 'Ticket sales and revenue analytics',
            color: 'bg-red-100 text-red-800',
            stats: dashboardStats?.tickets
        },
        {
            id: 'comprehensive',
            title: 'Comprehensive System Report',
            icon: <BarChart className="text-indigo-600" size={24} />,
            description: 'Complete system overview and analytics',
            color: 'bg-indigo-100 text-indigo-800',
            stats: dashboardStats
        }
    ];

    const handleSearch = (searchTerm: string) => {
        console.log('Searching reports:', searchTerm);
    };

    const renderReportStats = (type: string) => {
        const report = reportTypes.find(r => r.id === type);
        if (!report?.stats) return null;

        switch (type) {
            case 'bus':
                const busStats = report.stats as any;
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-gray-800">{busStats.totalBuses}</div>
                            <div className="text-sm text-gray-600">Total Buses</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-green-600">{busStats.availableBuses}</div>
                            <div className="text-sm text-gray-600">Available</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600">{busStats.assignedBuses}</div>
                            <div className="text-sm text-gray-600">Assigned</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-gray-800">{busStats.averageSeats}</div>
                            <div className="text-sm text-gray-600">Avg Seats</div>
                        </div>
                    </div>
                );

            case 'driver':
                const driverStats = report.stats as any;
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-gray-800">{driverStats.totalDrivers}</div>
                            <div className="text-sm text-gray-600">Total Drivers</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-green-600">{driverStats.activeDrivers}</div>
                            <div className="text-sm text-gray-600">Active</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600">{driverStats.onDutyDrivers}</div>
                            <div className="text-sm text-gray-600">On Duty</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-gray-600">{driverStats.unassignedDrivers}</div>
                            <div className="text-sm text-gray-600">Unassigned</div>
                        </div>
                    </div>
                );

            case 'route':
                const routeStats = report.stats as any;
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-gray-800">{routeStats.totalRoutes}</div>
                            <div className="text-sm text-gray-600">Total Routes</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-green-600">{routeStats.activeRoutes}</div>
                            <div className="text-sm text-gray-600">Active</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-red-600">{routeStats.inactiveRoutes}</div>
                            <div className="text-sm text-gray-600">Inactive</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600">{routeStats.averageStops}</div>
                            <div className="text-sm text-gray-600">Avg Stops</div>
                        </div>
                    </div>
                );

            case 'schedule':
                const scheduleStats = report.stats as any;
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-gray-800">{scheduleStats.totalSchedules}</div>
                            <div className="text-sm text-gray-600">Total Schedules</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600">{scheduleStats.scheduledSchedules}</div>
                            <div className="text-sm text-gray-600">Scheduled</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-green-600">{scheduleStats.activeSchedules}</div>
                            <div className="text-sm text-gray-600">Active</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-red-600">{scheduleStats.cancelledSchedules}</div>
                            <div className="text-sm text-gray-600">Cancelled</div>
                        </div>
                    </div>
                );

            case 'ticket':
                const ticketStats = report.stats as any;
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-gray-800">{ticketStats.totalTickets}</div>
                            <div className="text-sm text-gray-600">Total Tickets</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-green-600">{ticketStats.bookedTickets}</div>
                            <div className="text-sm text-gray-600">Booked</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600">
                                {reportService.formatCurrency(ticketStats.totalRevenue)}
                            </div>
                            <div className="text-sm text-gray-600">Total Revenue</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-purple-600">
                                {reportService.formatCurrency(ticketStats.todayRevenue)}
                            </div>
                            <div className="text-sm text-gray-600">Today Revenue</div>
                        </div>
                    </div>
                );

            case 'comprehensive':
                const comprehensiveStats = report.stats as any;
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-gray-800">{comprehensiveStats?.buses?.totalBuses || 0}</div>
                            <div className="text-sm text-gray-600">Total Buses</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600">{comprehensiveStats?.drivers?.totalDrivers || 0}</div>
                            <div className="text-sm text-gray-600">Total Drivers</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-green-600">{comprehensiveStats?.routes?.totalRoutes || 0}</div>
                            <div className="text-sm text-gray-600">Total Routes</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <div className="text-2xl font-bold text-red-600">
                                {reportService.formatCurrency(comprehensiveStats?.tickets?.totalRevenue || 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Revenue</div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Show loading state or delayed content
    if (!showContent) {
        return (
            <div className="p-4 sm:p-6">

            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Quick Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Bus size={20} className="text-orange-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '--' : dashboardStats?.buses?.totalBuses || 0}
                            </div>
                            <div className="text-sm text-gray-600">Buses</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '--' : dashboardStats?.drivers?.totalDrivers || 0}
                            </div>
                            <div className="text-sm text-gray-600">Drivers</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Route size={20} className="text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '--' : dashboardStats?.routes?.totalRoutes || 0}
                            </div>
                            <div className="text-sm text-gray-600">Routes</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '--' : dashboardStats?.schedules?.totalSchedules || 0}
                            </div>
                            <div className="text-sm text-gray-600">Schedules</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Ticket size={20} className="text-red-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '--' : dashboardStats?.tickets?.totalTickets || 0}
                            </div>
                            <div className="text-sm text-gray-600">Tickets</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <BarChart size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">
                                {statsLoading ? '--' : reportService.formatCurrency(dashboardStats?.tickets?.totalRevenue || 0)}
                            </div>
                            <div className="text-sm text-gray-600">Revenue</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports Display Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6 mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">System Reports</h2>



                {/* Report Cards */}
                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reportTypes.map((report) => (
                            <div
                                key={report.id}
                                className={`border rounded-lg p-4 transition-all hover:shadow-md ${selectedReport === report.id
                                    ? 'border-[#0066CC] bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setSelectedReport(report.id)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg border">
                                            {report.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{report.title}</h3>
                                            <p className="text-sm text-gray-600">{report.description}</p>
                                        </div>
                                    </div>
                                    {selectedReport === report.id && (
                                        <div className="w-2 h-2 bg-[#0066CC] rounded-full"></div>
                                    )}
                                </div>

                                {renderReportStats(report.id)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;