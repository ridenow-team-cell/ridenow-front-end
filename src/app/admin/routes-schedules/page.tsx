"use client"
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import Pagination from '@/components/ui/Pagination';
import AddRouteModal from '@/components/ui/modals/AddRouteModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import RouteDetailsModal from '@/components/ui/modals/RouteDetailsModal';
import {
    useRoutes,
    useCreateRoute,
    useUpdateRoute,
    useDeleteRoute,
    useToggleRouteStatus
} from '@/hooks/use-routes';
import {
    useSchedules,
    useCreateSchedule,
    useUpdateSchedule,
    useDeleteSchedule,
    useCancelSchedule
} from '@/hooks/use-schedules';
import { routeService } from '@/services/route-service';
import { scheduleService } from '@/services/schedule-service';
import { Route, RouteQueryParams } from '@/types/route';
import { Schedule, ScheduleQueryParams } from '@/types/schedule';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const RoutesSchedulesPage = () => {
    const [activeTab, setActiveTab] = useState<'routes' | 'schedules'>('routes');
    const router = useRouter();

    // Route states
    const [routeFilters, setRouteFilters] = useState<RouteQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
        status: 'Active'
    });

    // Schedule states
    const [scheduleFilters, setScheduleFilters] = useState<ScheduleQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'departureTime',
        sortOrder: 'asc',
        status: 'Scheduled'
    });

    // Modal states
    const [showAddRouteModal, setShowAddRouteModal] = useState(false);
    const [showEditRouteModal, setShowEditRouteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRouteDetailsModal, setShowRouteDetailsModal] = useState(false);
    const [showScheduleDetailsModal, setShowScheduleDetailsModal] = useState(false);

    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [editingRoute, setEditingRoute] = useState<Route | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [selectedAction, setSelectedAction] = useState<'delete' | 'deactivate' | 'cancel'>('delete');

    // Hooks
    const { data: routesData, isLoading: routesLoading, refetch: refetchRoutes } = useRoutes(routeFilters);
    const { data: schedulesData, isLoading: schedulesLoading, refetch: refetchSchedules } = useSchedules(scheduleFilters);

    const createRoute = useCreateRoute();
    const updateRoute = useUpdateRoute();
    const deleteRoute = useDeleteRoute();
    const toggleRouteStatus = useToggleRouteStatus();

    const createSchedule = useCreateSchedule();
    const updateSchedule = useUpdateSchedule();
    const deleteSchedule = useDeleteSchedule();
    const cancelSchedule = useCancelSchedule();

    // Update filters when tab changes
    useEffect(() => {
        if (activeTab === 'routes') {
            setRouteFilters(prev => ({ ...prev, page: 1 }));
        } else {
            setScheduleFilters(prev => ({ ...prev, page: 1 }));
        }
    }, [activeTab]);

    // Routes table columns
    const routesColumns = [
        { key: 'name', header: 'Route Name' },
        { key: 'description', header: 'Description' },
        {
            key: 'stops',
            header: 'Stops',
            render: (route: Route) => (
                <div className="text-gray-700">{route.stops.length} stops</div>
            )
        },
        {
            key: 'distance',
            header: 'Distance',
            render: (route: Route) => (
                <div className="text-gray-700">{routeService.formatDistance(route.distance)}</div>
            )
        },
        {
            key: 'estimatedDuration',
            header: 'Duration',
            render: (route: Route) => (
                <div className="text-gray-700">{routeService.formatDuration(route.estimatedDuration)}</div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (route: Route) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${routeService.getStatusColor(route.status)}`}>
                    {route.status}
                </span>
            )
        },
        {
            key: 'createdAt',
            header: 'Created',
            render: (route: Route) => routeService.formatDate(route.createdAt)
        },
    ];

    // Schedules table columns
    const schedulesColumns = [
        {
            key: 'departureTime',
            header: 'Departure Time',
            render: (schedule: Schedule) => (
                <div>
                    <div className="font-medium text-gray-800">{scheduleService.formatTime(schedule.departureTime)}</div>
                    <div className="text-sm text-gray-600">{scheduleService.formatDate(schedule.startDate)}</div>
                </div>
            )
        },
        {
            key: 'arrivalTime',
            header: 'Arrival Time',
            render: (schedule: Schedule) => (
                <div className="text-gray-700">{scheduleService.formatTime(schedule.arrivalTime)}</div>
            )
        },
        {
            key: 'daysOfWeek',
            header: 'Days',
            render: (schedule: Schedule) => (
                <div className="text-gray-700">{scheduleService.formatDays(schedule.daysOfWeek)}</div>
            )
        },
        {
            key: 'numberOfAvailableSeats',
            header: 'Available Seats',
            render: (schedule: Schedule) => {
                const seatInfo = scheduleService.calculateSeatAvailability(schedule.seats);
                return (
                    <div>
                        <div className="font-medium text-gray-800">{seatInfo.available}/{seatInfo.total}</div>
                        <div className="text-sm text-gray-600">seats available</div>
                    </div>
                );
            }
        },
        {
            key: 'status',
            header: 'Status',
            render: (schedule: Schedule) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${scheduleService.getStatusColor(schedule.status)}`}>
                    {schedule.status}
                </span>
            )
        },
        {
            key: 'recurring',
            header: 'Type',
            render: (schedule: Schedule) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${schedule.recurring ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {schedule.recurring ? 'Recurring' : 'One-time'}
                </span>
            )
        },
        {
            key: 'createdAt',
            header: 'Created',
            render: (schedule: Schedule) => scheduleService.formatDate(schedule.createdAt)
        },
    ];

    const handleEditSchedule = (schedule: Schedule) => {
        router.push(`/admin/schedules/${schedule.id}/edit`);
    };

    // Actions for Routes tab
    const routeActions = [
        {
            label: 'View Details',
            onClick: (route: Route) => {
                setSelectedRoute(route);
                setShowRouteDetailsModal(true);
            }
        },
        {
            label: 'Edit',
            onClick: (route: Route) => {
                setEditingRoute(route);
                setShowEditRouteModal(true);
            }
        },
        {
            label: 'Deactivate',
            onClick: (route: Route) => {
                setSelectedRoute(route);
                setSelectedAction('deactivate');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        },
        {
            label: 'Delete',
            onClick: (route: Route) => {
                setSelectedRoute(route);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Actions for Schedules tab
    const scheduleActions = [
        {
            label: 'Edit',
            onClick: handleEditSchedule
        },
        {
            label: 'Cancel',
            onClick: (schedule: Schedule) => {
                setSelectedSchedule(schedule);
                setSelectedAction('cancel');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        },
        {
            label: 'Delete',
            onClick: (schedule: Schedule) => {
                setSelectedSchedule(schedule);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Handlers
    const handleAddRoute = (routeData: any) => {
        createRoute.mutate(routeData, {
            onSuccess: () => {
                setShowAddRouteModal(false);
                setShowSuccessModal(true);
                refetchRoutes();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to create route');
            }
        });
    };

    const handleUpdateRoute = (updateData: any) => {
        if (!editingRoute?.id) return;

        updateRoute.mutate({
            id: editingRoute.id,
            data: updateData.data
        }, {
            onSuccess: () => {
                setShowEditRouteModal(false);
                setEditingRoute(null);
                setShowSuccessModal(true);
                refetchRoutes();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to update route');
            }
        });
    };

    const handleAddSchedule = () => {
        router.push('/admin/add-schedule');
    };

    const handleDeleteRoute = () => {
        if (!selectedRoute) return;

        deleteRoute.mutate(selectedRoute.id, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setSelectedRoute(null);
                refetchRoutes();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to delete route');
            }
        });
    };

    const handleToggleRouteStatus = () => {
        if (!selectedRoute) return;

        const action = selectedRoute.isActive ? 'deactivate' : 'activate';
        toggleRouteStatus.mutate(
            { id: selectedRoute.id, action },
            {
                onSuccess: () => {
                    setShowConfirmModal(false);
                    setSelectedRoute(null);
                    setShowSuccessModal(true);
                    refetchRoutes();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to toggle route status');
                }
            }
        );
    };

    const handleDeleteSchedule = () => {
        if (!selectedSchedule) return;

        deleteSchedule.mutate(selectedSchedule.id, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setSelectedSchedule(null);
                refetchSchedules();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to delete schedule');
            }
        });
    };

    const handleCancelSchedule = () => {
        if (!selectedSchedule) return;

        cancelSchedule.mutate(selectedSchedule.id, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setSelectedSchedule(null);
                setShowSuccessModal(true);
                refetchSchedules();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to cancel schedule');
            }
        });
    };

    const handleRouteSearch = (searchTerm: string) => {
        setRouteFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleScheduleSearch = (searchTerm: string) => {
        setScheduleFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleRoutePageChange = (page: number) => {
        setRouteFilters(prev => ({ ...prev, page }));
    };

    const handleSchedulePageChange = (page: number) => {
        setScheduleFilters(prev => ({ ...prev, page }));
    };

    const getConfirmModalConfig = () => {
        if (activeTab === 'routes') {
            switch (selectedAction) {
                case 'delete':
                    return {
                        title: 'Delete Route',
                        message: 'Are you sure you want to delete this route? This action cannot be undone.',
                        confirmText: 'Delete',
                        onConfirm: handleDeleteRoute
                    };
                case 'deactivate':
                    return {
                        title: selectedRoute?.isActive ? 'Deactivate Route' : 'Activate Route',
                        message: selectedRoute?.isActive
                            ? 'Are you sure you want to deactivate this route?'
                            : 'Are you sure you want to activate this route?',
                        confirmText: selectedRoute?.isActive ? 'Deactivate' : 'Activate',
                        onConfirm: handleToggleRouteStatus
                    };
                default:
                    return {
                        title: 'Confirm Action',
                        message: 'Are you sure you want to perform this action?',
                        confirmText: 'Confirm',
                        onConfirm: () => { }
                    };
            }
        } else {
            switch (selectedAction) {
                case 'delete':
                    return {
                        title: 'Delete Schedule',
                        message: 'Are you sure you want to delete this schedule? This action cannot be undone.',
                        confirmText: 'Delete',
                        onConfirm: handleDeleteSchedule
                    };
                case 'cancel':
                    return {
                        title: 'Cancel Schedule',
                        message: 'Are you sure you want to cancel this schedule?',
                        confirmText: 'Cancel',
                        onConfirm: handleCancelSchedule
                    };
                default:
                    return {
                        title: 'Confirm Action',
                        message: 'Are you sure you want to perform this action?',
                        confirmText: 'Confirm',
                        onConfirm: () => { }
                    };
            }
        }
    };

    const getCurrentData = () => {
        return activeTab === 'routes' ? routesData : schedulesData;
    };

    const getTotalItems = () => {
        const data = getCurrentData();
        return Array.isArray(data) ? data.length : 0;
    };

    const getTotalPages = () => {
        const limit = activeTab === 'routes' ? routeFilters.limit : scheduleFilters.limit;
        return Math.ceil(getTotalItems() / (limit || 10));
    };

    const getPaginatedData = () => {
        const data = getCurrentData();
        if (!data || !Array.isArray(data)) return [];

        const page = activeTab === 'routes' ? routeFilters.page : scheduleFilters.page;
        const limit = activeTab === 'routes' ? routeFilters.limit : scheduleFilters.limit;
        const startIndex = ((page || 1) - 1) * (limit || 10);
        const endIndex = startIndex + (limit || 10);

        return data.slice(startIndex, endIndex);
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg mb-6">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('routes')}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'routes' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Routes
                        {activeTab === 'routes' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('schedules')}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'schedules' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Schedules
                        {activeTab === 'schedules' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <FilterSection
                onAdd={() => activeTab === 'routes' ? setShowAddRouteModal(true) : handleAddSchedule()}
                onSearch={activeTab === 'routes' ? handleRouteSearch : handleScheduleSearch}
                showAddButton={true}
                addButtonText={activeTab === 'routes' ? 'Add Route' : 'Add Schedule'}
            />

            {/* Loading State */}
            {(activeTab === 'routes' ? routesLoading : schedulesLoading) ? (
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading {activeTab}...</p>
                </div>
            ) : (
                <>
                    {/* Data Table */}
                    <DataTable
                        columns={activeTab === 'routes' ? routesColumns : schedulesColumns}
                        data={getPaginatedData()}
                        actions={activeTab === 'routes' ? routeActions : scheduleActions}
                    />

                    {/* Pagination */}
                    {getTotalItems() > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={activeTab === 'routes' ? (routeFilters.page || 1) : (scheduleFilters.page || 1)}
                                totalPages={getTotalPages()}
                                totalItems={getTotalItems()}
                                itemsPerPage={activeTab === 'routes' ? (routeFilters.limit || 10) : (scheduleFilters.limit || 10)}
                                onPageChange={activeTab === 'routes' ? handleRoutePageChange : handleSchedulePageChange}
                            />
                        </div>
                    )}

                    {/* No Data Message */}
                    {getTotalItems() === 0 && (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <p className="text-gray-600">No {activeTab} found</p>
                            <button
                                onClick={() => activeTab === 'routes' ? setShowAddRouteModal(true) : handleAddSchedule()}
                                className="mt-4 px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3] transition-colors"
                            >
                                Add New {activeTab === 'routes' ? 'Route' : 'Schedule'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {/* Add Route Modal */}
            <AddRouteModal
                isOpen={showAddRouteModal}
                onClose={() => setShowAddRouteModal(false)}
                onSubmit={handleAddRoute}
                isEdit={false}
            />

            {/* Edit Route Modal */}
            <AddRouteModal
                isOpen={showEditRouteModal}
                onClose={() => {
                    setShowEditRouteModal(false);
                    setEditingRoute(null);
                }}
                onSubmit={handleUpdateRoute}
                initialData={editingRoute ? {
                    id: editingRoute.id,
                    name: editingRoute.name,
                    description: editingRoute.description,
                    stops: editingRoute.stops,
                    status: editingRoute.status,
                    isActive: editingRoute.isActive,
                    estimatedDuration: editingRoute.estimatedDuration,
                    distance: editingRoute.distance
                } : undefined}
                isEdit={true}
            />

            <RouteDetailsModal
                isOpen={showRouteDetailsModal}
                onClose={() => {
                    setShowRouteDetailsModal(false);
                    setSelectedRoute(null);
                }}
                routeId={selectedRoute?.id || ''}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={
                    selectedAction === 'delete'
                        ? `${activeTab === 'routes' ? 'Route' : 'Schedule'} Deleted Successfully`
                        : selectedAction === 'deactivate'
                            ? selectedRoute?.isActive ? 'Route Deactivated Successfully' : 'Route Activated Successfully'
                            : editingRoute
                                ? 'Route Updated Successfully'
                                : 'Schedule Cancelled Successfully'
                }
                type={activeTab === 'routes' ? 'route' : 'status'}
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedRoute(null);
                    setSelectedSchedule(null);
                }}
                onConfirm={getConfirmModalConfig().onConfirm}
                title={getConfirmModalConfig().title}
                message={getConfirmModalConfig().message}
                confirmText={getConfirmModalConfig().confirmText}
                cancelText="Cancel"
            />
        </div>
    );
};

export default RoutesSchedulesPage;