import { axiosInstance } from '@/utils/axios';
import {
    Schedule,
    ScheduleDetails,
    ScheduleQueryParams,
    CreateScheduleRequest,
    UpdateScheduleRequest
} from '@/types/schedule';

export const scheduleService = {
    // Get all schedules
    getSchedules: async (params?: ScheduleQueryParams): Promise<Schedule[]> => {
        const response = await axiosInstance.get('/admin/schedules', { params });
        return response.data;
    },

    // Get schedule by ID
    getScheduleById: async (id: string): Promise<Schedule> => {
        const response = await axiosInstance.get(`/admin/schedules/${id}`);
        return response.data;
    },

    // Get schedule details
    getScheduleDetails: async (id: string): Promise<ScheduleDetails> => {
        const response = await axiosInstance.get(`/admin/schedules/${id}/details`);
        return response.data;
    },

    // Create schedule
    createSchedule: async (scheduleData: CreateScheduleRequest): Promise<Schedule> => {
        const response = await axiosInstance.post('/admin/schedules', scheduleData);
        return response.data;
    },

    // Update schedule
    updateSchedule: async (id: string, scheduleData: UpdateScheduleRequest): Promise<Schedule> => {
        const response = await axiosInstance.put(`/admin/schedules/${id}`, scheduleData);
        return response.data;
    },

    // Delete schedule
    deleteSchedule: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.delete(`/admin/schedules/${id}`);
        return response.data;
    },

    // Cancel schedule
    cancelSchedule: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/schedules/${id}/cancel`);
        return response.data;
    },

    // Activate schedule
    activateSchedule: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/schedules/${id}/activate`);
        return response.data;
    },

    // Deactivate schedule
    deactivateSchedule: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.post(`/admin/schedules/${id}/deactivate`);
        return response.data;
    },

    // Generate seat layout
    generateSeatLayout: (totalSeats: number): string[] => {
        const seats: string[] = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        let seatCount = 0;
        for (const row of rows) {
            for (const col of columns) {
                if (seatCount >= totalSeats) break;
                seats.push(`${row}${col}`);
                seatCount++;
            }
            if (seatCount >= totalSeats) break;
        }

        return seats;
    },

    // Format time
    formatTime: (timeString: string): string => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    },

    // Format days of week
    formatDays: (days: string[]): string => {
        const dayMap: Record<string, string> = {
            'Monday': 'Mon',
            'Tuesday': 'Tue',
            'Wednesday': 'Wed',
            'Thursday': 'Thu',
            'Friday': 'Fri',
            'Saturday': 'Sat',
            'Sunday': 'Sun'
        };
        return days.map(day => dayMap[day] || day).join(', ');
    },

    // Get status color
    getStatusColor: (status: string): string => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-100 text-blue-800';
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Completed': return 'bg-gray-100 text-gray-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    },

    // Calculate seat availability
    calculateSeatAvailability: (seats: any[]): { available: number; booked: number; total: number } => {
        const total = seats.length;
        const booked = seats.filter(seat => seat.isBooked).length;
        return {
            available: total - booked,
            booked,
            total
        };
    },

    // Format date
    formatDate: (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
};