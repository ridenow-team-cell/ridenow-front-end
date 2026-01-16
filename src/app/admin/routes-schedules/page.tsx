"use client"
import React, { useState } from 'react';
import { Calendar, ChevronDown, Search, Plus, MoreVertical, Filter } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import AddScheduleModal from '@/components/ui/modals/AddScheduleModal';

interface Route {
    id: number;
    routeName: string;
    startingPoint: string;
    destination: string;
    stops: string;
    distance: string;
    estimatedTime: string;
    status: 'Upcoming' | 'Active' | 'Completed';
}

interface Schedule {
    id: number;
    date: string;
    time: string;
    routeName: string;
    driverName: string;
    vehicleName: string;
    passengerName: string;
    status: 'Upcoming' | 'Active' | 'Completed';
}

const RoutesSchedulesPage = () => {
    const [activeTab, setActiveTab] = useState<'routes' | 'schedules'>('routes');
    const [showAddRouteModal, setShowAddRouteModal] = useState(false);
    const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);

    // Sample routes data
    const [routes, setRoutes] = useState<Route[]>([
        { id: 1, routeName: 'Route 60', startingPoint: 'Garki', destination: 'Idu', stops: 'Nill', distance: '2 km', estimatedTime: '11:00 AM', status: 'Upcoming' },
        { id: 2, routeName: 'Route 60', startingPoint: 'Garki', destination: 'Idu', stops: 'Nill', distance: '2 km', estimatedTime: '11:00 AM', status: 'Upcoming' },
        { id: 3, routeName: 'Route 60', startingPoint: 'Garki', destination: 'Idu', stops: 'Nill', distance: '2 km', estimatedTime: '11:00 AM', status: 'Upcoming' },
        { id: 4, routeName: 'Route 60', startingPoint: 'Garki', destination: 'Idu', stops: 'Nill', distance: '2 km', estimatedTime: '11:00 AM', status: 'Upcoming' },
    ]);

    // Sample schedules data
    const [schedules, setSchedules] = useState<Schedule[]>([
        { id: 1, date: '18/12/2025', time: '11:00 AM', routeName: 'Rout 45', driverName: 'Musa', vehicleName: 'Benz 911', passengerName: 'Grace', status: 'Upcoming' },
        { id: 2, date: '18/12/2025', time: '11:00 AM', routeName: 'Rout 45', driverName: 'Musa', vehicleName: 'Benz 911', passengerName: 'Grace', status: 'Upcoming' },
        { id: 3, date: '18/12/2025', time: '11:00 AM', routeName: 'Rout 45', driverName: 'Musa', vehicleName: 'Benz 911', passengerName: 'Grace', status: 'Upcoming' },
        { id: 4, date: '18/12/2025', time: '11:00 AM', routeName: 'Rout 45', driverName: 'Musa', vehicleName: 'Benz 911', passengerName: 'Grace', status: 'Upcoming' },
    ]);

    // Routes table columns
    const routesColumns = [
        { key: 'routeName', header: 'Route Name' },
        { key: 'startingPoint', header: 'Starting Point' },
        { key: 'destination', header: 'Destination' },
        { key: 'stops', header: 'Stops' },
        { key: 'distance', header: 'Distance' },
        { key: 'estimatedTime', header: 'Estimated Time' },
        {
            key: 'status',
            header: 'Status',
            className: (row: Route) => {
                switch (row.status) {
                    case 'Upcoming': return 'text-orange-500';
                    case 'Active': return 'text-green-500';
                    case 'Completed': return 'text-gray-500';
                    default: return '';
                }
            }
        },
    ];

    // Schedules table columns
    const schedulesColumns = [
        { key: 'date', header: 'Date' },
        { key: 'time', header: 'Time' },
        { key: 'routeName', header: 'Route Name' },
        { key: 'driverName', header: 'Driver Name' },
        { key: 'vehicleName', header: 'Vehicle Name' },
        { key: 'passengerName', header: 'Name of Passenger' },
        {
            key: 'status',
            header: 'Status',
            className: (row: Schedule) => {
                switch (row.status) {
                    case 'Upcoming': return 'text-orange-500';
                    case 'Active': return 'text-green-500';
                    case 'Completed': return 'text-gray-500';
                    default: return '';
                }
            }
        },
    ];

    // Actions for both tables
    const routeActions = [
        {
            label: 'Edit',
            onClick: (route: Route) => {
                console.log('Edit route:', route);
                // Open edit modal
            }
        },
        {
            label: 'View Details',
            onClick: (route: Route) => {
                console.log('View route details:', route);
                // Open details modal
            }
        },
        {
            label: 'Delete',
            onClick: (route: Route) => {
                console.log('Delete route:', route);
                // Open confirmation modal
            },
            className: 'text-red-500'
        }
    ];

    const scheduleActions = [
        {
            label: 'Edit',
            onClick: (schedule: Schedule) => {
                console.log('Edit schedule:', schedule);
                // Open edit modal
            }
        },
        {
            label: 'Reschedule',
            onClick: (schedule: Schedule) => {
                console.log('Reschedule:', schedule);
                // Open reschedule modal
            }
        },
        {
            label: 'Cancel',
            onClick: (schedule: Schedule) => {
                console.log('Cancel schedule:', schedule);
                // Open confirmation modal
            },
            className: 'text-red-500'
        }
    ];

    return (
        <div className="p-4 sm:p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-[#343434]">Routes & Schedules</h1>
            </div>

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
                onAdd={() => activeTab === 'routes' ? setShowAddRouteModal(true) : setShowAddScheduleModal(true)}
                showAddButton={true}
                addButtonText={activeTab === 'routes' ? 'Add Route' : 'Add Schedule'}
            />

            {/* Table */}
            {activeTab === 'routes' ? (
                <DataTable
                    columns={routesColumns}
                    data={routes}
                    actions={routeActions}
                />
            ) : (
                <DataTable
                    columns={schedulesColumns}
                    data={schedules}
                    actions={scheduleActions}
                />
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
                <button className="w-10 h-10 flex items-center justify-center bg-[#E7A533] text-white rounded-lg hover:bg-[#d69420] transition-colors">
                    ‹
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-[#E7A533] text-gray-800 rounded-lg">
                    1
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    2
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-[#E7A533] text-white rounded-lg hover:bg-[#d69420] transition-colors">
                    ›
                </button>
            </div>

            {/* Add Route Modal (Placeholder - You'll need to create this) */}
            {/* {showAddRouteModal && (
        <AddRouteModal
          isOpen={showAddRouteModal}
          onClose={() => setShowAddRouteModal(false)}
          onSubmit={(data) => {
            // Handle add route
            console.log('Add route:', data);
            setShowAddRouteModal(false);
          }}
        />
      )} */}

            {/* Add Schedule Modal (Placeholder - You'll need to create this) */}
            {showAddScheduleModal && (
                <AddScheduleModal
                    isOpen={showAddScheduleModal}
                    onClose={() => setShowAddScheduleModal(false)}
                    onSubmit={(data) => {
                        // Handle add schedule
                        console.log('Add schedule:', data);
                        setShowAddScheduleModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default RoutesSchedulesPage;