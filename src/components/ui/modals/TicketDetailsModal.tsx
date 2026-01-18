"use client"
import React from 'react';
import { Paperclip, Calendar, User, AlertCircle, MessageSquare } from 'lucide-react';
import BaseModal from './BaseModal';

interface TicketDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: {
        ticketId: string;
        staffStudentId: string;
        issueType: string;
        details: string;
        attachment: string;
        dateSubmitted: string;
        status: string;
        priority?: string;
    };
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ isOpen, onClose, ticket }) => {
    const priorityColors = {
        High: 'bg-red-100 text-red-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-green-100 text-green-800'
    };

    const statusColors = {
        Open: 'bg-red-100 text-red-800',
        'In-Progress': 'bg-yellow-100 text-yellow-800',
        Resolved: 'bg-green-100 text-green-800'
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="lg">
            <div className="space-y-6">
                {/* Ticket Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Ticket ID</label>
                        <p className="font-medium text-gray-400">{ticket.ticketId}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Staff/Student ID</label>
                        <p className="font-medium text-gray-400">{ticket.staffStudentId}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Date Submitted</label>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="font-medium">{ticket.dateSubmitted}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm text-gray-600">Issue Type</label>
                        <p className="font-medium text-gray-400">{ticket.issueType}</p>
                    </div>
                </div>

                {/* Status and Priority */}
                <div className="flex items-center gap-4">
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Status</label>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                            {ticket.status}
                        </span>
                    </div>
                    {ticket.priority && (
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Priority</label>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[ticket.priority as keyof typeof priorityColors]}`}>
                                {ticket.priority}
                            </span>
                        </div>
                    )}
                </div>

                {/* Issue Details */}
                <div>
                    <label className="text-sm text-gray-600 block mb-2">Issue Details</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800">{ticket.details}</p>
                    </div>
                </div>

                {/* Attachment */}
                {ticket.attachment && (
                    <div>
                        <label className="text-sm text-gray-600 block mb-2">Attachment</label>
                        <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <Paperclip size={20} className="text-gray-500" />
                            <span className="text-gray-800 flex-1">{ticket.attachment}</span>
                            <button className="text-[#0066CC] text-sm font-medium hover:text-[#0055AA]">
                                Download
                            </button>
                        </div>
                    </div>
                )}

                {/* Response Section */}
                <div>
                    <label className="text-sm text-gray-600 block mb-2">Add Response</label>
                    <textarea
                        placeholder="Type your response here..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                        rows={4}
                    />
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="px-6 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-[#0055AA] transition-colors">
                        Send Response
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export { TicketDetailsModal };