"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, Upload, X, AlertCircle, FileText, User, Bus, Car, CreditCard, Users } from 'lucide-react';
import BaseModal from './BaseModal';
import { useCreateTicket } from '@/hooks/use-support';
import { useUsers } from '@/hooks/use-users';
import { useBuses } from '@/hooks/use-bus';
import { useDrivers } from '@/hooks/use-drivers';
import { useRoutes } from '@/hooks/use-routes';

interface SupportTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    currentUserId?: string; // Current logged-in user ID
}

interface TicketFormData {
    title: string;
    description: string;
    category: string;
    priority: string;
    assignedToUserId: string | null;
    relatedBusId: string | null;
    relatedDriverId: string | null;
    relatedTripId: string | null;
    attachments: File[];
}

const categories = [
    { value: 'Service Issues', label: 'Service Issues', icon: Bus },
    { value: 'Payment', label: 'Payment', icon: CreditCard },
    { value: 'Technical', label: 'Technical', icon: FileText },
    { value: 'Account', label: 'Account', icon: User },
    { value: 'Other', label: 'Other', icon: AlertCircle }
];

const priorities = [
    { value: 'Low', label: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'Medium', label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'High', label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'Critical', label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100' }
];

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    currentUserId = '696ba3d3f557fb384f3bfd65' // Default or get from auth
}) => {
    const [formData, setFormData] = useState<TicketFormData>({
        title: '',
        description: '',
        category: 'Service Issues',
        priority: 'Medium',
        assignedToUserId: null,
        relatedBusId: null,
        relatedDriverId: null,
        relatedTripId: null,
        attachments: []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showStaffDropdown, setShowStaffDropdown] = useState(false);
    const [showBusDropdown, setShowBusDropdown] = useState(false);
    const [showDriverDropdown, setShowDriverDropdown] = useState(false);
    const [showRouteDropdown, setShowRouteDropdown] = useState(false);

    // Fetch data for dropdowns
    const { data: usersData } = useUsers({ role: 'Admin' });
    const { data: busesData } = useBuses({ status: 'Available' });
    const { data: driversData } = useDrivers({ status: 'Active' });
    const { data: routesData } = useRoutes({ status: 'Active' });

    const createTicket = useCreateTicket();

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 20) {
            newErrors.description = 'Description must be at least 20 characters';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.priority) {
            newErrors.priority = 'Priority is required';
        }

        // AssignedToUserId is required by API, but can be null
        if (formData.assignedToUserId === undefined) {
            newErrors.assignedToUserId = 'Please select an assignee (or choose "Unassigned")';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Prepare form data with all required fields
        const ticketData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            priority: formData.priority,
            createdByUserId: currentUserId,
            assignedToUserId: formData.assignedToUserId,
            relatedBusId: formData.relatedBusId,
            relatedDriverId: formData.relatedDriverId,
            relatedTripId: formData.relatedTripId,
            status: 'Open'
        };

        createTicket.mutate(ticketData, {
            onSuccess: () => {
                onSubmit();
            }
        });
    };

    const handleCategorySelect = (category: string) => {
        setFormData(prev => ({ ...prev, category }));
        setShowCategoryDropdown(false);
        if (errors.category) {
            setErrors(prev => ({ ...prev, category: '' }));
        }
    };

    const handlePrioritySelect = (priority: string) => {
        setFormData(prev => ({ ...prev, priority }));
        setShowPriorityDropdown(false);
        if (errors.priority) {
            setErrors(prev => ({ ...prev, priority: '' }));
        }
    };

    const handleStaffSelect = (userId: string | null) => {
        setFormData(prev => ({ ...prev, assignedToUserId: userId }));
        setShowStaffDropdown(false);
        if (errors.assignedToUserId) {
            setErrors(prev => ({ ...prev, assignedToUserId: '' }));
        }
    };

    const handleBusSelect = (busId: string | null) => {
        setFormData(prev => ({ ...prev, relatedBusId: busId }));
        setShowBusDropdown(false);
    };

    const handleDriverSelect = (driverId: string | null) => {
        setFormData(prev => ({ ...prev, relatedDriverId: driverId }));
        setShowDriverDropdown(false);
    };

    const handleRouteSelect = (routeId: string | null) => {
        setFormData(prev => ({ ...prev, relatedTripId: routeId }));
        setShowRouteDropdown(false);
    };

    const getCurrentCategory = () => {
        const category = categories.find(c => c.value === formData.category);
        return category || categories[0];
    };

    const getCurrentPriority = () => {
        const priority = priorities.find(p => p.value === formData.priority);
        return priority || priorities[1];
    };

    const getCurrentStaff = () => {
        if (formData.assignedToUserId === null) {
            return { id: null, name: 'Unassigned', email: '', role: 'Not assigned' };
        }
        const user = usersData?.find(u => u.id === formData.assignedToUserId);
        return user || { id: null, name: 'Select Staff', email: '', role: '' };
    };

    const getCurrentBus = () => {
        if (formData.relatedBusId === null) {
            return { id: null, name: 'None', registrationName: '' };
        }
        const bus = busesData?.find(b => b.id === formData.relatedBusId);
        return bus || { id: null, name: 'Select Bus', registrationName: '' };
    };

    const getCurrentDriver = () => {
        if (formData.relatedDriverId === null) {
            return { id: null, name: 'None', licenseNumber: '' };
        }
        const driver = driversData?.find(d => d.id === formData.relatedDriverId);
        return driver || { id: null, name: 'Select Driver', licenseNumber: '' };
    };

    const getCurrentRoute = () => {
        if (formData.relatedTripId === null) {
            return { id: null, name: 'None', description: '' };
        }
        const route = routesData?.find(r => r.id === formData.relatedTripId);
        return route || { id: null, name: 'Select Route', description: '' };
    };

    const currentCategory = getCurrentCategory();
    const currentPriority = getCurrentPriority();
    const currentStaff = getCurrentStaff();
    const currentBus = getCurrentBus();
    const currentDriver = getCurrentDriver();
    const currentRoute = getCurrentRoute();

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Support Ticket"
            size="xl"
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Brief description of the issue"
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Provide detailed information about the issue..."
                            rows={4}
                            className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0066CC] ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                            Please include relevant details such as date, time, bus/route number, and any error messages.
                        </p>
                    </div>

                    {/* Category and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Category *
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between ${errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <currentCategory.icon size={20} className="text-gray-600" />
                                        <span>{currentCategory.label}</span>
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </button>
                                {showCategoryDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowCategoryDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {categories.map(category => {
                                                const Icon = category.icon;
                                                return (
                                                    <button
                                                        key={category.value}
                                                        type="button"
                                                        onClick={() => handleCategorySelect(category.value)}
                                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                                    >
                                                        <Icon size={20} className="text-gray-600" />
                                                        <span>{category.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                            {errors.category && (
                                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                            )}
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Priority *
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                                    className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between ${errors.priority ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${currentPriority.bgColor} ${currentPriority.color}`}>
                                            {currentPriority.label}
                                        </span>
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </button>
                                {showPriorityDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowPriorityDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {priorities.map(priority => (
                                                <button
                                                    key={priority.value}
                                                    type="button"
                                                    onClick={() => handlePrioritySelect(priority.value)}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                                >
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                                                        {priority.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            {errors.priority && (
                                <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
                            )}
                        </div>
                    </div>

                    {/* Assignment Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Assign To Staff */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Assign To *
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                                    className={`w-full px-4 py-3 border rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between ${errors.assignedToUserId ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User size={16} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-400">{currentStaff.name}</div>
                                            <div className="text-sm text-gray-600">{currentStaff.role}</div>
                                        </div>
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </button>
                                {showStaffDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowStaffDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {/* Unassigned option */}
                                            <button
                                                type="button"
                                                onClick={() => handleStaffSelect(null)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-500"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <Users size={16} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-400">Unassigned</div>
                                                    <div className="text-sm">Assign later</div>
                                                </div>
                                            </button>

                                            {/* Staff members */}
                                            {usersData?.map(user => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => handleStaffSelect(user.id)}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <User size={16} className="text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-400">{user.fullName || user.name}</div>
                                                        <div className="text-sm text-gray-600">{user.role}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            {errors.assignedToUserId && (
                                <p className="text-red-500 text-sm mt-1">{errors.assignedToUserId}</p>
                            )}
                        </div>

                        {/* Related Bus (Optional) */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Related Bus (Optional)
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowBusDropdown(!showBusDropdown)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <Bus size={20} className="text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-400">{currentBus.name}</div>
                                            {currentBus.registrationName && (
                                                <div className="text-sm text-gray-600">{currentBus.registrationName}</div>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </button>
                                {showBusDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowBusDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <button
                                                type="button"
                                                onClick={() => handleBusSelect(null)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-500"
                                            >
                                                <Bus size={20} />
                                                <div>
                                                    <div className="font-medium text-gray-400">None</div>
                                                    <div className="text-sm">No bus related</div>
                                                </div>
                                            </button>

                                            {busesData?.map(bus => (
                                                <button
                                                    key={bus.id}
                                                    type="button"
                                                    onClick={() => handleBusSelect(bus.id)}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                                >
                                                    <Bus size={20} className="text-blue-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-400">{bus.name}</div>
                                                        <div className="text-sm text-gray-600">{bus.registrationName}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Driver and Route */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Related Driver (Optional) */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Related Driver (Optional)
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowDriverDropdown(!showDriverDropdown)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <User size={20} className="text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-400">{currentDriver.name}</div>
                                            {currentDriver.licenseNumber && (
                                                <div className="text-sm text-gray-600">{currentDriver.licenseNumber}</div>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </button>
                                {showDriverDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowDriverDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <button
                                                type="button"
                                                onClick={() => handleDriverSelect(null)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-500"
                                            >
                                                <User size={20} />
                                                <div>
                                                    <div className="font-medium text-gray-400">None</div>
                                                    <div className="text-sm">No driver related</div>
                                                </div>
                                            </button>

                                            {driversData?.map(driver => (
                                                <button
                                                    key={driver.id}
                                                    type="button"
                                                    onClick={() => handleDriverSelect(driver.id)}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                                >
                                                    <User size={20} className="text-green-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-400">{driver.fullName || driver.name}</div>
                                                        <div className="text-sm text-gray-600">{driver.licenseNumber}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Related Route (Optional) */}
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-2">
                                Related Route (Optional)
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowRouteDropdown(!showRouteDropdown)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-800 focus:outline-none focus:border-[#0066CC] flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-gray-600" />
                                        <div>
                                            <div className="font-medium text-gray-400">{currentRoute.name}</div>
                                            {currentRoute.description && (
                                                <div className="text-sm text-gray-600 truncate">{currentRoute.description}</div>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronDown size={20} className="text-[#0066CC]" />
                                </button>
                                {showRouteDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowRouteDropdown(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            <button
                                                type="button"
                                                onClick={() => handleRouteSelect(null)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-500"
                                            >
                                                <FileText size={20} />
                                                <div>
                                                    <div className="font-medium text-gray-400">None</div>
                                                    <div className="text-sm">No route related</div>
                                                </div>
                                            </button>

                                            {routesData?.map(route => (
                                                <button
                                                    key={route.id}
                                                    type="button"
                                                    onClick={() => handleRouteSelect(route.id)}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                                                >
                                                    <FileText size={20} className="text-purple-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-400">{route.name}</div>
                                                        <div className="text-sm text-gray-600 truncate">{route.description}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* File Attachments */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-2">
                            Attachments (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-3">
                                Drag & drop files here or click to browse
                            </p>
                            <input
                                type="file"
                                id="file-upload"
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                            />
                            <label
                                htmlFor="file-upload"
                                className="inline-block px-6 py-2 bg-[#0066CC] text-white rounded-lg font-medium hover:bg-[#0055AA] transition-colors cursor-pointer"
                            >
                                Browse Files
                            </label>
                            <p className="text-sm text-gray-500 mt-3">
                                Supported files: images, PDF, Word, Excel (Max 10MB each)
                            </p>
                        </div>

                        {/* File List */}
                        {formData.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {formData.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-3">
                                            <FileText size={20} className="text-gray-600" />
                                            <div>
                                                <p className="font-medium text-gray-800">{file.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="p-1 text-gray-400 hover:text-red-500"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
                        disabled={createTicket.isPending}
                    >
                        {createTicket.isPending ? 'Creating...' : 'Create Ticket'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default SupportTicketModal;