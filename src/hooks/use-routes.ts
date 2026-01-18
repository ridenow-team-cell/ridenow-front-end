import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routeService } from '@/services/route-service';
import { RouteQueryParams, CreateRouteRequest, UpdateRouteRequest } from '@/types/route';
import { toast } from 'react-hot-toast';

export const routeKeys = {
    all: ['routes'] as const,
    lists: () => [...routeKeys.all, 'list'] as const,
    list: (params: RouteQueryParams) => [...routeKeys.lists(), params] as const,
    details: () => [...routeKeys.all, 'detail'] as const,
    detail: (id: string) => [...routeKeys.details(), id] as const,
    searchLocations: (query: string) => [...routeKeys.all, 'search', query] as const,
};

export const useRoutes = (params?: RouteQueryParams) => {
    return useQuery({
        queryKey: routeKeys.list(params || {}),
        queryFn: () => routeService.getRoutes(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useRoute = (id: string) => {
    return useQuery({
        queryKey: routeKeys.detail(id),
        queryFn: () => routeService.getRouteById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useRouteDetails = (id: string) => {
    return useQuery({
        queryKey: [...routeKeys.detail(id), 'details'],
        queryFn: () => routeService.getRouteDetails(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateRoute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (routeData: CreateRouteRequest) => routeService.createRoute(routeData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
            toast.success('Route created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create route');
        },
    });
};

export const useUpdateRoute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRouteRequest }) =>
            routeService.updateRoute(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: routeKeys.detail(variables.id) });
            toast.success('Route updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update route');
        },
    });
};

export const useDeleteRoute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => routeService.deleteRoute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
            toast.success('Route deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete route');
        },
    });
};

export const useToggleRouteStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, action }: { id: string; action: 'activate' | 'deactivate' }) =>
            action === 'activate'
                ? routeService.activateRoute(id)
                : routeService.deactivateRoute(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
            queryClient.invalidateQueries({ queryKey: routeKeys.detail(variables.id) });
            toast.success(`Route ${variables.action}d successfully`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to update route status`);
        },
    });
};

// Add the missing useSearchLocations hook
export const useSearchLocations = (query: string) => {
    return useQuery({
        queryKey: routeKeys.searchLocations(query),
        queryFn: () => routeService.searchLocations(query),
        enabled: !!query && query.length >= 3,
        staleTime: 5 * 60 * 1000,
        retry: false, // Don't retry on failed Google API calls
    });
};