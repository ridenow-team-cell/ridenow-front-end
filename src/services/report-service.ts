import { axiosInstance } from '@/utils/axios';
import {
    BusStatistics,
    DriverStatistics,
    RouteStatistics,
    ScheduleStatistics,
    TicketStatistics,
    DashboardStatistics,
    GeneratedReport,
    ChartData
} from '@/types/report';

export const reportService = {
    // Get all statistics
    getDashboardStatistics: async (): Promise<DashboardStatistics> => {
        try {
            const [
                buses,
                drivers,
                routes,
                schedules,
                tickets
            ] = await Promise.all([
                axiosInstance.get('/admin/buses/statistics'),
                axiosInstance.get('/admin/drivers/statistics'),
                axiosInstance.get('/admin/routes/statistics'),
                axiosInstance.get('/admin/schedules/statistics'),
                axiosInstance.get('/admin/tickets/statistics')
            ]);

            return {
                buses: buses.data,
                drivers: drivers.data,
                routes: routes.data,
                schedules: schedules.data,
                tickets: tickets.data
            };
        } catch (error) {
            console.error('Error fetching dashboard statistics:', error);
            throw error;
        }
    },

    // Get bus statistics
    getBusStatistics: async (): Promise<BusStatistics> => {
        const response = await axiosInstance.get('/admin/buses/statistics');
        return response.data;
    },

    // Get driver statistics
    getDriverStatistics: async (): Promise<DriverStatistics> => {
        const response = await axiosInstance.get('/admin/drivers/statistics');
        return response.data;
    },

    // Get route statistics
    getRouteStatistics: async (): Promise<RouteStatistics> => {
        const response = await axiosInstance.get('/admin/routes/statistics');
        return response.data;
    },

    // Get schedule statistics
    getScheduleStatistics: async (): Promise<ScheduleStatistics> => {
        const response = await axiosInstance.get('/admin/schedules/statistics');
        return response.data;
    },

    // Get ticket statistics
    getTicketStatistics: async (): Promise<TicketStatistics> => {
        const response = await axiosInstance.get('/admin/tickets/statistics');
        return response.data;
    },

    // Generate bus report
    generateBusReport: async (): Promise<GeneratedReport> => {
        const data = await reportService.getBusStatistics();

        return {
            type: 'bus',
            title: 'Bus Fleet Report',
            dateRange: 'Current Status',
            generatedAt: new Date().toLocaleString(),
            data,
            charts: [
                {
                    type: 'pie',
                    labels: ['Available', 'On Route', 'Maintenance', 'Out of Service'],
                    datasets: [{
                        label: 'Bus Status',
                        data: [
                            data.availableBuses,
                            data.onRouteBuses,
                            data.maintenanceBuses,
                            data.outOfServiceBuses
                        ],
                        backgroundColor: [
                            '#10B981', // Green
                            '#3B82F6', // Blue
                            '#F59E0B', // Yellow
                            '#EF4444'  // Red
                        ]
                    }]
                },
                {
                    type: 'bar',
                    labels: ['Total', 'Active', 'Assigned', 'Unassigned'],
                    datasets: [{
                        label: 'Bus Distribution',
                        data: [
                            data.totalBuses,
                            data.activeBuses,
                            data.assignedBuses,
                            data.unassignedBuses
                        ],
                        backgroundColor: '#E7A533'
                    }]
                }
            ]
        };
    },

    // Generate driver report
    generateDriverReport: async (): Promise<GeneratedReport> => {
        const data = await reportService.getDriverStatistics();

        return {
            type: 'driver',
            title: 'Driver Performance Report',
            dateRange: 'Current Status',
            generatedAt: new Date().toLocaleString(),
            data,
            charts: [
                {
                    type: 'doughnut',
                    labels: ['Active', 'On Duty', 'Off Duty', 'On Leave'],
                    datasets: [{
                        label: 'Driver Status',
                        data: [
                            data.activeDrivers,
                            data.onDutyDrivers,
                            data.offDutyDrivers,
                            data.onLeaveDrivers
                        ],
                        backgroundColor: [
                            '#10B981', // Green
                            '#3B82F6', // Blue
                            '#6B7280', // Gray
                            '#8B5CF6'  // Purple
                        ]
                    }]
                },
                {
                    type: 'bar',
                    labels: ['Total', 'Assigned', 'Unassigned'],
                    datasets: [{
                        label: 'Driver Assignment',
                        data: [
                            data.totalDrivers,
                            data.assignedDrivers,
                            data.unassignedDrivers
                        ],
                        backgroundColor: '#0066CC'
                    }]
                }
            ]
        };
    },

    // Generate route report
    generateRouteReport: async (): Promise<GeneratedReport> => {
        const data = await reportService.getRouteStatistics();

        return {
            type: 'route',
            title: 'Route Analytics Report',
            dateRange: 'Current Status',
            generatedAt: new Date().toLocaleString(),
            data,
            charts: [
                {
                    type: 'pie',
                    labels: ['Active', 'Inactive', 'Under Review', 'Seasonal'],
                    datasets: [{
                        label: 'Route Status',
                        data: [
                            data.activeRoutes,
                            data.inactiveRoutes,
                            data.underReviewRoutes,
                            data.seasonalRoutes
                        ],
                        backgroundColor: [
                            '#10B981', // Green
                            '#EF4444', // Red
                            '#F59E0B', // Yellow
                            '#8B5CF6'  // Purple
                        ]
                    }]
                }
            ]
        };
    },

    // Generate schedule report
    generateScheduleReport: async (): Promise<GeneratedReport> => {
        const data = await reportService.getScheduleStatistics();

        return {
            type: 'schedule',
            title: 'Schedule Management Report',
            dateRange: 'Current Status',
            generatedAt: new Date().toLocaleString(),
            data,
            charts: [
                {
                    type: 'doughnut',
                    labels: ['Scheduled', 'Active', 'Completed', 'Cancelled'],
                    datasets: [{
                        label: 'Schedule Status',
                        data: [
                            data.scheduledSchedules,
                            data.activeSchedules,
                            data.completedSchedules,
                            data.cancelledSchedules
                        ],
                        backgroundColor: [
                            '#3B82F6', // Blue
                            '#10B981', // Green
                            '#6B7280', // Gray
                            '#EF4444'  // Red
                        ]
                    }]
                }
            ]
        };
    },

    // Generate ticket report
    generateTicketReport: async (): Promise<GeneratedReport> => {
        const data = await reportService.getTicketStatistics();

        return {
            type: 'ticket',
            title: 'Ticket & Revenue Report',
            dateRange: 'Current Status',
            generatedAt: new Date().toLocaleString(),
            data,
            charts: [
                {
                    type: 'pie',
                    labels: ['Booked', 'Checked In', 'Completed', 'Cancelled', 'Pending', 'Refunded'],
                    datasets: [{
                        label: 'Ticket Status',
                        data: [
                            data.bookedTickets,
                            data.checkedInTickets,
                            data.completedTickets,
                            data.cancelledTickets,
                            data.pendingTickets,
                            data.refundedTickets
                        ],
                        backgroundColor: [
                            '#3B82F6', // Blue
                            '#8B5CF6', // Purple
                            '#10B981', // Green
                            '#EF4444', // Red
                            '#F59E0B', // Yellow
                            '#6B7280'  // Gray
                        ]
                    }]
                },
                {
                    type: 'bar',
                    labels: ['Total Revenue', 'Today Revenue', 'Average Price'],
                    datasets: [{
                        label: 'Revenue (₦)',
                        data: [
                            data.totalRevenue,
                            data.todayRevenue,
                            data.averageTicketPrice
                        ],
                        backgroundColor: '#E7A533'
                    }]
                }
            ]
        };
    },

    // Generate comprehensive report
    generateComprehensiveReport: async (): Promise<GeneratedReport> => {
        const dashboardData = await reportService.getDashboardStatistics();

        const summary = {
            totalRevenue: dashboardData.tickets.totalRevenue,
            activeTrips: dashboardData.schedules.activeSchedules,
            totalUsers: dashboardData.drivers.totalDrivers, // Assuming drivers as users for now
            utilizationRate: dashboardData.schedules.seatUtilization * 100
        };

        return {
            type: 'comprehensive',
            title: 'Comprehensive System Report',
            dateRange: 'Current Status',
            generatedAt: new Date().toLocaleString(),
            data: {
                ...dashboardData,
                summary
            },
            charts: [
                {
                    type: 'bar',
                    labels: ['Buses', 'Drivers', 'Routes', 'Schedules', 'Tickets'],
                    datasets: [{
                        label: 'System Overview',
                        data: [
                            dashboardData.buses.totalBuses,
                            dashboardData.drivers.totalDrivers,
                            dashboardData.routes.totalRoutes,
                            dashboardData.schedules.totalSchedules,
                            dashboardData.tickets.totalTickets
                        ],
                        backgroundColor: [
                            '#E7A533',
                            '#0066CC',
                            '#10B981',
                            '#8B5CF6',
                            '#EF4444'
                        ]
                    }]
                }
            ]
        };
    },

    // Format currency
    formatCurrency: (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    // Format percentage
    formatPercentage: (value: number): string => {
        return `${value.toFixed(1)}%`;
    },

    // Get report type icon
    getReportIcon: (type: string): string => {
        switch (type) {
            case 'bus': return '🚌';
            case 'driver': return '👨‍✈️';
            case 'route': return '🗺️';
            case 'schedule': return '📅';
            case 'ticket': return '🎫';
            case 'comprehensive': return '📊';
            default: return '📄';
        }
    },

    // Get report color
    getReportColor: (type: string): string => {
        switch (type) {
            case 'bus': return 'bg-orange-100 text-orange-800';
            case 'driver': return 'bg-blue-100 text-blue-800';
            case 'route': return 'bg-green-100 text-green-800';
            case 'schedule': return 'bg-purple-100 text-purple-800';
            case 'ticket': return 'bg-red-100 text-red-800';
            case 'comprehensive': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
};