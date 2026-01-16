"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Stop {
    id: number;
    name: string;
    lat: string;
    lng: string;
    isExpanded: boolean;
}

interface ScheduleFormData {
    route: string;
    bus: string;
    driver: string;
    departureTime: string;
    arrivalTime: string;
    selectedDays: string[];
    numberOfSeats: number;
    seatLayout: ('available' | 'booked' | 'empty')[][];
    stops: Stop[];
}

const AddSchedulePage = () => {
    const router = useRouter();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Initialize seat layout - 4 rows x 11 columns
    const initializeSeatLayout = (): ('available' | 'booked' | 'empty')[][] => {
        const layout: ('available' | 'booked' | 'empty')[][] = [];
        // First 3 rows
        for (let i = 0; i < 3; i++) {
            layout.push([
                'available', 'available', 'available', 'available', 'booked',
                'empty',
                'booked', 'booked', 'available', 'available', 'available'
            ]);
        }
        // Last row with more empty seats
        layout.push([
            'available', 'available', 'available', 'available', 'booked',
            'empty',
            'empty', 'empty', 'empty', 'empty', 'empty'
        ]);
        return layout;
    };

    const [formData, setFormData] = useState<ScheduleFormData>({
        route: 'Route 1',
        bus: 'Bus 01',
        driver: 'John Doe',
        departureTime: '08:00 AM',
        arrivalTime: '04:30 PM',
        selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        numberOfSeats: 24,
        seatLayout: initializeSeatLayout(),
        stops: [
            { id: 1, name: 'Stop 1: Main Gate', lat: '6.5244', lng: '3.3792', isExpanded: false },
            { id: 2, name: 'Stop 2: Library', lat: '6.5250', lng: '3.3780', isExpanded: false }
        ]
    });

    const toggleDay = (day: string) => {
        setFormData(prev => ({
            ...prev,
            selectedDays: prev.selectedDays.includes(day)
                ? prev.selectedDays.filter(d => d !== day)
                : [...prev.selectedDays, day]
        }));
    };

    const updateSeats = (increment: boolean) => {
        setFormData(prev => ({
            ...prev,
            numberOfSeats: Math.max(0, prev.numberOfSeats + (increment ? 1 : -1))
        }));
    };

    const toggleSeat = (rowIndex: number, colIndex: number) => {
        const newLayout = formData.seatLayout.map((row, rIdx) =>
            row.map((seat, cIdx) => {
                if (rIdx === rowIndex && cIdx === colIndex) {
                    if (seat === 'empty') return 'empty';
                    return seat === 'available' ? 'booked' : 'available';
                }
                return seat;
            })
        );
        setFormData(prev => ({ ...prev, seatLayout: newLayout }));
    };

    const toggleStopExpansion = (stopId: number) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.map(stop =>
                stop.id === stopId ? { ...stop, isExpanded: !stop.isExpanded } : stop
            )
        }));
    };

    const addStop = () => {
        const newStop: Stop = {
            id: Date.now(),
            name: `Stop ${formData.stops.length + 1}: `,
            lat: '',
            lng: '',
            isExpanded: true
        };
        setFormData(prev => ({ ...prev, stops: [...prev.stops, newStop] }));
    };

    const deleteStop = (stopId: number) => {
        setFormData(prev => ({
            ...prev,
            stops: prev.stops.filter(stop => stop.id !== stopId)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Schedule submitted:', formData);

        // After submission, navigate back to schedules page
        router.push('/admin/routes-schedules'); // Adjust the path as needed
    };

    const handleCancel = () => {
        router.back(); // Go back to previous page
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header with back button */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-800">Add New Schedule</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Select Route */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Select Route</label>
                        <div className="relative">
                            <select
                                value={formData.route}
                                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 appearance-none focus:outline-none focus:border-[#0066CC]"
                            >
                                <option>Route 1</option>
                                <option>Route 2</option>
                                <option>Route 3</option>
                            </select>
                            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                        </div>
                    </div>

                    {/* Select Bus and Driver */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-3">Select Bus</label>
                            <div className="relative">
                                <select
                                    value={formData.bus}
                                    onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 appearance-none focus:outline-none focus:border-[#0066CC]"
                                >
                                    <option>Bus 01</option>
                                    <option>Bus 02</option>
                                    <option>Bus 03</option>
                                </select>
                                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-3">Select Driver</label>
                            <div className="relative">
                                <select
                                    value={formData.driver}
                                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 appearance-none focus:outline-none focus:border-[#0066CC]"
                                >
                                    <option>John Doe</option>
                                    <option>Jane Smith</option>
                                    <option>Mike Johnson</option>
                                </select>
                                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Departure and Arrival Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-3">Departure Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.departureTime}
                                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#0066CC]"
                                    placeholder="08:00 AM"
                                />
                                <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-800 text-base font-medium mb-3">Arrival Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.arrivalTime}
                                    onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-[#0066CC]"
                                    placeholder="04:30 PM"
                                />
                                <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    {/* Select Days */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Select Days</label>
                        <div className="flex flex-wrap gap-2">
                            {days.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDay(day)}
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${formData.selectedDays.includes(day)
                                        ? 'bg-[#E7A533] text-white'
                                        : 'bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Number of Seats */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Number of Seats</label>
                        <div className="flex items-center gap-0 w-fit border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() => updateSeats(false)}
                                className="px-6 py-3 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-2xl text-gray-600">−</span>
                            </button>
                            <div className="px-8 py-3 bg-white border-x border-gray-300">
                                <span className="text-xl font-medium text-gray-800">{formData.numberOfSeats}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => updateSeats(true)}
                                className="px-6 py-3 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-2xl text-gray-600">+</span>
                            </button>
                        </div>
                    </div>

                    {/* Seat Layout */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Seat Layout</label>
                        <div className="border border-gray-300 rounded-lg p-6 overflow-x-auto">
                            <div className="flex items-start gap-2 mb-4">
                                <ChevronUp size={20} className="text-gray-400 mt-1" />
                                <div className="flex-1 space-y-2">
                                    {formData.seatLayout.map((row, rowIndex) => (
                                        <div key={rowIndex} className="flex gap-2">
                                            {row.map((seat, colIndex) => (
                                                <button
                                                    key={`${rowIndex}-${colIndex}`}
                                                    type="button"
                                                    onClick={() => toggleSeat(rowIndex, colIndex)}
                                                    disabled={seat === 'empty'}
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${seat === 'available'
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : seat === 'booked'
                                                            ? 'bg-red-500 hover:bg-red-600'
                                                            : 'bg-gray-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {seat === 'available' && (
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                    {seat === 'booked' && (
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-8 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-800 font-medium">Available Seat</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-800 font-medium">Booked Seat</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stops */}
                    <div>
                        <label className="block text-gray-800 text-base font-medium mb-3">Stops</label>
                        <div className="border border-gray-300 rounded-lg p-4 space-y-2">
                            {formData.stops.map((stop) => (
                                <div key={stop.id} className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleStopExpansion(stop.id)}
                                            className="p-1 text-gray-600 hover:text-gray-800"
                                        >
                                            {stop.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        <ChevronDown size={20} className="text-gray-400" />
                                        <span className="flex-1 text-gray-800 font-medium">{stop.name}</span>
                                        <span className="text-gray-600">{stop.lat}</span>
                                        <span className="text-gray-600">{stop.lng}</span>
                                        <button
                                            type="button"
                                            onClick={() => deleteStop(stop.id)}
                                            className="p-1 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    {stop.isExpanded && (
                                        <div className="mt-3 pl-9 space-y-3">
                                            <input
                                                type="text"
                                                value={stop.name}
                                                onChange={(e) => {
                                                    const newStops = formData.stops.map(s =>
                                                        s.id === stop.id ? { ...s, name: e.target.value } : s
                                                    );
                                                    setFormData({ ...formData, stops: newStops });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Stop name"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={stop.lat}
                                                    onChange={(e) => {
                                                        const newStops = formData.stops.map(s =>
                                                            s.id === stop.id ? { ...s, lat: e.target.value } : s
                                                        );
                                                        setFormData({ ...formData, stops: newStops });
                                                    }}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Latitude"
                                                />
                                                <input
                                                    type="text"
                                                    value={stop.lng}
                                                    onChange={(e) => {
                                                        const newStops = formData.stops.map(s =>
                                                            s.id === stop.id ? { ...s, lng: e.target.value } : s
                                                        );
                                                        setFormData({ ...formData, stops: newStops });
                                                    }}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Longitude"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addStop}
                                className="flex items-center gap-2 px-4 py-2 bg-[#E7A533] text-gray-800 rounded-lg font-medium hover:bg-[#d69420] transition-colors"
                            >
                                <Plus size={20} />
                                Add Stop
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg text-base font-medium hover:bg-gray-300 transition-colors flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-[#E7A533] text-gray-800 rounded-lg text-base font-medium hover:bg-[#d69420] transition-colors flex-1"
                        >
                            Save Schedule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSchedulePage;