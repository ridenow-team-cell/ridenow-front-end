"use client"
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import Pagination from '@/components/ui/Pagination';
import DriverFormModal from '@/components/ui/modals/DriverFormModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import DriverDetailsModal from '@/components/ui/modals/DriverDetailsModal';
import AssignBusModal from '@/components/ui/modals/AssignBusModal';
import ChangeStatusModal from '@/components/ui/modals/ChangeDriverStatusModal';
import {
    useDrivers,
    useCreateDriver,
    useUpdateDriver,
    useDeleteDriver,
    useToggleDriverStatus,
    useAssignBusToDriver,
    useUnassignBusFromDriver,
    useChangeDriverStatus
} from '@/hooks/use-drivers';
import { driverService } from '@/services/driver-service';
import { Driver } from '@/types/driver';
import { toast } from 'react-hot-toast';
import { useBuses } from '@/hooks/use-bus';
import { useRoutes } from '@/hooks/use-routes';

const ManageDriverPage = () => {
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
    const [filters, setFilters] = useState({
        page: 1,
        pageSize: 10,
        search: ''
    });

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAssignBusModal, setShowAssignBusModal] = useState(false);
    const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);

    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [selectedAction, setSelectedAction] = useState<'deactivate' | 'delete' | 'assignBus' | 'assignRoute' | 'changeStatus'>('deactivate');

    // Store all drivers locally for filtering
    const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
    const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);

    // Hooks
    const { data: driversData, isLoading, refetch } = useDrivers({
        page: 1,
        pageSize: 100 // Fetch more data to handle local filtering
    });

    const { data: busesData } = useBuses({ status: 'Available' });
    const { data: routesData } = useRoutes({ status: 'Active' });

    const createDriver = useCreateDriver();
    const updateDriver = useUpdateDriver();
    const deleteDriver = useDeleteDriver();
    const toggleDriverStatus = useToggleDriverStatus();
    const assignBusToDriver = useAssignBusToDriver();
    const unassignBusFromDriver = useUnassignBusFromDriver();
    const changeDriverStatus = useChangeDriverStatus();

    // Load all drivers and filter locally
    useEffect(() => {
        if (driversData && Array.isArray(driversData)) {
            setAllDrivers(driversData);
        } else if (driversData && typeof driversData === 'object' && driversData.data) {
            // If API returns paginated response with data property
            setAllDrivers(driversData.data);
        }
    }, [driversData]);

    // Apply local filtering based on activeTab and search
    useEffect(() => {
        if (allDrivers.length === 0) {
            setFilteredDrivers([]);
            return;
        }

        let result = [...allDrivers];

        // Filter by active/inactive status
        result = result.filter(driver =>
            activeTab === 'active' ? driver.status !== "Inactive" : driver.status === "Inactive"
        );

        // Apply search filter
        if (filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(driver =>
                driver.fullName?.toLowerCase().includes(searchTerm) ||
                driver.email?.toLowerCase().includes(searchTerm) ||
                driver.phoneNumber?.toLowerCase().includes(searchTerm) ||
                driver.licenseNumber?.toLowerCase().includes(searchTerm)
            );
        }

        setFilteredDrivers(result);
    }, [allDrivers, activeTab, filters.search]);

    // Calculate paginated data
    const getPaginatedDrivers = () => {
        const startIndex = (filters.page - 1) * filters.pageSize;
        const endIndex = startIndex + filters.pageSize;
        return filteredDrivers.slice(startIndex, endIndex);
    };

    // Table columns
    const columns = [
        {
            key: 'photoUrl',
            header: 'Image',
            render: (driver: Driver) => (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {driver.photoUrl ? (
                        <img src={driver.photoUrl} alt={driver.fullName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                                {driver.fullName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'fullName',
            header: 'Full Name',
            render: (driver: Driver) => (
                <div>
                    <div className="font-medium text-gray-800">{driver.fullName}</div>
                    <div className="text-sm text-gray-500">{driver.email}</div>
                </div>
            )
        },
        {
            key: 'phoneNumber',
            header: 'Phone Number',
            render: (driver: Driver) => (
                <div className="text-gray-700">{driver.phoneNumber}</div>
            )
        },
        {
            key: 'licenseNumber',
            header: 'License Number',
            render: (driver: Driver) => (
                <div className="text-gray-700">{driver.licenseNumber}</div>
            )
        },
        {
            key: 'busId',
            header: 'Allocated Bus',
            render: (driver: Driver) => (
                <div className="text-gray-700">
                    {driver.busId ? 'Assigned' : 'Not Assigned'}
                </div>
            )
        },
        {
            key: 'routeId',
            header: 'Assigned Route',
            render: (driver: Driver) => (
                <div className="text-gray-700">
                    {driver.routeId ? 'Assigned' : 'Not Assigned'}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (driver: Driver) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${driverService.getStatusColor(driver.status)}`}>
                    {driverService.getStatusBadge(driver.status)}
                </span>
            )
        },
        {
            key: 'createdAt',
            header: 'Joined Date',
            render: (driver: Driver) => driverService.formatDate(driver.createdAt)
        },
    ];

    // Actions for Active Drivers tab
    const activeTabActions = [
        {
            label: 'View Details',
            onClick: (driver: Driver) => {
                setSelectedDriver(driver);
                setShowDetailsModal(true);
            }
        },
        {
            label: 'Edit',
            onClick: (driver: Driver) => {
                setSelectedDriver(driver);
                setShowEditModal(true);
            }
        },
        {
            label: 'Assign Bus',
            onClick: (driver: Driver) => {
                setSelectedDriver(driver);
                setSelectedAction('assignBus');
                setShowAssignBusModal(true);
            }
        },
        {
            label: 'Change Status',
            onClick: (driver: Driver) => {
                setSelectedDriver(driver);
                setSelectedAction('changeStatus');
                setShowChangeStatusModal(true);
            }
        },
        {
            label: 'Deactivate',
            onClick: (driver: Driver) => {
                setSelectedDriver(driver);
                setSelectedAction('deactivate');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        },
        {
            label: 'Delete',
            onClick: (driver: Driver) => {
                setSelectedDriver(driver);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Actions for Inactive Drivers tab
    const inactiveTabActions = [
        {
            label: 'View Details',
            onClick: (driver: Driver) => {
                setSelectedDriver(driver);
                setShowDetailsModal(true);
            }
        },
        {
            label: 'Activate',
            onClick: (driver: Driver) => handleToggleStatus(driver.id, 'activate'),
            className: 'text-[#0066CC]'
        },
        {
            label: 'Delete',
            onClick: (driver: Driver) => {
                setSelectedDriver(driver);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Handlers
    const handleAddDriver = (formData: any) => {
        createDriver.mutate(formData, {
            onSuccess: () => {
                setShowAddModal(false);
                setShowSuccessModal(true);
                refetch();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to create driver');
            }
        });
    };

    const handleEditDriver = (formData: any) => {
        if (!selectedDriver) return;

        const { password, confirmPassword, ...updateData } = formData;
        updateDriver.mutate(
            { id: selectedDriver.id, data: updateData },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedDriver(null);
                    setShowSuccessModal(true);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update driver');
                }
            }
        );
    };

    const handleDeleteDriver = () => {
        if (!selectedDriver) return;

        deleteDriver.mutate(selectedDriver.id, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setSelectedDriver(null);
                refetch();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to delete driver');
            }
        });
    };

    const handleToggleStatus = (driverId: string, action: 'activate' | 'deactivate') => {
        toggleDriverStatus.mutate(
            { id: driverId, action },
            {
                onSuccess: () => {
                    setShowConfirmModal(false);
                    setSelectedDriver(null);
                    setShowSuccessModal(true);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to toggle driver status');
                }
            }
        );
    };

    const handleAssignBus = (busId: string) => {
        if (!selectedDriver) return;

        if (busId === '') {
            // Unassign bus
            unassignBusFromDriver.mutate(selectedDriver.id, {
                onSuccess: () => {
                    setShowAssignBusModal(false);
                    setSelectedDriver(null);
                    toast.success('Bus unassigned successfully');
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to unassign bus');
                }
            });
        } else {
            // Assign new bus
            assignBusToDriver.mutate(
                { id: selectedDriver.id, busId },
                {
                    onSuccess: () => {
                        setShowAssignBusModal(false);
                        setSelectedDriver(null);
                        toast.success('Bus assigned successfully');
                        refetch();
                    },
                    onError: (error: any) => {
                        toast.error(error.message || 'Failed to assign bus');
                    }
                }
            );
        }
    };

    const handleChangeStatus = (newStatus: string) => {
        if (!selectedDriver) return;

        changeDriverStatus.mutate(
            { id: selectedDriver.id, status: newStatus },
            {
                onSuccess: () => {
                    setShowChangeStatusModal(false);
                    setSelectedDriver(null);
                    toast.success('Driver status changed successfully');
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to change driver status');
                }
            }
        );
    };

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const getConfirmModalConfig = () => {
        switch (selectedAction) {
            case 'deactivate':
                return {
                    title: 'Deactivate Driver',
                    message: 'Are you sure you want to deactivate this driver?',
                    confirmText: 'Deactivate',
                    onConfirm: () => {
                        if (selectedDriver) {
                            handleToggleStatus(selectedDriver.id, 'deactivate');
                        }
                        setShowConfirmModal(false);
                        setSelectedDriver(null);
                    }
                };
            case 'delete':
                return {
                    title: 'Delete Driver',
                    message: 'Are you sure you want to delete this driver? This action cannot be undone.',
                    confirmText: 'Delete',
                    onConfirm: handleDeleteDriver
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

    const totalPages = Math.ceil(filteredDrivers.length / filters.pageSize);

    return (
        <div className="p-4 sm:p-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg mb-6">
                <div className="flex border-b">
                    <button
                        onClick={() => {
                            setActiveTab('active');
                            setFilters(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'active' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Active Drivers
                        {activeTab === 'active' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('inactive');
                            setFilters(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'inactive' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Inactive Drivers
                        {activeTab === 'inactive' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <FilterSection
                onAdd={() => setShowAddModal(true)}
                onSearch={handleSearch}
                showAddButton={true}
                addButtonText="Add New Driver"
            />

            {/* Loading State */}
            {isLoading ? (
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading drivers...</p>
                </div>
            ) : (
                <>
                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={getPaginatedDrivers()}
                        actions={activeTab === 'active' ? activeTabActions : inactiveTabActions}
                    />

                    {/* Pagination */}
                    {filteredDrivers.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={filters.page}
                                totalPages={totalPages}
                                totalItems={filteredDrivers.length}
                                itemsPerPage={filters.pageSize}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}

                    {/* No Data Message */}
                    {filteredDrivers.length === 0 && (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <p className="text-gray-600">
                                {filters.search.trim()
                                    ? `No ${activeTab === 'active' ? 'active' : 'inactive'} drivers found matching "${filters.search}"`
                                    : `No ${activeTab === 'active' ? 'active' : 'inactive'} drivers found`
                                }
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="mt-4 px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3] transition-colors"
                            >
                                Add New Driver
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <DriverFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddDriver}
                isEdit={false}
                buses={busesData || []}
                routes={routesData || []}
            />

            <DriverFormModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedDriver(null);
                }}
                onSubmit={handleEditDriver}
                initialData={selectedDriver ? {
                    fullName: selectedDriver.fullName,
                    phoneNumber: selectedDriver.phoneNumber,
                    email: selectedDriver.email,
                    licenseNumber: selectedDriver.licenseNumber,
                    photoUrl: selectedDriver.fullName,
                    busId: selectedDriver.busId || '',
                    routeId: selectedDriver.routeId || '',
                    status: selectedDriver.status,
                    isActive: selectedDriver.isActive
                } : undefined}
                isEdit={true}
                buses={busesData || []}
                routes={routesData || []}
            />

            <DriverDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedDriver(null);
                }}
                driverId={selectedDriver?.id || ''}
            />

            <AssignBusModal
                isOpen={showAssignBusModal}
                onClose={() => {
                    setShowAssignBusModal(false);
                    setSelectedDriver(null);
                }}
                onConfirm={handleAssignBus}
                currentBusId={selectedDriver?.busId || ''}
                buses={busesData || []}
            />

            <ChangeStatusModal
                isOpen={showChangeStatusModal}
                onClose={() => {
                    setShowChangeStatusModal(false);
                    setSelectedDriver(null);
                }}
                onConfirm={handleChangeStatus}
                currentStatus={selectedDriver?.status || ''}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={
                    selectedDriver
                        ? 'Driver Updated Successfully'
                        : selectedAction === 'deactivate'
                            ? 'Driver Updated Successfully'
                            : 'Driver Created Successfully'
                }
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedDriver(null);
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

export default ManageDriverPage;