"use client"
import React, { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import UserFormModal from '@/components/ui/modals/UserFormModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';

interface User {
    id: number;
    name: string;
    model: string;
    make: string;
    regName: string;
    colour: string;
    year: string;
    status: 'active' | 'blocked';
}

const ManageUserPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'block'>('add');
    const [Useres, setUseres] = useState<User[]>([
        { id: 1, name: 'dora_2023', model: 'Dora Davis', make: 'admin@ridenow.com', regName: '+869587...........', colour: 'Super Admin', year: '18/12/2023', status: 'active' },
        { id: 2, name: 'dora_2023', model: 'Dora Davis', make: 'admin@ridenow.com', regName: '+869587...........', colour: 'Admin', year: '18/12/2023', status: 'active' },
        { id: 3, name: 'dora_2023', model: 'Dora Davis', make: 'admin@ridenow.com', regName: '+869587...........', colour: 'Editor', year: '18/12/2023', status: 'blocked' },
        { id: 4, name: 'dora_2023', model: 'Dora Davis', make: 'admin@ridenow.com', regName: '+869587...........', colour: 'Super Admin', year: '18/12/2023', status: 'active' },
        { id: 5, name: 'dora_2023', model: 'Dora Davis', make: 'admin@ridenow.com', regName: '+869587...........', colour: 'Super Admin', year: '18/12/2023', status: 'blocked' },
    ]);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showUnblockSuccessModal, setShowUnblockSuccessModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [UserToBlock, setUserToBlock] = useState<number | null>(null);

    // Table columns
    const columns = [
        { key: 'name', header: 'Fullname' },
        { key: 'model', header: 'School Id' },
        { key: 'make', header: 'Email' },
        { key: 'regName', header: 'Phone Number' },
        { key: 'colour', header: 'Role' },

    ];

    // Actions for Add User tab
    const addTabActions = [
        {
            label: 'Edit',
            onClick: (User: User) => {
                setEditingUser(User);
                setShowEditModal(true);
            }
        },
        {
            label: 'Block',
            onClick: (User: User) => {
                setUserToBlock(User.id);
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Actions for Block User tab
    const blockTabActions = [
        {
            label: 'Unblock',
            onClick: (User: User) => handleUnblock(User.id),
            className: 'text-[#0066CC]'
        },
        {
            label: 'Delete',
            onClick: (User: User) => {
                setUserToBlock(User.id);
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Filter Useres based on active tab
    const filteredUseres = activeTab === 'block'
        ? Useres.filter(User => User.status === 'blocked')
        : Useres;

    // Handlers
    const handleAddUser = (formData: any) => {
        const newUser: User = {
            id: Useres.length + 1,
            name: formData.name,
            model: formData.model,
            make: formData.make,
            regName: formData.registrationName,
            colour: formData.colour,
            year: formData.year,
            status: 'active'
        };
        setUseres([...Useres, newUser]);
        setShowAddModal(false);
        setShowSuccessModal(true);
    };

    const handleEditUser = (formData: any) => {
        if (!editingUser) return;

        const updatedUseres = Useres.map(User =>
            User.id === editingUser.id
                ? { ...User, ...formData, regName: formData.registrationName }
                : User
        );
        setUseres(updatedUseres);
        setShowEditModal(false);
        setShowSuccessModal(true);
    };

    const handleBlock = (UserId: number) => {
        setUseres(Useres.map(User =>
            User.id === UserId ? { ...User, status: 'blocked' } : User
        ));
        setShowConfirmModal(false);
        setUserToBlock(null);
    };

    const handleUnblock = (UserId: number) => {
        setUseres(Useres.map(User =>
            User.id === UserId ? { ...User, status: 'active' } : User
        ));
        setShowUnblockSuccessModal(true);
    };

    const handleUnblockAll = () => {
        setUseres(Useres.map(User =>
            User.status === 'blocked' ? { ...User, status: 'active' } : User
        ));
        setShowUnblockSuccessModal(true);
    };

    const handleConfirmBlock = () => {
        if (UserToBlock) {
            handleBlock(UserToBlock);
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
                        Add User
                        {activeTab === 'add' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('block')}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'block' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Block User
                        {activeTab === 'block' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <FilterSection
                onAdd={() => setShowAddModal(true)}
                showAddButton={activeTab === 'add'}
                showUnblockAll={activeTab === 'block'}
                onUnblockAll={handleUnblockAll}
            />

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredUseres}
                actions={activeTab === 'add' ? addTabActions : blockTabActions}
            />

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

            {/* Modals */}
            <UserFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddUser}
                isEdit={false}
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
                    model: editingUser.model,
                    make: editingUser.make,
                    registrationName: editingUser.regName,
                    colour: editingUser.colour,
                    year: editingUser.year
                } : undefined}
                isEdit={true}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={editingUser ? 'User Updated Successfully' : 'User Added Successfully'}
            />

            <SuccessModal
                isOpen={showUnblockSuccessModal}
                onClose={() => setShowUnblockSuccessModal(false)}
                title="User Unblocked Successfully"
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setUserToBlock(null);
                }}
                onConfirm={handleConfirmBlock}
                title="Confirm Action"
                message="Are you sure you want to block this User?"
                confirmText="Yes"
                cancelText="No"
            />
        </div>
    );
};

export default ManageUserPage;