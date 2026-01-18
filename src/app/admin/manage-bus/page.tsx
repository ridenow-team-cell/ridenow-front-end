"use client"
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import Pagination from '@/components/ui/Pagination';
import BusFormModal from '@/components/ui/modals/BusFormModal';
import BusDetailsModal from '@/components/ui/modals/BusDetailsModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import { useBuses, useCreateBus, useUpdateBus, useDeleteBus, useToggleBusStatus, useBusDetails } from '@/hooks/use-bus';
import { busService } from '@/services/bus-service';
import { Bus, BusQueryParams } from '@/types/bus';
import { toast } from 'react-hot-toast';

const ManageBusPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'block'>('add');
    const [filters, setFilters] = useState<BusQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',

    });

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [editingBus, setEditingBus] = useState<Bus | null>(null);
    const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<'block' | 'delete' | 'details'>('block');
    const [selectedBusDetails, setSelectedBusDetails] = useState<any>(null);

    // State for pagination
    const [totalPages, setTotalPages] = useState(1);
    const [totalBuses, setTotalBuses] = useState(0);

    // Hooks
    const { data: busesData, isLoading, refetch } = useBuses(filters);
    const { data: busDetails, refetch: refetchDetails } = useBusDetails(selectedBusId || '');
    const createBus = useCreateBus();
    const updateBus = useUpdateBus();
    const deleteBus = useDeleteBus();
    const toggleBusStatus = useToggleBusStatus();

    // Update bus details when selected
    useEffect(() => {
        if (selectedBusId && showDetailsModal) {
            refetchDetails();
        }
    }, [selectedBusId, showDetailsModal, refetchDetails]);

    // Update pagination when data changes
    useEffect(() => {
        if (busesData && Array.isArray(busesData)) {
            setTotalBuses(busesData.length);
            const total = busesData.length;
            const limit = filters.limit || 10;
            setTotalPages(Math.ceil(total / limit));
        }
    }, [busesData, filters.limit]);

    // Get paginated data
    const getPaginatedData = () => {
        if (!busesData || !Array.isArray(busesData)) return [];
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return busesData.slice(startIndex, endIndex);
    };

    // Filter buses based on active tab
    const filteredBuses = () => {
        const data = getPaginatedData();
        return activeTab === 'block'
            ? data.filter(bus => !bus.isActive)
            : data.filter(bus => bus.isActive);
    };

    // Table columns
    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'model', header: 'Model' },
        { key: 'make', header: 'Make' },
        { key: 'registrationName', header: 'Reg. Name' },
        {
            key: 'color',
            header: 'Color',
            render: (bus: Bus) => (
                <div className="flex items-center space-x-2">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: bus.color.toLowerCase() }}
                    ></div>
                    <span>{bus.color}</span>
                </div>
            )
        },
        { key: 'year', header: 'Year' },
        {
            key: 'totalSeats',
            header: 'Seats',
            render: (bus: Bus) => (
                <span className="font-medium">{bus.totalSeats}</span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (bus: Bus) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${busService.getStatusColor(bus.status)}`}>
                    {bus.status}
                </span>
            )
        },
        {
            key: 'createdAt',
            header: 'Added On',
            render: (bus: Bus) => busService.formatDate(bus.createdAt)
        },
    ];

    // Actions for Add Bus tab
    const addTabActions = [
        {
            label: 'View Details',
            onClick: (bus: Bus) => {
                setSelectedBusId(bus.id);
                setSelectedAction('details');
                setShowDetailsModal(true);
            }
        },
        {
            label: 'Edit',
            onClick: (bus: Bus) => {
                setEditingBus(bus);
                setShowEditModal(true);
            }
        },
        {
            label: 'Deactivate',
            onClick: (bus: Bus) => {
                setSelectedBusId(bus.id);
                setSelectedAction('block');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        },
        {
            label: 'Delete',
            onClick: (bus: Bus) => {
                setSelectedBusId(bus.id);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Actions for Block Bus tab
    const blockTabActions = [
        {
            label: 'View Details',
            onClick: (bus: Bus) => {
                setSelectedBusId(bus.id);
                setSelectedAction('details');
                setShowDetailsModal(true);
            }
        },
        {
            label: 'Activate',
            onClick: (bus: Bus) => handleToggleStatus(bus.id, 'activate'),
            className: 'text-[#0066CC]'
        },
        {
            label: 'Delete',
            onClick: (bus: Bus) => {
                setSelectedBusId(bus.id);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Handlers
    const handleAddBus = (formData: any) => {
        const busData = {
            name: formData.name,
            model: formData.model,
            make: formData.make,
            registrationName: formData.registrationName,
            color: formData.color,
            year: Number(formData.year),
            status: formData.status,
            totalSeats: Number(formData.totalSeats),
            isActive: formData.isActive
        };

        createBus.mutate(busData, {
            onSuccess: () => {
                setShowAddModal(false);
                setShowSuccessModal(true);
                refetch();
            }
        });
    };

    const handleEditBus = (formData: any) => {
        if (!editingBus) return;

        const updateData = {
            name: formData.name,
            model: formData.model,
            make: formData.make,
            registrationName: formData.registrationName,
            color: formData.color,
            year: Number(formData.year),
            status: formData.status,
            totalSeats: Number(formData.totalSeats)
        };

        updateBus.mutate(
            { id: editingBus.id, data: updateData },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setEditingBus(null);
                    setShowSuccessModal(true);
                }
            }
        );
    };

    const handleDeleteBus = () => {
        if (!selectedBusId) return;

        deleteBus.mutate(selectedBusId, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setSelectedBusId(null);
                refetch();
            }
        });
    };

    const handleToggleStatus = (busId: string, action: 'activate' | 'deactivate') => {
        toggleBusStatus.mutate(
            { id: busId, action },
            {
                onSuccess: () => {
                    if (action === 'activate') {
                        setShowSuccessModal(true);
                    }
                    refetch();
                }
            }
        );
    };

    const handleUnblockAll = () => {
        const data = busesData || [];
        const inactiveBuses = data.filter(bus => !bus.isActive);

        if (inactiveBuses.length === 0) {
            toast.success('No inactive buses to activate');
            return;
        }

        inactiveBuses.forEach(bus => {
            toggleBusStatus.mutate({ id: bus.id, action: 'activate' });
        });

        toast.success(`Activating ${inactiveBuses.length} buses...`);
        refetch();
    };

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleFilter = () => {
        // You can add more filter logic here
        console.log('Filter clicked', filters);
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const getConfirmModalConfig = () => {
        switch (selectedAction) {
            case 'block':
                return {
                    title: 'Deactivate Bus',
                    message: 'Are you sure you want to deactivate this bus?',
                    confirmText: 'Deactivate',
                    onConfirm: () => {
                        if (selectedBusId) {
                            handleToggleStatus(selectedBusId, 'deactivate');
                        }
                        setShowConfirmModal(false);
                        setSelectedBusId(null);
                    }
                };
            case 'delete':
                return {
                    title: 'Delete Bus',
                    message: 'Are you sure you want to delete this bus? This action cannot be undone.',
                    confirmText: 'Delete',
                    onConfirm: handleDeleteBus
                };
            default:
                return {
                    title: 'Confirm Action',
                    message: 'Are you sure you want to perform this action?',
                    confirmText: 'Confirm',
                    onConfirm: () => { }
                };
        }
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg mb-6">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'add' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Active Buses
                        {activeTab === 'add' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('block')}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'block' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Inactive Buses
                        {activeTab === 'block' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <FilterSection
                onAdd={() => setShowAddModal(true)}
                onSearch={handleSearch}
                onFilter={handleFilter}
                showAddButton={activeTab === 'add'}
                addButtonText="Add New Bus"
                showUnblockAll={activeTab === 'block'}
                onUnblockAll={handleUnblockAll}
            />

            {/* Loading State */}
            {isLoading ? (
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading buses...</p>
                </div>
            ) : (
                <>
                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={filteredBuses()}
                        actions={activeTab === 'add' ? addTabActions : blockTabActions}
                    />

                    {/* Pagination */}
                    {busesData && busesData.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={filters.page || 1}
                                totalPages={totalPages}
                                totalItems={totalBuses}
                                itemsPerPage={filters.limit || 10}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}

                    {/* No Data Message */}
                    {(!busesData || busesData.length === 0) && (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <p className="text-gray-600">No buses found</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="mt-4 px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3] transition-colors"
                            >
                                Add New Bus
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <BusFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddBus}
                isEdit={false}
            />

            <BusFormModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingBus(null);
                }}
                onSubmit={handleEditBus}
                initialData={editingBus ? {
                    name: editingBus.name,
                    model: editingBus.model,
                    make: editingBus.make,
                    registrationName: editingBus.registrationName,
                    color: editingBus.color,
                    year: editingBus.year,
                    status: editingBus.status,
                    totalSeats: editingBus.totalSeats,
                    isActive: editingBus.isActive
                } : undefined}
                isEdit={true}
            />

            <BusDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedBusId(null);
                }}
                busDetails={busDetails || null}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={
                    editingBus
                        ? 'Bus Updated Successfully'
                        : selectedAction === 'block'
                            ? 'Bus updated successfully'
                            : 'Bus Created Successfully'
                }
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedBusId(null);
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

export default ManageBusPage;