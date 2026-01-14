"use client"
import React, { useState } from 'react';
import { Calendar, ChevronDown, Search, MoreVertical, FileText, MessageSquare, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import FilterSection from '@/components/ui/FilterSection';

interface SupportTicket {
    id: number;
    ticketId: string;
    staffStudentId: string;
    issueType: string;
    details: string;
    attachment: string;
    dateSubmitted: string;
    status: 'open' | 'in-progress' | 'resolved';
}

const SupportPage = () => {
    const [activeStatus, setActiveStatus] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
    const [tickets, setTickets] = useState<SupportTicket[]>([
        { id: 1, ticketId: 'dora_2023', staffStudentId: 'dora_2023', issueType: 'Payment', details: '+869587......', attachment: '+869587......', dateSubmitted: '18/12/2025', status: 'open' },
        { id: 2, ticketId: 'dora_2023', staffStudentId: 'dora_2023', issueType: 'Payment', details: '+869587......', attachment: '+869587......', dateSubmitted: '18/12/2025', status: 'in-progress' },
        { id: 3, ticketId: 'dora_2023', staffStudentId: 'dora_2023', issueType: 'Technical', details: '+869587......', attachment: '+869587......', dateSubmitted: '18/12/2025', status: 'resolved' },
        { id: 4, ticketId: 'dora_2023', staffStudentId: 'dora_2023', issueType: 'Payment', details: '+869587......', attachment: '+869587......', dateSubmitted: '18/12/2025', status: 'open' },
        { id: 5, ticketId: 'dora_2023', staffStudentId: 'dora_2023', issueType: 'Account', details: '+869587......', attachment: '+869587......', dateSubmitted: '18/12/2025', status: 'in-progress' },
    ]);

    const statusFilters = [
        { value: 'all', label: 'All', count: tickets.length },
        { value: 'open', label: 'Open', count: tickets.filter(t => t.status === 'open').length },
        { value: 'in-progress', label: 'In-Progress', count: tickets.filter(t => t.status === 'in-progress').length },
        { value: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length },
    ];

    const filteredTickets = activeStatus === 'all'
        ? tickets
        : tickets.filter(ticket => ticket.status === activeStatus);

    const columns = [
        { key: 'ticketId', header: 'Ticket ID' },
        { key: 'staffStudentId', header: 'Staff/Student ID' },
        { key: 'issueType', header: 'Issue Type' },
        { key: 'details', header: 'Details' },
        { key: 'attachment', header: 'Attachment' },
        { key: 'dateSubmitted', header: 'Date Submitted' },
        {
            key: 'status',
            header: 'Status',
            className: 'text-center'
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return (
                    <div className='flex flex-wrap gap-2'>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium bg-[#DADADA] text-[white]">

                            Open
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium bg-[#E7A53380] text-[#3F3F3F]">
                            In-Progress
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium bg-[#3EAE4980] text-[#010237]">

                            Resolved
                        </span>
                    </div>
                );
            case 'in-progress':
                return (
                    <div className='flex flex-wrap gap-2'>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium bg-[#DADADA] text-[white]">

                            Open
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium bg-[#E7A53380] text-[#3F3F3F]">
                            In-Progress
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium bg-[#3EAE4980] text-[#010237]">

                            Resolved
                        </span>
                    </div>
                );
            case 'resolved':
                return (
                    <div className='flex flex-wrap gap-2'>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium bg-[#DADADA] text-[white]">

                            Open
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium bg-[#E7A53380] text-[#3F3F3F]">
                            In-Progress
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-medium bg-[#3EAE4980] text-[#010237]">

                            Resolved
                        </span>
                    </div>
                );
            default:
                return null;
        }
    };

    const formatData = (ticket: SupportTicket) => ({
        ...ticket,
        status: getStatusBadge(ticket.status),
        details: (
            <div className="flex items-center gap-2">

                <span>{ticket.details}</span>
            </div>
        ),
        attachment: (
            <div className="flex items-center gap-2">

                <span>{ticket.attachment}</span>
            </div>
        ),
    });

    const formattedData = filteredTickets.map(formatData);

    const handleStatusChange = (status: string) => {
        if (['all', 'open', 'in-progress', 'resolved'].includes(status)) {
            setActiveStatus(status as any);
        }
    };

    const handleSearch = (value: string) => {
        // Implement search functionality
        console.log('Search:', value);
    };

    const actions = [
        {
            label: 'View Details',
            onClick: (ticket: SupportTicket) => console.log('View ticket:', ticket)
        },
        {
            label: 'Change Status',
            onClick: (ticket: SupportTicket) => console.log('Change status:', ticket)
        },
        {
            label: 'Assign to Staff',
            onClick: (ticket: SupportTicket) => console.log('Assign ticket:', ticket)
        },
        {
            label: 'Delete',
            onClick: (ticket: SupportTicket) => {
                setTickets(tickets.filter(t => t.id !== ticket.id));
            },
            className: 'text-red-500'
        }
    ];

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}


            {/* Filter Section */}
            <FilterSection
                onSearch={handleSearch}
                showAddButton={false}
            />


            {/* Tickets Table */}
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-[#343434] mb-4">Recent Tickets</h2>

                    <DataTable
                        columns={columns}
                        data={formattedData}

                    />

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

export default SupportPage;