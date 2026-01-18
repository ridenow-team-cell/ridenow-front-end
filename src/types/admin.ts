export type UserRole = 'Student' | 'Driver' | 'Admin';

export interface User {
    id: string;
    name: string;
    email: string;
    schoolId: string | null;
    role: UserRole;
    phoneNo: string;
    dateCreated: string;
    updatedAt: string;
    isActive: boolean;
    status: 'Active' | 'Inactive';
}

export interface UserQueryParams {
    role?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    search?: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    schoolId?: string;
    role: UserRole;
    phoneNo: string;
    password: string;
    isActive?: boolean;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    phoneNo?: string;
    isActive?: boolean;
    schoolId?: string;
}

export interface ChangeRoleRequest {
    newRole: string;
}


// Add PaginationResponse if API supports pagination
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}