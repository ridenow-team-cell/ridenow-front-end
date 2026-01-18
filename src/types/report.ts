export interface BusStatistics {
    totalBuses: number;
    activeBuses: number;
    availableBuses: number;
    onRouteBuses: number;
    maintenanceBuses: number;
    outOfServiceBuses: number;
    assignedBuses: number;
    unassignedBuses: number;
    averageSeats: number;
}

export interface DriverStatistics {
    totalDrivers: number;
    activeDrivers: number;
    onDutyDrivers: number;
    offDutyDrivers: number;
    onLeaveDrivers: number;
    assignedDrivers: number;
    unassignedDrivers: number;
}

export interface RouteStatistics {
    totalRoutes: number;
    activeRoutes: number;
    inactiveRoutes: number;
    underReviewRoutes: number;
    seasonalRoutes: number;
    averageStops: number;
    totalStops: number;
    totalSchedules: number;
    completedSchedules: number;
    upcomingSchedules: number;
    activeSchedules: number;
    averageRating: number;
    totalReviews: number;
    totalStopsOnRoute: number;
    pickupStops: number;
    dropoffStops: number;
}

export interface ScheduleStatistics {
    totalSchedules: number;
    scheduledSchedules: number;
    activeSchedules: number;
    inProgressSchedules: number;
    completedSchedules: number;
    cancelledSchedules: number;
    todaysSchedules: number;
    averageSeats: number;
    totalSeats: number;
    bookedSeats: number;
    availableSeats: number;
    seatUtilization: number;
    totalStops: number;
}

export interface TicketStatistics {
    totalTickets: number;
    bookedTickets: number;
    checkedInTickets: number;
    completedTickets: number;
    cancelledTickets: number;
    paidTickets: number;
    pendingTickets: number;
    refundedTickets: number;
    totalRevenue: number;
    averageTicketPrice: number;
    todayTickets: number;
    todayRevenue: number;
}

export interface DashboardStatistics {
    buses: BusStatistics;
    drivers: DriverStatistics;
    routes: RouteStatistics;
    schedules: ScheduleStatistics;
    tickets: TicketStatistics;
    summary?: {
        totalRevenue: number;
        activeTrips: number;
        totalUsers: number;
        utilizationRate: number;
    };
}

export interface ReportQueryParams {
    startDate?: string;
    endDate?: string;
    reportType?: 'daily' | 'weekly' | 'monthly' | 'custom';
}

export interface GeneratedReport {
    type: string;
    title: string;
    dateRange: string;
    generatedAt: string;
    data: any;
    charts?: ChartData[];
}

export interface ChartData {
    type: 'bar' | 'line' | 'pie' | 'doughnut';
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string[];
        borderColor?: string[];
    }[];
}