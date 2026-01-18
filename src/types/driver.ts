export interface Driver {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    photoUrl?: string;
    licenseNumber: string;
    busId?: string;
    routeId?: string;
    status: 'Active' | 'Inactive' | 'OnDuty' | 'OffDuty' | 'OnBreak' | 'OnLeave';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DriverDetails extends Driver {
    bus?: {
        id: string;
        name: string;
        registrationName: string;
    };
    route?: {
        id: string;
        name: string;
        description: string;
    };
    performance?: {
        totalTrips: number;
        completedTrips: number;
        rating: number;
        averageSpeed: number;
        safetyScore: number;
    };
}

export interface DriverQueryParams {
    status?: string;
    isActive?: boolean;
    hasBus?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    search?: string;
}

export interface CreateDriverRequest {
    fullName: string;
    phoneNumber: string;
    email: string;
    photoUrl?: string;
    licenseNumber: string;
    busId?: string;
    routeId?: string;
    status?: string;
    isActive?: boolean;
    password: string;
}

export interface UpdateDriverRequest {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    photoUrl?: string;
    licenseNumber?: string;
    status?: string;
    isActive?: boolean;
}

export interface AssignBusRequest {
    busId: string;
}

export interface AssignRouteRequest {
    routeId: string;
}

export interface ChangeStatusRequest {
    status: string;
}

export interface DriverStatistics {
    totalDrivers: number;
    activeDrivers: number;
    onDutyDrivers: number;
    availableDrivers: number;
    driversByStatus: Record<string, number>;
}