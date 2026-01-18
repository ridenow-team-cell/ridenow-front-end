import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '@/services/schedule-service';
import { ScheduleQueryParams, CreateScheduleRequest, UpdateScheduleRequest } from '@/types/schedule';
import { toast } from 'react-hot-toast';

export const scheduleKeys = {
    all: ['schedules'] as const,
    lists: () => [...scheduleKeys.all, 'list'] as const,
    list: (params: ScheduleQueryParams) => [...scheduleKeys.lists(), params] as const,
    details: () => [...scheduleKeys.all, 'detail'] as const,
    detail: (id: string) => [...scheduleKeys.details(), id] as const,
};

export const useSchedules = (params?: ScheduleQueryParams) => {
    return useQuery({
        queryKey: scheduleKeys.list(params || {}),
        queryFn: () => scheduleService.getSchedules(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useSchedule = (id: string) => {
    return useQuery({
        queryKey: scheduleKeys.detail(id),
        queryFn: () => scheduleService.getScheduleById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useScheduleDetails = (id: string) => {
    return useQuery({
        queryKey: [...scheduleKeys.detail(id), 'details'],
        queryFn: () => scheduleService.getScheduleDetails(id),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useCreateSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (scheduleData: CreateScheduleRequest) => scheduleService.createSchedule(scheduleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
            toast.success('Schedule created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create schedule');
        },
    });
};

export const useUpdateSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateScheduleRequest }) =>
            scheduleService.updateSchedule(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(variables.id) });
            toast.success('Schedule updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update schedule');
        },
    });
};

export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => scheduleService.deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
            toast.success('Schedule deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete schedule');
        },
    });
};

export const useCancelSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => scheduleService.cancelSchedule(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(variables) });
            toast.success('Schedule cancelled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel schedule');
        },
    });
};

export const useToggleScheduleStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, action }: { id: string; action: 'activate' | 'deactivate' }) =>
            action === 'activate'
                ? scheduleService.activateSchedule(id)
                : scheduleService.deactivateSchedule(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(variables.id) });
            toast.success(`Schedule ${variables.action}d successfully`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || `Failed to update schedule status`);
        },
    });
};