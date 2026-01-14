"use client"
import React, { useState } from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Search, Navigation, MapPin, Bus, Users, Filter } from 'lucide-react';

// Types for bus data
interface BusLocation {
    id: number;
    name: string;
    position: {
        lat: number;
        lng: number;
    };
    route: string;
    status: 'active' | 'parked';
    district: string;
    studentPicked: number;
    studentRemaining: number;
    from: string;
    to: string;
}

// Default Abuja coordinates
const defaultCenter = {
    lat: 9.0765,
    lng: 7.3986
};

// Abuja districts coordinates (approximate)
const districts = [
    { name: "UTAKO DISTRICT", position: { lat: 9.0626, lng: 7.4894 } },
    { name: "WUSE II DISTRICT", position: { lat: 9.0765, lng: 7.4800 } },
    { name: "WUSE III DISTRICT", position: { lat: 9.0800, lng: 7.4850 } },
    { name: "JABI DISTRICT", position: { lat: 9.0550, lng: 7.4250 } },
    { name: "WUYE DISTRICT", position: { lat: 9.0650, lng: 7.4400 } },
    { name: "DAKIBIYU DISTRICT", position: { lat: 9.0700, lng: 7.4500 } },
    { name: "KURUWABA DISTRICT", position: { lat: 9.0750, lng: 7.4600 } },
    { name: "Karmajiji", position: { lat: 9.0500, lng: 7.4300 } },
    { name: "DURUMI DISTRICT", position: { lat: 9.0450, lng: 7.4200 } },
    { name: "GUDU DISTRICT", position: { lat: 9.0400, lng: 7.4100 } },
    { name: "GARKI", position: { lat: 9.0550, lng: 7.4800 } },
    { name: "Nile University", position: { lat: 9.0150, lng: 7.3900 } },
];

// Map styles
const mapContainerStyle = {
    width: '100%',
    height: '700px'
};

