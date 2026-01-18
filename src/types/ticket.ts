export interface Ticket {
    id: string;
    ticketNumber: string;
    userId: string;
    scheduleId: string;
    seatNumber: string;
    pickupStopId: string;
    dropoffStopId: string;
    price: number;
    status: 'Booked' | 'CheckedIn' | 'Completed' | 'Cancelled' | 'NoShow';
    paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
    bookingDate: string;
    checkInTime?: string;
    completedTime?: string;
    cancelledTime?: string;
    qrCodeUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TicketDetails extends Ticket {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNo: string;
    };
    schedule: {
        id: string;
        departureTime: string;
        arrivalTime: string;
        daysOfWeek: string[];
    };
    bus: {
        id: string;
        name: string;
        registrationName: string;
        totalSeats: number;
    };
    route: {
        id: string;
        name: string;
        description: string;
        distance: number;
        estimatedDuration: string;
    };
    pickupStop: {
        name: string;
        address: string;
        order: number;
    };
    dropoffStop: {
        name: string;
        address: string;
        order: number;
    };
    qrCodeData?: string;
}

export interface TicketQueryParams {
    page?: number;
    pageSize?: number;
    status?: string;
    paymentStatus?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    search?: string;
    userId?: string;
    scheduleId?: string;
    busId?: string;
    routeId?: string;
}

export interface CreateTicketRequest {
    userId: string;
    scheduleId: string;
    seatNumber: string;
    pickupStopId: string;
    dropoffStopId: string;
    price: number;
    paymentStatus?: string;
}

export interface UpdateTicketRequest {
    seatNumber?: string;
    pickupStopId?: string;
    dropoffStopId?: string;
    status?: string;
    paymentStatus?: string;
    price?: number;
}

export interface TicketStatistics {
    totalTickets: number;
    totalRevenue: number;
    bookedTickets: number;
    checkedInTickets: number;
    completedTickets: number;
    cancelledTickets: number;
    paidTickets: number;
    pendingTickets: number;
    refundedTickets: number;
    todayTickets: number;
    upcomingTickets: number;
    averageTicketPrice: number;
    revenueByStatus: Record<string, number>;
    ticketsByDate: Array<{ date: string; count: number; revenue: number }>;
}

export interface RevenueReport {
    totalRevenue: number;
    dailyRevenue: Array<{ date: string; revenue: number; tickets: number }>;
    routeRevenue: Array<{ routeId: string; routeName: string; revenue: number; tickets: number }>;
    busRevenue: Array<{ busId: string; busName: string; revenue: number; tickets: number }>;
    paymentMethodBreakdown: Record<string, number>;
    refunds: number;
    netRevenue: number;
}