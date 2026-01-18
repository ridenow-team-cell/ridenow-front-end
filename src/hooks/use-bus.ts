import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { busService } from '@/services/bus-service';
import {
    BusQueryParams,
    CreateBusRequest,
    UpdateBusRequest,
    AssignDriverRequest,
    AssignRouteRequest,
    ChangeStatusRequest
} from '@/types/bus';
import { toast } from 'react-hot-toast';

// Query keys
export const busKeys = {
    all: ['buses'] as const,
    lists: () => [...busKeys.all, 'list'] as const,
    list: (params: BusQueryParams) => [...busKeys.lists(), params] as const,
    details: () => [...busKeys.all, 'detail'] as const,
    detail: (id: string) => [...busKeys.details(), id] as const,
    byRegistration: (registration: string) => [...busKeys.all, 'registration', registration] as const,
    byStatus: (status: string) => [...busKeys.all, 'status', status] as const,
    available: () => [...busKeys.all, 'available'] as const,
    search: (term: string) => [...busKeys.all, 'search', term] as const,
};

// Get buses hook
export const useBuses = (params?: BusQueryParams) => {
    return useQuery({
        queryKey: busKeys.list(params || {}),
        queryFn: () => busService.getBuses(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

// Get bus by ID hook
export const useBus = (id: string) => {
    return useQuery({
        queryKey: busKeys.detail(id),
        queryFn: () => busService.getBusById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

// Get bus details hook
export const useBusDetails = (id: string) => {
    return useQuery({
        queryKey: [...busKeys.detail(id), 'details'],
        queryFn: () => busService.getBusDetails(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

// Create bus hook
export const useCreateBus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (busData: CreateBusRequest) => busService.createBus(busData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: busKeys.lists() });
            toast.success('Bus created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create bus');
        },
    });
};

// Update bus hook
export const useUpdateBus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBusRequest }) =>
            busService.updateBus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: busKeys.lists() });
            queryClient.invalidateQueries({ queryKey: busKeys.detail(variables.id) });
            toast.success('Bus updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update bus');
        },
    });
};

// Delete bus hook
export const useDeleteBus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => busService.deleteBus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: busKeys.lists() });
            toast.success('Bus deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete bus');
        },
    });
};

// Toggle bus status hook
export const useToggleBusStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, action }: { id: string; action: 'activate' | 'deactivate' }) =>
            action === 'activate'
                ? busService.activateBus(id)
                : busService.deactivateBus(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: busKeys.lists() });
            queryClient.invalidateQueries({ queryKey: busKeys.detail(variables.id) });
            toast.success(`Bus ${variables.action}d successfully`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to update bus status`);
        },
    });
};

// Assign driver hook
export const useAssignDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, driverId }: { id: string; driverId: string }) =>
            busService.assignDriver(id, { driverId }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: busKeys.lists() });
            queryClient.invalidateQueries({ queryKey: busKeys.detail(variables.id) });
            toast.success('Driver assigned successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to assign driver');
        },
    });
};

// Change bus status hook
export const useChangeBusStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            busService.changeStatus(id, { status }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: busKeys.lists() });
            queryClient.invalidateQueries({ queryKey: busKeys.detail(variables.id) });
            toast.success('Bus status changed successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to change bus status');
        },
    });
};

// Check bus exists hook
export const useCheckBusExists = () => {
    return useMutation({
        mutationFn: (registration: string) =>
            busService.checkBusExists(registration),
    });
};