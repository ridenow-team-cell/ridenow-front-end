"use client"
import React, { useState } from 'react';
import { Calendar, ChevronDown, Search, Plus, MoreVertical, QrCode, Ticket, Users, UserPlus, Shield, Download, Eye, Edit, Trash2 } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';
import StatCard from '@/components/ui/StatCard';
// import CreateTicketModal from '@/components/ui/modals/CreateTicketModal';

interface TicketData {
    id: number;
    ticketId: string;
    ticketOptions: string;
    price: string;
    qrCode: string;
}

const TicketsPage = () => {
    const [tickets, setTickets] = useState<TicketData[]>([
        { id: 1, ticketId: '07845678', ticketOptions: 'Daily', price: '500', qrCode: '+869587......' },
        { id: 2, ticketId: '07845679', ticketOptions: 'Weekly', price: '3,000', qrCode: '+869587......' },
        { id: 3, ticketId: '07845680', ticketOptions: 'Monthly', price: '10,000', qrCode: '+869587......' },
        { id: 4, ticketId: '07845681', ticketOptions: 'Daily', price: '500', qrCode: '+869587......' },
        { id: 5, ticketId: '07845682', ticketOptions: 'Daily', price: '500', qrCode: '+869587......' },
        { id: 6, ticketId: '07845683', ticketOptions: 'Student', price: '300', qrCode: '+869587......' },
        { id: 7, ticketId: '07845684', ticketOptions: 'Premium', price: '800', qrCode: '+869587......' },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const columns = [
        { key: 'ticketId', header: 'Ticket ID' },
        { key: 'ticketOptions', header: 'Ticket Options' },
        { key: 'price', header: 'Price' },
        {
            key: 'qrCode',
            header: 'QR Code',
            className: 'flex items-center gap-2'
        },
    ];

    const formatData = (ticket: TicketData) => ({
        ...ticket,
        price: `₦${ticket.price}`,
        qrCode: (
            <div className="flex items-center gap-2">
                <QrCode size={16} className="text-gray-500" />
                <span>{ticket.qrCode}</span>
            </div>
        ),
    });

    const formattedData = tickets.map(formatData);

    const actions = [
        {
            label: 'View Details',
            onClick: (ticket: TicketData) => console.log('View ticket:', ticket),
            icon: <Eye size={14} />
        },
        {
            label: 'Edit Ticket',
            onClick: (ticket: TicketData) => console.log('Edit ticket:', ticket),
            icon: <Edit size={14} />
        },
        {
            label: 'Download QR',
            onClick: (ticket: TicketData) => console.log('Download QR:', ticket),
            icon: <Download size={14} />
        },
        {
            label: 'Delete',
            onClick: (ticket: TicketData) => {
                setTickets(tickets.filter(t => t.id !== ticket.id));
            },
            icon: <Trash2 size={14} />,
            className: 'text-red-500'
        }
    ];

    const ticketStats = [
        {
            label: 'Total Tickets Sold',
            value: '345',
            bgColor: '#343434', // Using hex color
            icon: '/assets/icons/ticket.png', // Image path
            trend: 'up',
            percentage: '12%',
            trendText: '+12% from last month',
            trendColor: 'text-green-500'
        },
        {
            label: 'Sold Out Trips',
            value: '450',
            bgColor: '#343434',
            icon: '/assets/icons/revenue.png',
            trend: 'up',
            percentage: '8%',
            trendText: '+8 trips this week',
            trendColor: 'text-orange-500'
        },
        {
            label: 'Available Seats',
            value: '77',
            bgColor: '#343434',
            icon: '/assets/icons/seat.png',
            trend: 'info',
            additionalInfo: '12 seats reserved',
            trendText: '12 seats reserved',
            trendColor: 'text-blue-500'
        }
    ];

    return (
        <div className="p-4 sm:p-6">

            {/* Stats Cards */}
            <div className="grid bg-white rounded-md p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {ticketStats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
            {/* <div className="bg-white rounded-lg mb-6">
                <div className="flex justify-between w-full flex-wrap border-b">
                    <button

                        className={`px-8 py-4 text-base font-bold text-[#1E1E1E] font-medium relative`}
                    >
                        Create Ticket

                    </button>
                    <button

                        className={`px-8 py-4 text-base text-[#1E1E1E] relative`}
                    >
                        Invite New User

                    </button>
                    <button

                        className={`px-8 py-4 text-base text-[#1E1E1E] relative`}
                    >
                        Manage User

                    </button>
                    <button

                        className={`px-8 py-4 text-base text-[#1E1E1E] relative`}
                    >
                        Role Permission Mapping

                    </button>
                </div>
            </div> */}

            {/* Filter Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 w-full lg:w-auto">
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
                            <Calendar size={20} className="text-gray-400" />
                            <span className="text-sm text-gray-700">Dec 29,2025</span>
                            <span className="text-gray-400">-</span>
                            <span className="text-sm text-gray-700">Dec 30,2025</span>
                        </div>

                        <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-700">Filter</span>
                            <ChevronDown size={20} className="text-gray-400" />
                        </button>

                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 flex-1 w-full sm:w-auto">
                            <Search size={20} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="border-none outline-none text-sm flex-1 bg-transparent placeholder-gray-400 text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                        <button className="flex items-center justify-center gap-2 bg-[#E7A533] text-gray-800 px-6 py-2 rounded-lg hover:bg-[#d69420] transition-colors flex-1 lg:flex-initial">
                            <span className="text-base font-medium">Search</span>
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center justify-center gap-2 bg-[#0066CC] text-white px-6 py-2 rounded-lg hover:bg-[#0052a3] transition-colors flex-1 lg:flex-initial"
                        >
                            <Plus size={20} />
                            <span className="text-base font-medium">Create Ticket</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="overflow-x-auto">
                        <DataTable
                            columns={columns}
                            data={formattedData}
                            actions={actions}
                        />
                    </div>

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
                </div>
            </div>



        </div>
    );
};

export default TicketsPage;