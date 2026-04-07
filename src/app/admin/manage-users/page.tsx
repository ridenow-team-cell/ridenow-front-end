"use client"
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import Pagination from '@/components/ui/Pagination';
import UserFormModal from '@/components/ui/modals/UserFormModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import ChangeRoleModal from '@/components/ui/modals/NewRoleUpdateModal';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useToggleUserStatus, useChangeUserRole } from '@/hooks/use-users';
import { userService } from '@/services/user-service';
import { User, UserQueryParams } from '@/types/admin';
import { toast } from 'react-hot-toast';

const ManageUserPage = () => {
    // Tabs for Active/Inactive users
    const [activeTab, setActiveTab] = useState<'add' | 'block'>('add');

    // Tabs for Roles
    const [roleTab, setRoleTab] = useState<'Student' | 'Driver' | 'Admin'>('Student');

    const [filters, setFilters] = useState<UserQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'dateCreated',
        sortOrder: 'desc',
        role: "Student" // Default to Student
    });

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<'block' | 'delete' | 'changeRole'>('block');

    // State for pagination
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Hooks
    const { data: usersData, isLoading, refetch } = useUsers(filters);
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();
    const toggleUserStatus = useToggleUserStatus();
    const changeUserRole = useChangeUserRole();

    // Update filters when role tab changes
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            role: roleTab,
            page: 1 // Reset to first page when changing role
        }));
    }, [roleTab]);

    // Update pagination when data changes
    useEffect(() => {
        if (usersData && Array.isArray(usersData)) {
            setTotalUsers(usersData.length);
            const total = usersData.length;
            const limit = filters.limit || 10;
            setTotalPages(Math.ceil(total / limit));
        }
    }, [usersData, filters.limit]);

    // Get paginated data
    const getPaginatedData = () => {
        if (!usersData || !Array.isArray(usersData)) return [];

        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return usersData.slice(startIndex, endIndex);
    };

    // Filter users based on active tab
    const filteredUsers = () => {
        const data = getPaginatedData();
        return activeTab === 'block'
            ? data.filter(user => !user.isActive)
            : data.filter(user => user.isActive);
    };

    // Table columns
    const columns = [
        { key: 'name', header: 'Fullname' },
        { key: 'schoolId', header: 'School ID' },
        { key: 'email', header: 'Email' },
        { key: 'phoneNo', header: 'Phone Number' },
        {
            key: 'role',
            header: 'Role',
            render: (user: User) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${userService.getRoleColor(user.role)}`}>
                    {user.role}
                </span>
            )
        },
        {
            key: 'dateCreated',
            header: 'Date Created',
            render: (user: User) => userService.formatDate(user.dateCreated)
        },
        {
            key: 'status',
            header: 'Status',
            render: (user: User) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${userService.getStatusColor(user.status)}`}>
                    {user.status}
                </span>
            )
        },
    ];

    // Actions for Add User tab
    const addTabActions = [
        {
            label: 'Edit',
            onClick: (user: User) => {
                setEditingUser(user);
                setShowEditModal(true);
            }
        },
        {
            label: 'Change Role',
            onClick: (user: User) => {
                setEditingUser(user);
                setSelectedAction('changeRole');
                setShowChangeRoleModal(true);
            }
        },
        {
            label: 'Deactivate',
            onClick: (user: User) => {
                setSelectedUserId(user.id);
                setSelectedAction('block');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        },
        {
            label: 'Delete',
            onClick: (user: User) => {
                setSelectedUserId(user.id);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Actions for Block User tab
    const blockTabActions = [
        {
            label: 'Activate',
            onClick: (user: User) => handleToggleStatus(user.id, 'activate'),
            className: 'text-[#0066CC]'
        },
        {
            label: 'Delete',
            onClick: (user: User) => {
                setSelectedUserId(user.id);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Handlers
    const handleAddUser = (formData: any) => {
        const userData = {
            name: formData.name,
            email: formData.email,
            schoolId: formData.schoolId || undefined,
            role: formData.role,
            phoneNo: formData.phoneNo,
            password: formData.password,
            isActive: formData.isActive
        };

        createUser.mutate(userData, {
            onSuccess: () => {
                setShowAddModal(false);
                setShowSuccessModal(true);
                refetch();
            }
        });
    };

    const handleEditUser = (formData: any) => {
        if (!editingUser) return;

        const { password, confirmPassword, ...updateData } = formData;
        updateUser.mutate(
            { id: editingUser.id, data: updateData },
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setShowSuccessModal(true);
                }
            }
        );
    };

    const handleDeleteUser = () => {
        if (!selectedUserId) return;

        deleteUser.mutate(selectedUserId, {
            onSuccess: () => {
                setShowConfirmModal(false);
                setSelectedUserId(null);
                refetch();
            }
        });
    };

    const handleToggleStatus = (userId: string, action: 'activate' | 'deactivate') => {
        toggleUserStatus.mutate(
            { id: userId, action },
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

    const handleChangeRole = (newRole: string) => {
        if (!editingUser) return;

        changeUserRole.mutate(
            { id: editingUser.id, newRole },
            {
                onSuccess: () => {
                    setShowChangeRoleModal(false);
                    setEditingUser(null);
                    setShowSuccessModal(true);
                    refetch();
                }
            }
        );
    };

    const handleUnblockAll = () => {
        const data = usersData || [];
        const inactiveUsers = data.filter(user => !user.isActive);

        if (inactiveUsers.length === 0) {
            toast.success('No inactive users to activate');
            return;
        }

        inactiveUsers.forEach(user => {
            toggleUserStatus.mutate({ id: user.id, action: 'activate' });
        });

        toast.success(`Activating ${inactiveUsers.length} users...`);
        refetch();
    };

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };



    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const getConfirmModalConfig = () => {
        switch (selectedAction) {
            case 'block':
                return {
                    title: 'Deactivate User',
                    message: 'Are you sure you want to deactivate this user?',
                    confirmText: 'Deactivate',
                    onConfirm: () => {
                        if (selectedUserId) {
                            handleToggleStatus(selectedUserId, 'deactivate');
                        }
                        setShowConfirmModal(false);
                        setSelectedUserId(null);
                    }
                };
            case 'delete':
                return {
                    title: 'Delete User',
                    message: 'Are you sure you want to delete this user? This action cannot be undone.',
                    confirmText: 'Delete',
                    onConfirm: handleDeleteUser
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
            {/* Main Tabs - Active/Inactive Users */}
            <div className="bg-white rounded-lg mb-6">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'add' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Active Users
                        {activeTab === 'add' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('block')}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'block' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Inactive Users
                        {activeTab === 'block' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Role Tabs */}
            <div className="bg-white rounded-lg mb-6">
                <div className="flex border-b">
                    {['Student', 'Driver', 'Admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleTab(role as any)}
                            className={`px-8 py-3 text-base font-medium relative ${roleTab === role ? 'text-gray-800' : 'text-gray-500'}`}
                        >
                            {role} Users
                            {roleTab === role && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>



            {/* Filter Section */}
            <FilterSection
                onAdd={() => setShowAddModal(true)}
                onSearch={handleSearch}

                showAddButton={activeTab === 'add'}
                addButtonText={`Add New User`}
                showUnblockAll={activeTab === 'block'}
                onUnblockAll={handleUnblockAll}

            />

            {/* Loading State */}
            {isLoading ? (
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading {roleTab.toLowerCase()} users...</p>
                </div>
            ) : (
                <>
                    {/* Data Table */}
                    <DataTable
                        columns={columns}
                        data={filteredUsers()}
                        actions={activeTab === 'add' ? addTabActions : blockTabActions}
                        actionsLayout="row"
                    />

                    {/* Pagination */}
                    {usersData && usersData.length > 0 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={filters.page || 1}
                                totalPages={totalPages}
                                totalItems={totalUsers}
                                itemsPerPage={filters.limit || 10}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}

                    {/* No Data Message */}
                    {(!usersData || usersData.length === 0) && (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <p className="text-gray-600">No {roleTab.toLowerCase()} users found</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="mt-4 px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3] transition-colors"
                            >
                                Add New {roleTab}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <UserFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddUser}
                isEdit={false}
                defaultRole={roleTab}
            />

            <UserFormModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                }}
                onSubmit={handleEditUser}
                initialData={editingUser ? {
                    name: editingUser.name,
                    email: editingUser.email,
                    schoolId: editingUser.schoolId || '',
                    role: editingUser.role,
                    phoneNo: editingUser.phoneNo,
                    password: '',
                    confirmPassword: '',
                    isActive: editingUser.isActive
                } : undefined}
                isEdit={true}
            />

            <ChangeRoleModal
                isOpen={showChangeRoleModal}
                onClose={() => {
                    setShowChangeRoleModal(false);
                    setEditingUser(null);
                }}
                onConfirm={handleChangeRole}
                currentRole={editingUser?.role || ''}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={
                    editingUser
                        ? 'User Updated Successfully'
                        : selectedAction === 'block'
                            ? 'User updated successfully'
                            : 'User Created Successfully'
                }
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedUserId(null);
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

export default ManageUserPage;