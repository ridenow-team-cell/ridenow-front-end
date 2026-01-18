"use client"
import React, { useState } from 'react';
import { Calendar, User, MessageSquare, FileText, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Paperclip, Send } from 'lucide-react';
import BaseModal from './BaseModal';
import { useTicketDetails, useAddComment } from '@/hooks/use-support';
import { supportService } from '@/services/support-sevice';

interface SupportDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string;
}

const SupportDetailsModal: React.FC<SupportDetailsModalProps> = ({
    isOpen,
    onClose,
    ticketId
}) => {
    const { data: ticketDetails, isLoading, error } = useTicketDetails(ticketId);
    const [showActivityLog, setShowActivityLog] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isInternalComment, setIsInternalComment] = useState(false);

    const addComment = useAddComment();

    if (isLoading) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="xl">
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
                </div>
            </BaseModal>
        );
    }

    if (error || !ticketDetails) {
        return (
            <BaseModal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="xl">
                <div className="text-center p-8">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-red-500">Failed to load ticket details</p>
                </div>
            </BaseModal>
        );
    }

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        addComment.mutate(
            { id: ticketId, comment: newComment, isInternal: isInternalComment },
            {
                onSuccess: () => {
                    setNewComment('');
                    setIsInternalComment(false);
                }
            }
        );
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-xl font-bold text-gray-800">{ticketDetails.title}</h2>
                            {supportService.getStatusBadge(ticketDetails.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>Created: {supportService.formatDate(ticketDetails.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>Updated: {supportService.formatDate(ticketDetails.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Ticket #</div>
                        <div className="font-mono font-bold text-[#0066CC]">{ticketDetails.ticketNumber}</div>
                    </div>
                </div>

                {/* Priority and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={18} className="text-gray-600" />
                            <span className="font-medium text-gray-700">Priority</span>
                        </div>
                        {supportService.getPriorityBadge(ticketDetails.priority)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={18} className="text-gray-600" />
                            <span className="font-medium text-gray-700">Category</span>
                        </div>
                        <span className={`px-3 py-1 rounded-md text-sm font-medium ${supportService.getCategoryColor(ticketDetails.category)}`}>
                            {ticketDetails.category}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line">{ticketDetails.description}</p>
                </div>

                {/* Related Information */}
                {(ticketDetails.relatedBus || ticketDetails.relatedDriver || ticketDetails.relatedTrip) && (
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {ticketDetails.relatedBus && (
                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText size={16} className="text-blue-600" />
                                        <span className="font-medium text-gray-700">Related Bus</span>
                                    </div>
                                    <div className="text-gray-800">{ticketDetails.relatedBus.name}</div>
                                    <div className="text-sm text-gray-600">{ticketDetails.relatedBus.registrationName}</div>
                                </div>
                            )}
                            {ticketDetails.relatedDriver && (
                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User size={16} className="text-green-600" />
                                        <span className="font-medium text-gray-700">Related Driver</span>
                                    </div>
                                    <div className="text-gray-800">{ticketDetails.relatedDriver.name}</div>
                                    <div className="text-sm text-gray-600">{ticketDetails.relatedDriver.licenseNumber}</div>
                                </div>
                            )}
                            {ticketDetails.relatedTrip && (
                                <div className="bg-white rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-purple-600" />
                                        <span className="font-medium text-gray-700">Related Trip</span>
                                    </div>
                                    <div className="text-gray-800">{ticketDetails.relatedTrip.routeName}</div>
                                    <div className="text-sm text-gray-600">{supportService.formatDate(ticketDetails.relatedTrip.date)}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}





                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            // Handle edit action
                            onClose();
                        }}
                        className="px-6 py-2 bg-[#0066CC] text-white rounded-lg font-medium hover:bg-[#0055AA] transition-colors"
                    >
                        Update Ticket
                    </button>
                </div>
            </div>
        </BaseModal >
    );
};

export default SupportDetailsModal;