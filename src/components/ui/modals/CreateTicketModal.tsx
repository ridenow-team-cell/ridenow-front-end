"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, User, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import BaseModal from './BaseModal';
import { useUsers } from '@/hooks/use-users';
import { useSchedules } from '@/hooks/use-schedules';
import { ticketService } from '@/services/ticket-service';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TicketFormData) => void;
}

interface TicketFormData {
    userId: string;
    scheduleId: string;
    seatNumber: string;
    pickupStopId: string;
    dropoffStopId: string;
    price: number;
    paymentStatus: string;
}

const paymentStatusOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Failed', label: 'Failed' }
];

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
    isOpen,
    onClose,
    onSubmit
}) => {
    const [formData, setFormData] = useState<TicketFormData>({
        userId: '',
        scheduleId: '',
        seatNumber: '',
        pickupStopId: '',
        dropoffStopId: '',
        price: 0,
        paymentStatus: 'Paid'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
    const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
    const [availableSeats, setAvailableSeats] = useState<string[]>([]);
    const [availableStops, setAvailableStops] = useState<any[]>([]);

    // Fetch data
    const { data: usersData } = useUsers({ isActive: true });
    const { data: schedulesData } = useSchedules({ isActive: true, status: 'Scheduled' });

    // Load schedule details when selected
    useEffect(() => {
        if (formData.scheduleId) {
            // Fetch available seats for the selected schedule
            // This would require an API endpoint to get available seats
            const fetchAvailableSeats = async () => {
                // Mock data - replace with actual API call
                const seats = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'];
                setAvailableSeats(seats);

                // Mock stops data
                const stops = [
                    { id: 'stop1', name: 'Central Station', order: 1 },
                    { id: 'stop2', name: 'University Campus', order: 2 },
                    { id: 'stop3', name: 'Business District', order: 3 }
                ];
                setAvailableStops(stops);
            };

            fetchAvailableSeats();
        }
    }, [formData.scheduleId]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.userId) {
            newErrors.userId = 'Please select a user';
        }

        if (!formData.scheduleId) {
            newErrors.scheduleId = 'Please select a schedule';
        }

        if (!formData.seatNumber) {
            newErrors.seatNumber = 'Please select a seat';
        }

        if (!formData.pickupStopId) {
            newErrors.pickupStopId = 'Please select pickup stop';
        }

        if (!formData.dropoffStopId) {
            newErrors.dropoffStopId = 'Please select dropoff stop';
        }

        if (formData.pickupStopId === formData.dropoffStopId) {
            newErrors.dropoffStopId = 'Pickup and dropoff stops must be different';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Please enter a valid price';
        }

        if (!formData.paymentStatus) {
            newErrors.paymentStatus = 'Please select payment status';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleUserSelect = (userId: string) => {
        const user = usersData?.find(u => u.id === userId);
        setFormData(prev => ({ ...prev, userId }));
        setShowUserDropdown(false);
        if (errors.userId) {
            setErrors(prev => ({ ...prev, userId: '' }));
        }
    };

    const handleScheduleSelect = (scheduleId: string) => {
        setFormData(prev => ({ ...prev, scheduleId, seatNumber: '', pickupStopId: '', dropoffStopId: '' }));
        setShowScheduleDropdown(false);
        setAvailableSeats([]);
        setAvailableStops([]);
        if (errors.scheduleId) {
            setErrors(prev => ({ ...prev, scheduleId: '' }));
        }
    };

    const handlePaymentSelect = (paymentStatus: string) => {
        setFormData(prev => ({ ...prev, paymentStatus }));
        setShowPaymentDropdown(false);
        if (errors.paymentStatus) {
            setErrors(prev => ({ ...prev, paymentStatus: '' }));
        }
    };

    const getSelectedUserName = () => {
        if (!formData.userId) return 'Select User';
        const user = usersData?.find(u => u.id === formData.userId);
        return user ? `${user.name} (${user.email})` : 'Select User';
    };

    const getSelectedScheduleName = () => {
        if (!formData.scheduleId) return 'Select Schedule';
        const schedule = schedulesData?.find(s => s.id === formData.scheduleId);
        return schedule ? `Schedule ${schedule.id.slice(0, 8)}...` : 'Select Schedule';
    };

    const formatScheduleInfo = (schedule: any) => {
        return `${schedule.departureTime} - ${schedule.arrivalTime}`;
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Ticket"
            size="xl"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* User Selection */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-2">
                            Select User *
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between ${errors.userId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <User size={20} className="text-gray-400" />
                                    <span>{getSelectedUserName()}</span>
                                </div>
                                <ChevronDown size={20} className="text-[#0066CC]" />
                            </button>
                            {showUserDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserDropdown(false)}
                                    />
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        <div className="p-2 border-b">
                                            <div className="flex items-center gap-2 px-2 py-1">
                                                <Search size={16} className="text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search users..."
                                                    className="w-full border-none outline-none text-sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>
                                        {usersData?.map(user => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => handleUserSelect(user.id)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <User size={16} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-400">{user.name}</div>
                                                    <div className="text-sm text-gray-600">{user.email}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {errors.userId && (
                            <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
                        )}
                    </div>

                    {/* Schedule Selection */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-2">
                            Select Schedule *
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowScheduleDropdown(!showScheduleDropdown)}
                                className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between ${errors.scheduleId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar size={20} className="text-gray-400" />
                                    <span>{getSelectedScheduleName()}</span>
                                </div>
                                <ChevronDown size={20} className="text-[#0066CC]" />
                            </button>
                            {showScheduleDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowScheduleDropdown(false)}
                                    />
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {schedulesData?.map(schedule => (
                                            <button
                                                key={schedule.id}
                                                type="button"
                                                onClick={() => handleScheduleSelect(schedule.id)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                            >
                                                <Calendar size={20} className="text-blue-600" />
                                                <div>
                                                    <div className="font-medium text-gray-400">Schedule {schedule.id.slice(0, 8)}...</div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatScheduleInfo(schedule)}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        {errors.scheduleId && (
                            <p className="text-red-500 text-sm mt-1">{errors.scheduleId}</p>
                        )}
                    </div>

                    {/* Seat Selection */}
                    {formData.scheduleId && (
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Select Seat *
                            </label>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                {availableSeats.map(seat => (
                                    <button
                                        key={seat}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, seatNumber: seat }))}
                                        className={`p-3 rounded-lg border flex items-center justify-center transition-colors ${formData.seatNumber === seat
                                            ? 'bg-[#0066CC] text-white border-[#0066CC]'
                                            : 'bg-white border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {/* <Seat size={16} /> */}
                                        <span className="ml-1 font-medium">{seat}</span>
                                    </button>
                                ))}
                            </div>
                            {errors.seatNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.seatNumber}</p>
                            )}
                        </div>
                    )}

                    {/* Pickup and Dropoff Stops */}
                    {formData.scheduleId && availableStops.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-800 text-base font-medium mb-2">
                                    Pickup Stop *
                                </label>
                                <div className="relative">
                                    <div className={`border rounded-lg ${errors.pickupStopId ? 'border-red-500' : 'border-gray-300'}`}>
                                        {availableStops.map(stop => (
                                            <button
                                                key={stop.id}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, pickupStopId: stop.id }))}
                                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 ${formData.pickupStopId === stop.id ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <MapPin size={16} className="text-gray-400" />
                                                <div className="text-left">
                                                    <div className="font-medium text-gray-400">{stop.name}</div>
                                                    <div className="text-sm text-gray-600">Stop #{stop.order}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {errors.pickupStopId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.pickupStopId}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-800 text-base font-medium mb-2">
                                    Dropoff Stop *
                                </label>
                                <div className="relative">
                                    <div className={`border rounded-lg ${errors.dropoffStopId ? 'border-red-500' : 'border-gray-300'}`}>
                                        {availableStops
                                            .filter(stop => stop.id !== formData.pickupStopId)
                                            .map(stop => (
                                                <button
                                                    key={stop.id}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, dropoffStopId: stop.id }))}
                                                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 ${formData.dropoffStopId === stop.id ? 'bg-blue-50' : ''
                                                        }`}
                                                >
                                                    <MapPin size={16} className="text-gray-400" />
                                                    <div className="text-left">
                                                        <div className="font-medium text-gray-400">{stop.name}</div>
                                                        <div className="text-sm text-gray-600">Stop #{stop.order}</div>
                                                    </div>
                                                </button>
                                            ))}
                                    </div>
                                </div>
                                {errors.dropoffStopId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.dropoffStopId}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Price and Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Price (₦) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter ticket price"
                                    min="0"
                                    step="0.01"
                                    className={`w-full px-4 py-3 pl-12 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.price ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Payment Status *
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                                    className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between ${errors.paymentStatus ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span>{formData.paymentStatus}</span>
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </button>
                                {showPaymentDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowPaymentDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                                            {paymentStatusOptions.map(option => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => handlePaymentSelect(option.value)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-500"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            {errors.paymentStatus && (
                                <p className="text-red-500 text-sm mt-1">{errors.paymentStatus}</p>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {formData.userId && formData.scheduleId && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-800 mb-2">Ticket Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">User:</span>
                                    <span className="font-medium">{getSelectedUserName()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Schedule:</span>
                                    <span className="font-medium">{getSelectedScheduleName()}</span>
                                </div>
                                {formData.seatNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Seat:</span>
                                        <span className="font-medium">{formData.seatNumber}</span>
                                    </div>
                                )}
                                {formData.price > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Price:</span>
                                        <span className="font-medium">{ticketService.formatPrice(formData.price)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 bg-[#E7A533] text-gray-800 rounded-lg text-base font-medium hover:bg-[#d69420] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-[#0066CC] text-white rounded-lg text-base font-medium hover:bg-[#0052a3] transition-colors"
                    >
                        Create Ticket
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default CreateTicketModal;