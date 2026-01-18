import { useQuery, useMutation } from '@tanstack/react-query';
import { reportService } from '@/services/report-service';
import { GeneratedReport } from '@/types/report';
import { toast } from 'react-hot-toast';

export const reportKeys = {
    all: ['reports'] as const,
    statistics: () => [...reportKeys.all, 'statistics'] as const,
    dashboard: () => [...reportKeys.all, 'dashboard'] as const,
    bus: () => [...reportKeys.all, 'bus'] as const,
    driver: () => [...reportKeys.all, 'driver'] as const,
    route: () => [...reportKeys.all, 'route'] as const,
    schedule: () => [...reportKeys.all, 'schedule'] as const,
    ticket: () => [...reportKeys.all, 'ticket'] as const,
};

export const useDashboardStatistics = () => {
    return useQuery({
        queryKey: reportKeys.dashboard(),
        queryFn: () => reportService.getDashboardStatistics(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
    });
};

export const useBusStatistics = () => {
    return useQuery({
        queryKey: reportKeys.bus(),
        queryFn: () => reportService.getBusStatistics(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useDriverStatistics = () => {
    return useQuery({
        queryKey: reportKeys.driver(),
        queryFn: () => reportService.getDriverStatistics(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useRouteStatistics = () => {
    return useQuery({
        queryKey: reportKeys.route(),
        queryFn: () => reportService.getRouteStatistics(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useScheduleStatistics = () => {
    return useQuery({
        queryKey: reportKeys.schedule(),
        queryFn: () => reportService.getScheduleStatistics(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useTicketStatistics = () => {
    return useQuery({
        queryKey: reportKeys.ticket(),
        queryFn: () => reportService.getTicketStatistics(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
    });
};

export const useGenerateBusReport = () => {
    return useMutation({
        mutationFn: () => reportService.generateBusReport(),
        onSuccess: () => {
            toast.success('Bus report generated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to generate bus report');
        },
    });
};

export const useGenerateDriverReport = () => {
    return useMutation({
        mutationFn: () => reportService.generateDriverReport(),
        onSuccess: () => {
            toast.success('Driver report generated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to generate driver report');
        },
    });
};

export const useGenerateRouteReport = () => {
    return useMutation({
        mutationFn: () => reportService.generateRouteReport(),
        onSuccess: () => {
            toast.success('Route report generated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to generate route report');
        },
    });
};

export const useGenerateScheduleReport = () => {
    return useMutation({
        mutationFn: () => reportService.generateScheduleReport(),
        onSuccess: () => {
            toast.success('Schedule report generated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to generate schedule report');
        },
    });
};

export const useGenerateTicketReport = () => {
    return useMutation({
        mutationFn: () => reportService.generateTicketReport(),
        onSuccess: () => {
            toast.success('Ticket report generated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to generate ticket report');
        },
    });
};

export const useGenerateComprehensiveReport = () => {
    return useMutation({
        mutationFn: () => reportService.generateComprehensiveReport(),
        onSuccess: () => {
            toast.success('Comprehensive report generated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to generate comprehensive report');
        },
    });
};