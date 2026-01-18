import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { busTrackingService } from '@/services/bus-tracking-service';
import { BusTrackingQueryParams, UpdateTrackingStatusRequest, UpdateLocationRequest, CreateTrackingRequest } from '@/types/bus-tracking';
import { toast } from 'react-hot-toast';

export const busTrackingKeys = {
    all: ['bus-tracking'] as const,
    lists: () => [...busTrackingKeys.all, 'list'] as const,
    list: (params: BusTrackingQueryParams) => [...busTrackingKeys.lists(), params] as const,
    details: () => [...busTrackingKeys.all, 'detail'] as const,
    detail: (id: string) => [...busTrackingKeys.details(), id] as const,
    byBus: (busId: string) => [...busTrackingKeys.all, 'bus', busId] as const,
    latestByBus: (busId: string) => [...busTrackingKeys.byBus(busId), 'latest'] as const,
    historyByBus: (busId: string, params?: any) => [...busTrackingKeys.byBus(busId), 'history', params] as const,
    active: () => [...busTrackingKeys.all, 'active'] as const,
    liveStatus: () => [...busTrackingKeys.all, 'live-status'] as const,
    byRoute: (routeId: string, params?: any) => [...busTrackingKeys.all, 'route', routeId, params] as const,
    byDriver: (driverId: string, params?: any) => [...busTrackingKeys.all, 'driver', driverId, params] as const,
    statistics: () => [...busTrackingKeys.all, 'statistics'] as const,
};

export const useTrackingRecords = (params?: BusTrackingQueryParams) => {
    return useQuery({
        queryKey: busTrackingKeys.list(params || {}),
        queryFn: () => busTrackingService.getTrackingRecords(params),
        staleTime: 30 * 1000, // 30 seconds for live data
        gcTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
    });
};

export const useLiveBusStatus = () => {
    return useQuery({
        queryKey: busTrackingKeys.liveStatus(),
        queryFn: () => busTrackingService.getLiveBusStatus(),
        staleTime: 15 * 1000, // 15 seconds for live data
        gcTime: 1 * 60 * 1000, // 1 minute
        refetchInterval: 15 * 1000, // Auto-refresh every 15 seconds
    });
};

export const useActiveTracking = () => {
    return useQuery({
        queryKey: busTrackingKeys.active(),
        queryFn: () => busTrackingService.getActiveTracking(),
        staleTime: 15 * 1000,
        gcTime: 1 * 60 * 1000,
        refetchInterval: 15 * 1000,
    });
};

export const useTrackingStatistics = () => {
    return useQuery({
        queryKey: busTrackingKeys.statistics(),
        queryFn: () => busTrackingService.getTrackingStatistics(),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useLatestTrackingByBus = (busId: string) => {
    return useQuery({
        queryKey: busTrackingKeys.latestByBus(busId),
        queryFn: () => busTrackingService.getLatestTrackingByBus(busId),
        enabled: !!busId,
        staleTime: 15 * 1000,
        refetchInterval: 15 * 1000,
    });
};

export const useBusTrackingHistory = (busId: string, params?: any) => {
    return useQuery({
        queryKey: busTrackingKeys.historyByBus(busId, params),
        queryFn: () => busTrackingService.getBusTrackingHistory(busId, params),
        enabled: !!busId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateBusLocation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ busId, data }: { busId: string; data: UpdateLocationRequest }) =>
            busTrackingService.updateBusLocation(busId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.liveStatus() });
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.active() });
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.latestByBus(variables.busId) });
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.statistics() });
            toast.success('Location updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update location');
        },
    });
};

export const useUpdateTrackingStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            busTrackingService.updateTrackingStatus(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.liveStatus() });
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.active() });
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.statistics() });
            toast.success('Status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });
};

export const useCreateTrackingRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTrackingRequest) => busTrackingService.createTrackingRecord(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.liveStatus() });
            toast.success('Tracking record created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create tracking record');
        },
    });
};

export const useDeleteTrackingRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => busTrackingService.deleteTrackingRecord(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.lists() });
            queryClient.invalidateQueries({ queryKey: busTrackingKeys.liveStatus() });
            toast.success('Tracking record deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete tracking record');
        },
    });
};