const LiveTrackingPage = () => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'parked'>('all');
    const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(12);

    // Sample bus data
    const [buses, setBuses] = useState<BusLocation[]>([
        {
            id: 1,
            name: "Bus 05",
            position: { lat: 9.0550, lng: 7.4800 },
            route: "Route 45",
            status: "active",
            district: "GARKI",
            studentPicked: 50,
            studentRemaining: 10,
            from: "Garki",
            to: "Nile University"
        },
        {
            id: 2,
            name: "Bus 06",
            position: { lat: 9.0765, lng: 7.4800 },
            route: "Route 45",
            status: "active",
            district: "WUSE II DISTRICT",
            studentPicked: 50,
            studentRemaining: 50,
            from: "Garki",
            to: "Nile University"
        },
        {
            id: 3,
            name: "Bus 07",
            position: { lat: 9.0626, lng: 7.4894 },
            route: "Route 45",
            status: "parked",
            district: "UTAKO DISTRICT",
            studentPicked: 50,
            studentRemaining: 0,
            from: "Garki",
            to: "Nile University"
        },
        {
            id: 4,
            name: "Bus 08",
            position: { lat: 9.0400, lng: 7.4100 },
            route: "Route 45",
            status: "parked",
            district: "GUDU DISTRICT",
            studentPicked: 10,
            studentRemaining: 40,
            from: "Garki",
            to: "Nile University"
        },
    ]);

    // Filter buses based on selected filter
    const filteredBuses = buses.filter(bus => {
        if (selectedFilter === 'all') return true;
        return bus.status === selectedFilter;
    });

    // Handle bus click
    const handleBusClick = (bus: BusLocation) => {
        setSelectedBus(bus);
        setMapCenter(bus.position);
        setMapZoom(15);
    };

    // Handle district click
    const handleDistrictClick = (district: typeof districts[0]) => {
        setMapCenter(district.position);
        setMapZoom(14);
        setSelectedBus(null);
    };

    // Get bus icon color based on status
    const getBusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#10B981', // Green for active
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 1.5,
                    // anchor: google.maps.Point(12, 24),
                };
            case 'parked':
                return {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#F59E0B', // Amber for parked
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 1.5,
                    // anchor: new google.maps.Point(12, 24),
                };
            default:
                return {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#0066CC', // Blue default
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 1.5,
                    // anchor: new google.maps.Point(12, 24),
                };
        }
    };

    const getDistrictIcon = () => {
        return {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#E7A533', // Orange for districts
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1,
            // anchor: new google.maps.Point(12, 12),
        };
    };

    return (
        <div className="p-4 sm:p-6 bg-white">
            {/* Page Header */}



            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map Section - Takes 2/3 of the width on large screens */}
                <div className="lg:col-span-2">
                    {/* <div className="bg-white rounded-lg p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-[#343434] mb-4">Live Bus Locations</h2> */}

                    <LoadScript
                        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBjpTeVMERj4TPGN8RU6UOmCtt6nnYVVqk'}
                        libraries={['places']}
                    >
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={mapCenter}
                            zoom={mapZoom}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: true,
                                zoomControl: true,
                                styles: [
                                    {
                                        featureType: "poi",
                                        elementType: "labels",
                                        stylers: [{ visibility: "off" }]
                                    }
                                ]
                            }}
                        >
                            {/* District Markers */}
                            {districts.map((district) => (
                                <Marker
                                    key={district.name}
                                    position={district.position}
                                    icon={getDistrictIcon()}
                                    onClick={() => handleDistrictClick(district)}
                                />
                            ))}

                            {/* Bus Markers */}
                            {filteredBuses.map((bus) => (
                                <Marker
                                    key={bus.id}
                                    position={bus.position}
                                    icon={getBusIcon(bus.status)}
                                    onClick={() => handleBusClick(bus)}
                                />
                            ))}

                            {/* Info Window for Selected Bus */}
                            {selectedBus && (
                                <InfoWindow
                                    position={selectedBus.position}
                                    onCloseClick={() => setSelectedBus(null)}
                                >
                                    <div className="p-2 text-[#343434]">
                                        <h3 className="font-semibold text-[#0066CC]">{selectedBus.name}</h3>
                                        <p className="text-sm text-gray-600">{selectedBus.route}</p>
                                        <p className="text-sm">
                                            Status: <span className={`font-medium ${selectedBus.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                                                {selectedBus.status.charAt(0).toUpperCase() + selectedBus.status.slice(1)}
                                            </span>
                                        </p>
                                        <p className="text-sm">District: {selectedBus.district}</p>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium">Route Details:</p>
                                            <p className="text-sm">From: {selectedBus.from}</p>
                                            <p className="text-sm">To: {selectedBus.to}</p>
                                            <div className="flex gap-4 mt-1">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    Picked: {selectedBus.studentPicked}
                                                </span>
                                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                    Remaining: {selectedBus.studentRemaining}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </LoadScript>

                    {/* Legend */}
                    {/* <div className="flex items-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                                <span className="text-sm text-gray-600">Active Buses</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                                <span className="text-sm text-gray-600">Parked Buses</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#E7A533] rounded-full"></div>
                                <span className="text-sm text-gray-600">Districts</span>
                            </div>
                        </div> */}
                    {/* </div> */}
                </div>

                {/* Bus List Sidebar */}
                <div className="lg:col-span-1">
                    <div className=" p-4 sm:p-6 h-full">
                        <div className="flex gap-2 mb-2 border-b-2 border-gray-200">
                            <button
                                onClick={() => setSelectedFilter('all')}
                                className={`px-4 py-2 text-sm text-gray-700 font-medium transition-colors ${selectedFilter === 'all' ? 'border-b-2 border-[#F59E0B]' : ''}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setSelectedFilter('active')}
                                className={`px-4 py-2 text-sm text-gray-700 font-medium transition-colors ${selectedFilter === 'active' ? 'border-b-2 border-[#F59E0B]' : ''}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setSelectedFilter('parked')}
                                className={`px-4 py-2  text-sm text-gray-700 font-medium transition-colors ${selectedFilter === 'parked' ? 'border-b-2 border-[#F59E0B]' : ''}`}
                            >
                                Parked
                            </button>
                        </div>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            {filteredBuses.map((bus) => (
                                <div
                                    key={bus.id}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedBus?.id === bus.id ? 'border-[#0066CC] bg-[#343434EB]' : 'border-gray-200 hover:border-[#0066CC]'}`}
                                    onClick={() => handleBusClick(bus)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Bus size={16} className={`${bus.status === 'active' ? 'text-green-600' : 'text-[#667085]'}`} />

                                                <p className={`text-sm mb-1 ${selectedBus?.id === bus.id ? 'text-[#FFFFFF]' : 'text-[#667085]'}`}>{bus.route}</p>
                                            </div>



                                        </div>
                                        <div className="flex flex-col items-end">
                                            <h3 className={`font-semibold ${selectedBus?.id === bus.id ? 'text-[#ffffff80]' : 'text-[#343434]'}`}>{bus.name}</h3>

                                        </div>
                                    </div>

                                    <div className={`mt-3 pt-3 border-t ${selectedBus?.id === bus.id ? 'border-[#FFFFFF30]' : 'border-gray-100'} flex gap-4`}>
                                        {/* From-To Section with Connecting Line - Left Side */}
                                        <div className="relative flex-1">
                                            <div className="space-y-3">
                                                {/* From Point */}
                                                <div className="relative pl-6">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0066CC] z-10"></div>
                                                    <div className="flex gap-2 items-baseline">
                                                        <p className={`text-xs ${selectedBus?.id === bus.id ? 'text-[#FFFFFF80]' : 'text-[#667085]'}`}>From</p>
                                                        <p className={`text-sm font-medium ${selectedBus?.id === bus.id ? 'text-white' : 'text-[#343434]'}`}>{bus.from}</p>
                                                    </div>
                                                </div>

                                                {/* Connecting Line */}
                                                <div className={`absolute left-1.5 top-4 bottom-4 w-0.5 ${selectedBus?.id === bus.id ? 'bg-[#FFFFFF30]' : 'bg-gray-200'}`}></div>

                                                {/* To Point */}
                                                <div className="relative pl-6">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#3EAE49] z-10"></div>
                                                    <div className="flex gap-2 items-baseline">
                                                        <p className={`text-xs ${selectedBus?.id === bus.id ? 'text-[#FFFFFF80]' : 'text-[#667085]'}`}>To</p>
                                                        <p className={`text-sm font-medium ${selectedBus?.id === bus.id ? 'text-white' : 'text-[#343434]'}`}>{bus.to}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Student Stats - Right Side */}
                                        <div className="flex flex-col gap-3 min-w-[180px]">
                                            <div className="flex items-start gap-2">

                                                <div>
                                                    <span className={`text-xs ${selectedBus?.id === bus.id ? 'text-[#FFFFFF80]' : 'text-[#667085]'}`}>
                                                        Students Picked
                                                    </span>
                                                    <p className={`text-sm font-medium ${selectedBus?.id === bus.id ? 'text-white' : 'text-[#343434]'}`}>{bus.studentPicked}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2">

                                                <div>
                                                    <span className={`text-xs ${selectedBus?.id === bus.id ? 'text-[#FFFFFF80]' : 'text-[#667085]'}`}>
                                                        Students Remaining
                                                    </span>
                                                    <p className={`text-sm font-medium ${selectedBus?.id === bus.id ? 'text-white' : 'text-[#343434]'}`}>{bus.studentRemaining}</p>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTrackingPage;