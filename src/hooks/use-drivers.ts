import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '@/services/driver-service';
import { DriverQueryParams, CreateDriverRequest, UpdateDriverRequest, AssignBusRequest, AssignRouteRequest, ChangeStatusRequest } from '@/types/driver';
import { toast } from 'react-hot-toast';

export const driverKeys = {
    all: ['drivers'] as const,
    lists: () => [...driverKeys.all, 'list'] as const,
    list: (params: DriverQueryParams) => [...driverKeys.lists(), params] as const,
    details: () => [...driverKeys.all, 'detail'] as const,
    detail: (id: string) => [...driverKeys.details(), id] as const,
    byLicense: (license: string) => [...driverKeys.all, 'license', license] as const,
    byPhone: (phone: string) => [...driverKeys.all, 'phone', phone] as const,
    byStatus: (status: string) => [...driverKeys.all, 'status', status] as const,
    available: () => [...driverKeys.all, 'available'] as const,
    statistics: () => [...driverKeys.all, 'statistics'] as const,
    search: (term: string) => [...driverKeys.all, 'search', term] as const,
    count: (params?: { status?: string }) => [...driverKeys.all, 'count', params] as const,
};

export const useDrivers = (params?: DriverQueryParams) => {
    return useQuery({
        queryKey: driverKeys.list(params || {}),
        queryFn: () => driverService.getDrivers(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useDriversPaged = (params?: DriverQueryParams) => {
    return useQuery({
        queryKey: [...driverKeys.list(params || {}), 'paged'],
        queryFn: () => driverService.getDriversPaged(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useDriver = (id: string) => {
    return useQuery({
        queryKey: driverKeys.detail(id),
        queryFn: () => driverService.getDriverById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDriverDetails = (id: string) => {
    return useQuery({
        queryKey: [...driverKeys.detail(id), 'details'],
        queryFn: () => driverService.getDriverDetails(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (driverData: CreateDriverRequest) => driverService.createDriver(driverData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
            toast.success('Driver created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create driver');
        },
    });
};

export const useUpdateDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDriverRequest }) =>
            driverService.updateDriver(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
            queryClient.invalidateQueries({ queryKey: driverKeys.detail(variables.id) });
            toast.success('Driver updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update driver');
        },
    });
};

export const useDeleteDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => driverService.deleteDriver(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
            toast.success('Driver updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete driver');
        },
    });
};

export const useToggleDriverStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, action }: { id: string; action: 'activate' | 'deactivate' }) =>
            action === 'activate'
                ? driverService.activateDriver(id)
                : driverService.deactivateDriver(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
            queryClient.invalidateQueries({ queryKey: driverKeys.detail(variables.id) });
            toast.success(`Driver ${variables.action}d successfully`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to update driver status`);
        },
    });
};

export const useAssignBusToDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, busId }: { id: string; busId: string }) =>
            driverService.assignBus(id, { busId }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
            queryClient.invalidateQueries({ queryKey: driverKeys.detail(variables.id) });
            toast.success('Bus assigned to driver successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to assign bus to driver');
        },
    });
};

export const useUnassignBusFromDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => driverService.unassignBus(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
            queryClient.invalidateQueries({ queryKey: driverKeys.detail(variables) });
            toast.success('Bus unassigned from driver successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to unassign bus from driver');
        },
    });
};

// In use-drivers.ts
export const useAssignRouteToDriver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, routeId }: { id: string; routeId: string }) =>
            driverService.assignRoute(id, { routeId }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
            queryClient.invalidateQueries({ queryKey: driverKeys.detail(variables.id) });
            toast.success('Route assigned to driver successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to assign route to driver');
        },
    });
};



export const useChangeDriverStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            driverService.changeDriverStatus(id, { status }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: driverKeys.lists() });
            queryClient.invalidateQueries({ queryKey: driverKeys.detail(variables.id) });
            toast.success('Driver status changed successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to change driver status');
        },
    });
};

export const useDriverStatistics = () => {
    return useQuery({
        queryKey: driverKeys.statistics(),
        queryFn: () => driverService.getDriverStatistics(),
        staleTime: 2 * 60 * 1000,
    });
};

export const useAvailableDrivers = () => {
    return useQuery({
        queryKey: driverKeys.available(),
        queryFn: () => driverService.getAvailableDrivers(),
        staleTime: 2 * 60 * 1000,
    });
};

export const useCheckDriverExists = () => {
    return useMutation({
        mutationFn: ({ licenseNumber, phone }: { licenseNumber?: string; phone?: string }) =>
            driverService.checkDriverExists(licenseNumber, phone),
    });
};

export const useSearchDrivers = (term: string) => {
    return useQuery({
        queryKey: driverKeys.search(term),
        queryFn: () => driverService.searchDrivers(term),
        enabled: !!term && term.length >= 2,
        staleTime: 2 * 60 * 1000,
    });
};