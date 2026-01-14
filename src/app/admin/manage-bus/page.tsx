"use client"
import React, { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import BusFormModal from '@/components/ui/modals/BusFormModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';

interface Bus {
    id: number;
    name: string;
    model: string;
    make: string;
    regName: string;
    colour: string;
    year: string;
    status: 'active' | 'blocked';
}

const ManageBusPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'block'>('add');
    const [buses, setBuses] = useState<Bus[]>([
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
    const [editingBus, setEditingBus] = useState<Bus | null>(null);
    const [busToBlock, setBusToBlock] = useState<number | null>(null);

    // Table columns
    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'model', header: 'Model' },
        { key: 'make', header: 'Make' },
        { key: 'regName', header: 'Reg. Name' },
        { key: 'colour', header: 'Colour' },
        { key: 'year', header: 'Year' },
    ];

    // Actions for Add Bus tab
    const addTabActions = [
        {
            label: 'Edit',
            onClick: (bus: Bus) => {
                setEditingBus(bus);
                setShowEditModal(true);
            }
        },
        {
            label: 'Block',
            onClick: (bus: Bus) => {
                setBusToBlock(bus.id);
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Actions for Block Bus tab
    const blockTabActions = [
        {
            label: 'Unblock',
            onClick: (bus: Bus) => handleUnblock(bus.id),
            className: 'text-[#0066CC]'
        },
        {
            label: 'Delete',
            onClick: (bus: Bus) => {
                setBusToBlock(bus.id);
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Filter buses based on active tab
    const filteredBuses = activeTab === 'block'
        ? buses.filter(bus => bus.status === 'blocked')
        : buses;

    // Handlers
    const handleAddBus = (formData: any) => {
        const newBus: Bus = {
            id: buses.length + 1,
            name: formData.name,
            model: formData.model,
            make: formData.make,
            regName: formData.registrationName,
            colour: formData.colour,
            year: formData.year,
            status: 'active'
        };
        setBuses([...buses, newBus]);
        setShowAddModal(false);
        setShowSuccessModal(true);
    };

    const handleEditBus = (formData: any) => {
        if (!editingBus) return;

        const updatedBuses = buses.map(bus =>
            bus.id === editingBus.id
                ? { ...bus, ...formData, regName: formData.registrationName }
                : bus
        );
        setBuses(updatedBuses);
        setShowEditModal(false);
        setShowSuccessModal(true);
    };

    const handleBlock = (busId: number) => {
        setBuses(buses.map(bus =>
            bus.id === busId ? { ...bus, status: 'blocked' } : bus
        ));
        setShowConfirmModal(false);
        setBusToBlock(null);
    };

    const handleUnblock = (busId: number) => {
        setBuses(buses.map(bus =>
            bus.id === busId ? { ...bus, status: 'active' } : bus
        ));
        setShowUnblockSuccessModal(true);
    };

    const handleUnblockAll = () => {
        setBuses(buses.map(bus =>
            bus.status === 'blocked' ? { ...bus, status: 'active' } : bus
        ));
        setShowUnblockSuccessModal(true);
    };

    const handleConfirmBlock = () => {
        if (busToBlock) {
            handleBlock(busToBlock);
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
                        Add Bus
                        {activeTab === 'add' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E7A533]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('block')}
                        className={`px-8 py-4 text-base font-medium relative ${activeTab === 'block' ? 'text-gray-800' : 'text-gray-500'}`}
                    >
                        Block Bus
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
                data={filteredBuses}
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
                    registrationName: editingBus.regName,
                    colour: editingBus.colour,
                    year: editingBus.year
                } : undefined}
                isEdit={true}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={editingBus ? 'Bus Updated Successfully' : 'Bus Added Successfully'}
            />

            <SuccessModal
                isOpen={showUnblockSuccessModal}
                onClose={() => setShowUnblockSuccessModal(false)}
                title="Bus Unblocked Successfully"
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setBusToBlock(null);
                }}
                onConfirm={handleConfirmBlock}
                title="Confirm Action"
                message="Are you sure you want to block this bus?"
                confirmText="Yes"
                cancelText="No"
            />
        </div>
    );
};

export default ManageBusPage;