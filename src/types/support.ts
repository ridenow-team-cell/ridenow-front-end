export interface SupportTicket {
    id: string;
    ticketNumber: string;
    title: string;
    description: string;
    category: 'Service Issues' | 'Payment' | 'Technical' | 'Account' | 'Other';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    createdByUserId: string;
    assignedToUserId?: string;
    relatedTripId?: string;
    relatedBusId?: string;
    relatedDriverId?: string;
    attachments?: string[];
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    closedAt?: string;
}

export interface SupportTicketDetails extends SupportTicket {
    createdByUser?: {
        id: string;
        name: string;
        email: string;
        phoneNumber?: string;
    };
    assignedToUser?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    relatedTrip?: {
        id: string;
        routeName: string;
        date: string;
    };
    relatedBus?: {
        id: string;
        name: string;
        registrationName: string;
    };
    relatedDriver?: {
        id: string;
        name: string;
        licenseNumber: string;
    };
    comments: Array<{
        id: string;
        userId: string;
        userName: string;
        comment: string;
        isInternal: boolean;
        createdAt: string;
    }>;
    activityLog: Array<{
        id: string;
        action: string;
        performedBy: string;
        timestamp: string;
        details?: string;
    }>;
}

export interface SupportTicketQueryParams {
    status?: string;
    priority?: string;
    category?: string;
    assignedToUserId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    search?: string;
}

export interface CreateSupportTicketRequest {
    title: string;
    description: string;
    category: string;
    priority: string;
    status?: string;
    createdByUserId: string;
    assignedToUserId?: string;
    relatedTripId?: string;
    relatedBusId?: string;
    relatedDriverId?: string;
    attachments?: string[];
}

export interface UpdateTicketStatusRequest {
    status: string;
}

export interface AddCommentRequest {
    comment: string;
    isInternal?: boolean;
}

export interface AssignTicketRequest {
    assignedToUserId: string;
}

export interface SupportStatistics {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    ticketsByCategory: Record<string, number>;
    ticketsByPriority: Record<string, number>;
    averageResolutionTime: string;
}