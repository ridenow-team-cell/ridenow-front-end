"use client"
import React from 'react';
import { QrCode, Ticket as TicketIcon, User, Calendar, Clock, MapPin, Bus, Route as RouteIcon, DollarSign, CheckCircle, XCircle, Printer, Download } from 'lucide-react';
import BaseModal from './BaseModal';
import { useTicketDetails } from '@/hooks/use-tickets';
import { ticketService } from '@/services/ticket-service';

interface TicketDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
    isOpen,
    onClose,
    ticketId
}) => {
    const { data: ticketDetails, isLoading, error } = useTicketDetails(ticketId);

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
                    <p className="text-red-500">Failed to load ticket details</p>
                </div>
            </BaseModal>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadQR = () => {
        if (ticketDetails.qrCodeUrl) {
            window.open(ticketDetails.qrCodeUrl, '_blank');
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Ticket Details" size="xl">
            <div className="space-y-6">
                {/* Ticket Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TicketIcon size={24} />
                                <h2 className="text-2xl font-bold">{ticketDetails.ticketNumber}</h2>
                            </div>
                            <p className="text-blue-100">Booking Date: {ticketService.formatDate(ticketDetails.bookingDate)}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{ticketService.formatPrice(ticketDetails.price)}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticketDetails.status === 'Booked' ? 'bg-blue-800 text-blue-100' :
                                        ticketDetails.status === 'CheckedIn' ? 'bg-green-800 text-green-100' :
                                            'bg-gray-800 text-gray-100'
                                    }`}>
                                    {ticketDetails.status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticketDetails.paymentStatus === 'Paid' ? 'bg-green-800 text-green-100' :
                                        ticketDetails.paymentStatus === 'Pending' ? 'bg-yellow-800 text-yellow-100' :
                                            'bg-red-800 text-red-100'
                                    }`}>
                                    {ticketDetails.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ticket Information</h3>
                            <div className="space-y-4">
                                {/* User Info */}
                                <div className="flex items-start gap-3">
                                    <User size={20} className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="font-medium text-gray-700">Passenger</div>
                                        <div className="text-gray-800">{ticketDetails.user.name}</div>
                                        <div className="text-sm text-gray-600">{ticketDetails.user.email}</div>
                                        <div className="text-sm text-gray-600">{ticketDetails.user.phoneNo}</div>
                                    </div>
                                </div>

                                {/* Schedule Info */}
                                <div className="flex items-start gap-3">
                                    <Calendar size={20} className="text-gray-400 mt-1" />
                                    <div>
                                        <div className="font-medium text-gray-700">Schedule</div>
                                        <div className="text-gray-800">
                                            {ticketService.formatDate(ticketDetails.schedule.departureTime)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Departure: {ticketDetails.schedule.departureTime}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Arrival: {ticketDetails.schedule.arrivalTime}
                                        </div>
                                    </div>
                                </div>

                                {/* Seat Info */}
                                <div className="flex items-start gap-3">
                                    {/* <Seat size={20} className="text-gray-400 mt-1" /> */}
                                    <div>
                                        <div className="font-medium text-gray-700">Seat Assignment</div>
                                        <div className="text-2xl font-bold text-gray-800">{ticketDetails.seatNumber}</div>
                                        <div className="text-sm text-gray-600">On Bus: {ticketDetails.bus.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                                {ticketDetails.qrCodeUrl ? (
                                    <img
                                        src={ticketDetails.qrCodeUrl}
                                        alt="Ticket QR Code"
                                        className="w-48 h-48"
                                    />
                                ) : (
                                    <div className="w-48 h-48 flex items-center justify-center bg-gray-200 rounded-lg">
                                        <QrCode size={64} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownloadQR}
                                    disabled={!ticketDetails.qrCodeUrl}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${ticketDetails.qrCodeUrl
                                            ? 'bg-[#0066CC] text-white hover:bg-[#0055AA]'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <Download size={16} />
                                    Download QR
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="px-4 py-2 bg-[#E7A533] text-gray-800 rounded-lg hover:bg-[#d69420] flex items-center gap-2"
                                >
                                    <Printer size={16} />
                                    Print Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Journey Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Route Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <RouteIcon size={20} className="text-gray-400 mt-1" />
                                <div>
                                    <div className="font-medium text-gray-700">Route</div>
                                    <div className="text-gray-800">{ticketDetails.route.name}</div>
                                    <div className="text-sm text-gray-600">{ticketDetails.route.description}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Bus size={20} className="text-gray-400 mt-1" />
                                <div>
                                    <div className="font-medium text-gray-700">Bus Details</div>
                                    <div className="text-gray-800">{ticketDetails.bus.name}</div>
                                    <div className="text-sm text-gray-600">
                                        Registration: {ticketDetails.bus.registrationName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Seats: {ticketDetails.bus.totalSeats}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stops Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Journey Stops</h3>
                        <div className="space-y-6">
                            {/* Pickup Stop */}
                            <div className="relative">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <MapPin size={16} className="text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-700">Pickup Point</div>
                                        <div className="text-gray-800">{ticketDetails.pickupStop.name}</div>
                                        <div className="text-sm text-gray-600">{ticketDetails.pickupStop.address}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Stop #{ticketDetails.pickupStop.order}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-green-200 ml-3.5"></div>
                            </div>

                            {/* Dropoff Stop */}
                            <div className="relative">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <MapPin size={16} className="text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-700">Dropoff Point</div>
                                        <div className="text-gray-800">{ticketDetails.dropoffStop.name}</div>
                                        <div className="text-sm text-gray-600">{ticketDetails.dropoffStop.address}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Stop #{ticketDetails.dropoffStop.order}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-gray-700">Booking Date:</span>
                            </div>
                            <span className="text-gray-800">{ticketService.formatDate(ticketDetails.bookingDate)}</span>
                        </div>
                        {ticketDetails.checkInTime && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-500" />
                                    <span className="text-gray-700">Check-in Time:</span>
                                </div>
                                <span className="text-gray-800">{ticketService.formatDate(ticketDetails.checkInTime)}</span>
                            </div>
                        )}
                        {ticketDetails.completedTime && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-blue-500" />
                                    <span className="text-gray-700">Completed Time:</span>
                                </div>
                                <span className="text-gray-800">{ticketService.formatDate(ticketDetails.completedTime)}</span>
                            </div>
                        )}
                        {ticketDetails.cancelledTime && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <XCircle size={16} className="text-red-500" />
                                    <span className="text-gray-700">Cancelled Time:</span>
                                </div>
                                <span className="text-gray-800">{ticketService.formatDate(ticketDetails.cancelledTime)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 bg-[#E7A533] text-gray-800 rounded-lg font-medium hover:bg-[#d69420] transition-colors"
                    >
                        Print Ticket
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

export default TicketDetailsModal;