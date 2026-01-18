"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Search, Plus, QrCode, Ticket, Download, Eye, Edit, Trash2, CheckCircle, XCircle, AlertCircle, Clock, User, Bus, Route as RouteIcon, TrendingUp, TrendingDown } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import Pagination from '@/components/ui/Pagination';
import CreateTicketModal from '@/components/ui/modals/CreateTicketModal';
import TicketDetailsModal from '@/components/ui/modals/TicketDetailModal';
import SuccessModal from '@/components/ui/modals/SuccessModal';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import StatCard from '@/components/ui/StatCard';
import {
    useTickets,
    useCreateTicket,
    useUpdateTicket,
    useDeleteTicket,
    useCancelTicket,
    useCheckInTicket,
    useCompleteTicket,
    useGenerateQRCode,
    useTicketStatistics
} from '@/hooks/use-tickets';
import { ticketService } from '@/services/ticket-service';
import { TicketQueryParams } from '@/types/ticket';
import { toast } from 'react-hot-toast';

const TicketsPage = () => {
    const [filters, setFilters] = useState<TicketQueryParams>({
        page: 1,
        pageSize: 10,
        sortBy: 'bookingDate',
        sortOrder: 'desc'
    });

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<'delete' | 'cancel' | 'checkin' | 'complete' | 'refund'>('delete');

    // Hooks
    const { data: ticketsData, isLoading, refetch } = useTickets(filters);
    const { data: statistics } = useTicketStatistics();
    const createTicket = useCreateTicket();
    const updateTicket = useUpdateTicket();
    const deleteTicket = useDeleteTicket();
    const cancelTicket = useCancelTicket();
    const checkInTicket = useCheckInTicket();
    const completeTicket = useCompleteTicket();
    const generateQRCode = useGenerateQRCode();

    // Update date filters for statistics
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];

        // You could update statistics filters here
    }, []);

    // Table columns
    const columns = [
        {
            key: 'ticketNumber',
            header: 'Ticket ID',
            render: (ticket: any) => (
                <div className="font-mono text-sm text-gray-800">{ticket.ticketNumber}</div>
            )
        },
        {
            key: 'seatNumber',
            header: 'Seat',
            render: (ticket: any) => (
                <div className="font-medium text-gray-800">{ticket.seatNumber}</div>
            )
        },
        {
            key: 'price',
            header: 'Price',
            render: (ticket: any) => ticketService.formatPrice(ticket.price)
        },
        {
            key: 'status',
            header: 'Status',
            render: (ticket: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticketService.getStatusColor(ticket.status)}`}>
                    {ticket.status}
                </span>
            )
        },
        {
            key: 'paymentStatus',
            header: 'Payment',
            render: (ticket: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticketService.getPaymentStatusColor(ticket.paymentStatus)}`}>
                    {ticket.paymentStatus}
                </span>
            )
        },
        {
            key: 'bookingDate',
            header: 'Booking Date',
            render: (ticket: any) => ticketService.formatDate(ticket.bookingDate)
        },
        {
            key: 'qrCodeUrl',
            header: 'QR Code',
            render: (ticket: any) => (
                <div className="flex items-center gap-2">
                    {ticket.qrCodeUrl ? (
                        <>
                            <QrCode size={16} className="text-green-600" />
                            <span className="text-xs text-gray-500">Available</span>
                        </>
                    ) : (
                        <>
                            <QrCode size={16} className="text-gray-400" />
                            <span className="text-xs text-gray-400">Not generated</span>
                        </>
                    )}
                </div>
            )
        },
    ];

    // Actions for tickets
    const actions = [
        {
            label: 'View Details',
            onClick: (ticket: any) => {
                setSelectedTicketId(ticket.id);
                setShowDetailsModal(true);
            },
            icon: <Eye size={14} />
        },
        {
            label: 'Check In',
            onClick: (ticket: any) => {
                setSelectedTicketId(ticket.id);
                setSelectedAction('checkin');
                setShowConfirmModal(true);
            },
            icon: <CheckCircle size={14} />,
            condition: (ticket: any) => ticket.status === 'Booked'
        },
        {
            label: 'Mark Complete',
            onClick: (ticket: any) => {
                setSelectedTicketId(ticket.id);
                setSelectedAction('complete');
                setShowConfirmModal(true);
            },
            icon: <CheckCircle size={14} />,
            condition: (ticket: any) => ticket.status === 'CheckedIn'
        },
        {
            label: 'Generate QR',
            onClick: (ticket: any) => {
                generateQRCode.mutate(ticket.id, {
                    onSuccess: () => {
                        toast.success('QR code generated successfully');
                        refetch();
                    }
                });
            },
            icon: <QrCode size={14} />,
            condition: (ticket: any) => !ticket.qrCodeUrl
        },
        {
            label: 'Download QR',
            onClick: (ticket: any) => {
                if (ticket.qrCodeUrl) {
                    window.open(ticket.qrCodeUrl, '_blank');
                }
            },
            icon: <Download size={14} />,
            condition: (ticket: any) => !!ticket.qrCodeUrl
        },
        {
            label: 'Cancel Ticket',
            onClick: (ticket: any) => {
                setSelectedTicketId(ticket.id);
                setSelectedAction('cancel');
                setShowConfirmModal(true);
            },
            icon: <XCircle size={14} />,
            className: 'text-red-500',
            condition: (ticket: any) => ticket.status === 'Booked' || ticket.status === 'CheckedIn'
        },
        {
            label: 'Refund',
            onClick: (ticket: any) => {
                setSelectedTicketId(ticket.id);
                setSelectedAction('refund');
                setShowConfirmModal(true);
            },
            icon: <AlertCircle size={14} />,
            className: 'text-orange-500',
            condition: (ticket: any) => ticket.paymentStatus === 'Paid' && ticket.status !== 'Refunded'
        },
        {
            label: 'Delete',
            onClick: (ticket: any) => {
                setSelectedTicketId(ticket.id);
                setSelectedAction('delete');
                setShowConfirmModal(true);
            },
            icon: <Trash2 size={14} />,
            className: 'text-red-500',
            condition: (ticket: any) => ticket.status === 'Cancelled' || ticket.status === 'Completed'
        }
    ];

    // Filter actions based on ticket conditions
    const getFilteredActions = (ticket: any) => {
        return actions.filter(action =>
            !action.condition || action.condition(ticket)
        );
    };



    const ticketStats = [
        {
            label: 'Total Tickets Sold',
            value: statistics?.totalTickets?.toString() || '0',
            bgColor: '#343434', // Using hex color
            icon: '/assets/icons/ticket.png', // Image path
            trend: 'up',
            percentage: '12%',
            trendText: '+12% from last month',
            trendColor: 'text-green-500'
        },
        {
            label: 'Active Tickets',
            value: `${statistics?.bookedTickets || 0} / ${statistics?.checkedInTickets || 0}`,
            bgColor: '#343434',
            icon: '/assets/icons/revenue.png',
            trend: 'up',
            percentage: '8%',
            trendText: '+8 trips this week',
            trendColor: 'text-orange-500'
        },
        {
            label: 'Completion Rate',
            value: statistics?.totalTickets ?
                `${((statistics.completedTickets / statistics.totalTickets) * 100).toFixed(1)}%` : '0%',
            bgColor: '#343434',
            icon: '/assets/icons/seat.png',
            trend: 'info',
            additionalInfo: '12 seats reserved',
            trendText: '12 seats reserved',
            trendColor: 'text-blue-500'
        }
    ];

    // Handlers
    const handleCreateTicket = (formData: any) => {
        createTicket.mutate(formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                setShowSuccessModal(true);
                refetch();
            }
        });
    };

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleFilter = () => {
        // Advanced filtering logic can be added here
        console.log('Filter clicked', filters);
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleConfirmAction = () => {
        if (!selectedTicketId) return;

        switch (selectedAction) {
            case 'delete':
                deleteTicket.mutate(selectedTicketId, {
                    onSuccess: () => {
                        setShowConfirmModal(false);
                        setSelectedTicketId(null);
                        toast.success('Ticket deleted successfully');
                    }
                });
                break;
            case 'cancel':
                cancelTicket.mutate(selectedTicketId, {
                    onSuccess: () => {
                        setShowConfirmModal(false);
                        setSelectedTicketId(null);
                        toast.success('Ticket cancelled successfully');
                        refetch();
                    }
                });
                break;
            case 'checkin':
                checkInTicket.mutate(selectedTicketId, {
                    onSuccess: () => {
                        setShowConfirmModal(false);
                        setSelectedTicketId(null);
                        toast.success('Ticket checked in successfully');
                        refetch();
                    }
                });
                break;
            case 'complete':
                completeTicket.mutate(selectedTicketId, {
                    onSuccess: () => {
                        setShowConfirmModal(false);
                        setSelectedTicketId(null);
                        toast.success('Ticket marked as completed');
                        refetch();
                    }
                });
                break;
            case 'refund':
                // Note: Refund endpoint needs to be added to the service
                toast.error('Refund functionality coming soon');
                setShowConfirmModal(false);
                setSelectedTicketId(null);
                break;
        }
    };

    const getConfirmModalConfig = () => {
        switch (selectedAction) {
            case 'delete':
                return {
                    title: 'Delete Ticket',
                    message: 'Are you sure you want to delete this ticket? This action cannot be undone.',
                    confirmText: 'Delete',
                    confirmColor: 'bg-red-600 hover:bg-red-700'
                };
            case 'cancel':
                return {
                    title: 'Cancel Ticket',
                    message: 'Are you sure you want to cancel this ticket? The seat will be released for others.',
                    confirmText: 'Cancel Ticket',
                    confirmColor: 'bg-orange-600 hover:bg-orange-700'
                };
            case 'checkin':
                return {
                    title: 'Check In Ticket',
                    message: 'Mark this ticket as checked in? This will update the ticket status.',
                    confirmText: 'Check In',
                    confirmColor: 'bg-green-600 hover:bg-green-700'
                };
            case 'complete':
                return {
                    title: 'Complete Ticket',
                    message: 'Mark this ticket journey as completed?',
                    confirmText: 'Mark Complete',
                    confirmColor: 'bg-blue-600 hover:bg-blue-700'
                };
            case 'refund':
                return {
                    title: 'Refund Ticket',
                    message: 'Are you sure you want to refund this ticket? Payment status will be updated.',
                    confirmText: 'Refund',
                    confirmColor: 'bg-purple-600 hover:bg-purple-700'
                };
            default:
                return {
                    title: 'Confirm Action',
                    message: 'Are you sure you want to perform this action?',
                    confirmText: 'Confirm',
                    confirmColor: 'bg-[#0066CC] hover:bg-[#0055AA]'
                };
        }
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {ticketStats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Filter Section */}
            <FilterSection
                onAdd={() => setShowCreateModal(true)}
                onSearch={handleSearch}
                onFilter={handleFilter}
            // showAddButton={true}
            // addButtonText="Create Ticket"
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
                    <DataTable
                        columns={columns}
                        data={ticketsData.items || []}
                        actions={actions}
                        getFilteredActions={getFilteredActions}
                    />

                    {/* Pagination */}
                    {ticketsData && ticketsData.items.length > 0 && (
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
                    {(!ticketsData || ticketsData.items.length === 0) && (
                        <div className="bg-white rounded-lg p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Ticket size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-600 mb-2">No available booking tickets</p>
                            {/* <p className="text-gray-500 text-sm mb-4">Create your first ticket to get started</p> */}
                            {/* <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052a3] transition-colors"
                            >
                                Create Ticket
                            </button> */}
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <CreateTicketModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateTicket}
            />

            <TicketDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedTicketId(null);
                }}
                ticketId={selectedTicketId || ''}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Ticket Created Successfully"
                message="The ticket has been created and the seat has been booked."
                type="ticket"
            />

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedTicketId(null);
                }}
                onConfirm={handleConfirmAction}
                title={getConfirmModalConfig().title}
                message={getConfirmModalConfig().message}
                confirmText={getConfirmModalConfig().confirmText}
                cancelText="Cancel"
                confirmButtonClassName={getConfirmModalConfig().confirmColor}
            />
        </div>
    );
};

export default TicketsPage;


