import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user-service';
import { UserQueryParams, CreateUserRequest, UpdateUserRequest, ChangeRoleRequest } from '@/types/admin';
import { toast } from 'react-hot-toast';

// Query keys
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (params: UserQueryParams) => [...userKeys.lists(), params] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    byEmail: (email: string) => [...userKeys.all, 'email', email] as const,
    byRole: (role: string) => [...userKeys.all, 'role', role] as const,
    search: (term: string) => [...userKeys.all, 'search', term] as const,
};

// Get users hook
export const useUsers = (params?: UserQueryParams) => {
    return useQuery({
        queryKey: userKeys.list(params || {}),
        queryFn: () => userService.getUsers(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
    });
};

// Get user by ID hook
export const useUser = (id: string) => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => userService.getUserById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Create user hook
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: CreateUserRequest) => userService.createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            toast.success('User created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create user');
        },
    });
};

// Update user hook
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
            userService.updateUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
            toast.success('User updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update user');
        },
    });
};

// Delete user hook
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            toast.success('User deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        },
    });
};

// Activate/deactivate user hook
export const useToggleUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, action }: { id: string; action: 'activate' | 'deactivate' }) =>
            action === 'activate'
                ? userService.activateUser(id)
                : userService.deactivateUser(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
            toast.success(`User ${variables.action}d successfully`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to update user status`);
        },
    });
};

// Change user role hook
export const useChangeUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, newRole }: { id: string; newRole: string }) =>
            userService.changeUserRole(id, { newRole }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
            toast.success('User role changed successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to change user role');
        },
    });
};

// Check user exists hook
export const useCheckUserExists = () => {
    return useMutation({
        mutationFn: ({ email, phone }: { email?: string; phone?: string }) =>
            userService.checkUserExists(email, phone),
    });
};

// Search users hook
export const useSearchUsers = (term: string) => {
    return useQuery({
        queryKey: userKeys.search(term),
        queryFn: () => userService.searchUsers(term),
        enabled: !!term && term.length >= 2,
        staleTime: 2 * 60 * 1000,
    });
};