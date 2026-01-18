"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, MoreVertical, FileText, MessageSquare, CheckCircle, Clock, XCircle, AlertCircle, Filter, Download, Plus } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import Pagination from '@/components/ui/Pagination';
import SupportTicketModal from '@/components/ui/modals/SupportTicketModal';
import SupportDetailsModal from '@/components/ui/modals/SupportDetailsModal';
import AssignTicketModal from '@/components/ui/modals/AssignTicketModal';
import ChangeStatusModal from '@/components/ui/modals/ChangeStatusModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import { useTicketsPaged, useUpdateTicketStatus, useAssignTicket, useSupportStatistics } from '@/hooks/use-support';
import { supportService } from '@/services/support-sevice';
import { SupportTicket, SupportTicketQueryParams } from '@/types/support';
import { toast } from 'react-hot-toast';

const SupportPage = () => {
    const [activeStatus, setActiveStatus] = useState<'all' | 'Open' | 'In Progress' | 'Resolved'>('all');
    const [filters, setFilters] = useState<SupportTicketQueryParams>({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [selectedAction, setSelectedAction] = useState<'delete' | 'close' | 'reopen'>('delete');

    // Statistics
    const { data: statistics } = useSupportStatistics();

    // Tickets data
    const { data: ticketsData, isLoading, refetch } = useTicketsPaged(filters);
    const updateTicketStatus = useUpdateTicketStatus();
    const assignTicket = useAssignTicket();

    // Update filters when status changes
    useEffect(() => {
        if (activeStatus === 'all') {
            setFilters(prev => ({ ...prev, status: undefined, page: 1 }));
        } else {
            setFilters(prev => ({ ...prev, status: activeStatus, page: 1 }));
        }
    }, [activeStatus]);

    // Status filters
    const statusFilters = [
        { value: 'all', label: 'All', count: statistics?.totalTickets || 0 },
        { value: 'Open', label: 'Open', count: statistics?.openTickets || 0 },
        { value: 'In Progress', label: 'In-Progress', count: statistics?.inProgressTickets || 0 },
        { value: 'Resolved', label: 'Resolved', count: statistics?.resolvedTickets || 0 },
    ];

    // Columns
    const columns = [
        {
            key: 'ticketNumber',
            header: 'Ticket ID',
            render: (ticket: SupportTicket) => (
                <div className="font-medium text-[#0066CC]">{ticket.ticketNumber}</div>
            )
        },
        {
            key: 'title',
            header: 'Title',
            render: (ticket: SupportTicket) => (
                <div>
                    <div className="font-medium text-gray-800">{ticket.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description.substring(0, 50)}...</div>
                </div>
            )
        },
        {
            key: 'category',
            header: 'Category',
            render: (ticket: SupportTicket) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${supportService.getCategoryColor(ticket.category)}`}>
                    {ticket.category}
                </span>
            )
        },
        {
            key: 'priority',
            header: 'Priority',
            render: (ticket: SupportTicket) => ticket.priority
        },
        {
            key: 'createdAt',
            header: 'Date Submitted',
            render: (ticket: SupportTicket) => supportService.formatDate(ticket.createdAt)
        },
        {
            key: 'status',
            header: 'Status',
            render: (ticket: SupportTicket) => (ticket.status)
        },
    ];

    // Actions
    const actions = [
        {
            label: 'View Details',
            onClick: (ticket: SupportTicket) => {
                setSelectedTicket(ticket);
                setShowDetailsModal(true);
            }
        },
        {
            label: 'Change Status',
            onClick: (ticket: SupportTicket) => {
                setSelectedTicket(ticket);
                setSelectedAction('delete');
                setShowChangeStatusModal(true);
            }
        },
        {
            label: 'Assign to Staff',
            onClick: (ticket: SupportTicket) => {
                setSelectedTicket(ticket);
                setShowAssignModal(true);
            }
        },
        // {
        //     label: 'Add Comment',
        //     onClick: (ticket: SupportTicket) => {
        //         setSelectedTicket(ticket);
        //         // Open comment modal
        //         toast.success('Comment feature coming soon');
        //     }
        // },
        {
            label: 'Close Ticket',
            onClick: (ticket: SupportTicket) => {
                setSelectedTicket(ticket);
                setSelectedAction('close');
                setShowConfirmModal(true);
            },
            className: 'text-orange-500'
        },
        {
            label: 'Delete',
            onClick: (ticket: SupportTicket) => {
                setSelectedTicket(ticket);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            className: 'text-red-500'
        }
    ];

    // Handlers
    const handleStatusChange = (status: string) => {
        if (['all', 'Open', 'In Progress', 'Resolved'].includes(status)) {
            setActiveStatus(status as any);
        }
    };

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleChangeStatus = (newStatus: string) => {
        if (!selectedTicket) return;

        updateTicketStatus.mutate(
            { id: selectedTicket.id, status: newStatus },
            {
                onSuccess: () => {
                    setShowChangeStatusModal(false);
                    setSelectedTicket(null);
                    setShowSuccessModal(true);
                    refetch();
                }
            }
        );
    };

    const handleAssignTicket = (userId: string) => {
        if (!selectedTicket) return;

        assignTicket.mutate(
            { id: selectedTicket.id, userId },
            {
                onSuccess: () => {
                    setShowAssignModal(false);
                    setSelectedTicket(null);
                    toast.success('Ticket assigned successfully');
                    refetch();
                }
            }
        );
    };

    const handleCloseTicket = () => {
        if (!selectedTicket) return;
        handleChangeStatus('Closed');
        setShowConfirmModal(false);
    };

    const handleDeleteTicket = () => {
        if (!selectedTicket) return;
        // Implement delete functionality
        toast.success('Delete functionality coming soon');
        setShowConfirmModal(false);
    };

    const getConfirmModalConfig = () => {
        switch (selectedAction) {
            case 'close':
                return {
                    title: 'Close Ticket',
                    message: 'Are you sure you want to close this ticket? This will mark it as resolved.',
                    confirmText: 'Close Ticket',
                    onConfirm: handleCloseTicket
                };
            case 'delete':
                return {
                    title: 'Delete Ticket',
                    message: 'Are you sure you want to delete this ticket? This action cannot be undone.',
                    confirmText: 'Delete',
                    onConfirm: handleDeleteTicket
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
            {/* Header */}


            {/* Statistics Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Tickets</p>
                            <p className="text-2xl font-bold text-gray-800">{statistics?.totalTickets || 0}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Open</p>
                            <p className="text-2xl font-bold text-red-600">{statistics?.openTickets || 0}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">In Progress</p>
                            <p className="text-2xl font-bold text-orange-600">{statistics?.inProgressTickets || 0}</p>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Resolved</p>
                            <p className="text-2xl font-bold text-green-600">{statistics?.resolvedTickets || 0}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div> */}



            {/* Filter Section */}
            <FilterSection
                onAdd={() => setShowCreateModal(true)}
                onSearch={handleSearch}
                showAddButton={true}
                addButtonText="Create Ticket"
            />

            {/* Loading State */}
            {isLoading ? (
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading tickets...</p>
                </div>
            ) : (
                <>
                    {/* Tickets Table */}
                    <div className="bg-white rounded-lg overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-[#343434]">Recent Tickets</h2>

                            </div>

                            <DataTable
                                columns={columns}
                                data={ticketsData.items || []}
                                actions={actions}
                            />

                            {/* Pagination */}
                            {ticketsData && ticketsData.length > 0 && (
                                <div className="mt-6">
                                    <Pagination
                                        currentPage={ticketsData.page}
                                        totalPages={Math.ceil(ticketsData.total / ticketsData.pageSize)}
                                        totalItems={ticketsData.total}
                                        itemsPerPage={ticketsData.pageSize}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}

                            {/* No Data Message */}
                            {(!ticketsData || ticketsData.length === 0) && (
                                <div className="text-center py-8">
                                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">No tickets found</h3>
                                    <p className="text-gray-600 mb-4">
                                        {activeStatus === 'all'
                                            ? 'There are no support tickets yet.'
                                            : `There are no ${activeStatus.toLowerCase()} tickets.`
                                        }
                                    </p>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3] transition-colors"
                                    >
                                        Create First Ticket
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Modals */}
            <SupportTicketModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={() => {
                    setShowCreateModal(false);
                    setShowSuccessModal(true);
                    refetch();
                }}
            />

            <SupportDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedTicket(null);
                }}
                ticketId={selectedTicket?.id || ''}
            />

            <AssignTicketModal
                isOpen={showAssignModal}
                onClose={() => {
                    setShowAssignModal(false);
                    setSelectedTicket(null);
                }}
                onConfirm={handleAssignTicket}
                currentAssignee={selectedTicket?.assignedToUserId}
            />

            <ChangeStatusModal
                isOpen={showChangeStatusModal}
                onClose={() => {
                    setShowChangeStatusModal(false);
                    setSelectedTicket(null);
                }}
                onConfirm={handleChangeStatus}
                currentStatus={selectedTicket?.status || 'Open'}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Ticket Created Successfully"
                message="The support ticket has been created and assigned a tracking number."
                type="ticket"
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedTicket(null);
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

export default SupportPage;