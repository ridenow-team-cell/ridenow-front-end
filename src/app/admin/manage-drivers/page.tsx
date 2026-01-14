"use client"
import React, { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import DriverFormModal from '@/components/ui/modals/DriverFormModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';

interface Driver {
    id: number;
    name: string;
    model: string;
    make: string;
    regName: string;
    colour: string;
    year: string;
    status: 'active' | 'blocked';
}

const ManageDriverPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'block'>('add');
    const [Driveres, setDriveres] = useState<Driver[]>([
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
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [DriverToBlock, setDriverToBlock] = useState<number | null>(null);

    // Table columns
    const columns = [
        { key: 'name', header: 'Image' },
        { key: 'model', header: 'School Id' },
        { key: 'regName', header: 'Phone Number' },
        { key: 'regName', header: 'Allocated Route' },
        { key: 'regName', header: 'Assigned Route' },

    ];

    // Actions for Add Driver tab
    const addTabActions = [
        {
            label: 'Edit',
            onClick: (Driver: Driver) => {
                setEditingDriver(Driver);
                setShowEditModal(true);
            }
        },
        {
            label: 'Block',
            onClick: (Driver: Driver) => {
                setDriverToBlock(Driver.id);
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Actions for Block Driver tab
    const blockTabActions = [
        {
            label: 'Unblock',
            onClick: (Driver: Driver) => handleUnblock(Driver.id),
            className: 'text-[#0066CC]'
        },
        {
            label: 'Delete',
            onClick: (Driver: Driver) => {
                setDriverToBlock(Driver.id);
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Filter Driveres based on active tab
    const filteredDriveres = activeTab === 'block'
        ? Driveres.filter(Driver => Driver.status === 'blocked')
        : Driveres;

    // Handlers
    const handleAddDriver = (formData: any) => {
        const newDriver: Driver = {
            id: Driveres.length + 1,
            name: formData.name,
            model: formData.model,
            make: formData.make,
            regName: formData.registrationName,
            colour: formData.colour,
            year: formData.year,
            status: 'active'
        };
        setDriveres([...Driveres, newDriver]);
        setShowAddModal(false);
        setShowSuccessModal(true);
    };

    const handleEditDriver = (formData: any) => {
        if (!editingDriver) return;

        const updatedDriveres = Driveres.map(Driver =>
            Driver.id === editingDriver.id
                ? { ...Driver, ...formData, regName: formData.registrationName }
                : Driver
        );
        setDriveres(updatedDriveres);
        setShowEditModal(false);
        setShowSuccessModal(true);
    };

    const handleBlock = (DriverId: number) => {
        setDriveres(Driveres.map(Driver =>
            Driver.id === DriverId ? { ...Driver, status: 'blocked' } : Driver
        ));
        setShowConfirmModal(false);
        setDriverToBlock(null);
    };

    const handleUnblock = (DriverId: number) => {
        setDriveres(Driveres.map(Driver =>
            Driver.id === DriverId ? { ...Driver, status: 'active' } : Driver
        ));
        setShowUnblockSuccessModal(true);
    };

    const handleUnblockAll = () => {
        setDriveres(Driveres.map(Driver =>
            Driver.status === 'blocked' ? { ...Driver, status: 'active' } : Driver
        ));
        setShowUnblockSuccessModal(true);
    };

    const handleConfirmBlock = () => {
        if (DriverToBlock) {
            handleBlock(DriverToBlock);
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
                        Add Driver
                        {activeTab === 'add' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('block')}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'block' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Block Driver
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
                addButtonText={'Add Driver'}
            />

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredDriveres}
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
            <DriverFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddDriver}
                isEdit={false}
            />

            <DriverFormModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingDriver(null);
                }}
                onSubmit={handleEditDriver}
                initialData={editingDriver}
                isEdit={true}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={editingDriver ? 'Driver Updated Successfully' : 'Driver Added Successfully'}
            />

            <SuccessModal
                isOpen={showUnblockSuccessModal}
                onClose={() => setShowUnblockSuccessModal(false)}
                title="Driver Unblocked Successfully"
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setDriverToBlock(null);
                }}
                onConfirm={handleConfirmBlock}
                title="Confirm Action"
                message="Are you sure you want to block this Driver?"
                confirmText="Yes"
                cancelText="No"
            />
        </div>
    );
};

export default ManageDriverPage;