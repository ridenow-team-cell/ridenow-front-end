"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { Search, Navigation, MapPin, Bus, Users, Filter, RefreshCw, AlertCircle, Clock, Car, Route as RouteIcon, Play, Pause } from 'lucide-react';
import { useLiveBusStatus, useTrackingStatistics, useUpdateTrackingStatus } from '@/hooks/use-bus-tracking';
import { busTrackingService } from '@/services/bus-tracking-service';
import { useBuses } from '@/hooks/use-bus';
import { useRoutes } from '@/hooks/use-routes';
import { LiveBusStatus, MockBus } from '@/types/bus-tracking';
import { toast } from 'react-hot-toast';

// Default Abuja coordinates
const defaultCenter = {
    lat: 9.0765,
    lng: 7.3986
};

// Map styles
const mapContainerStyle = {
    width: '100%',
    height: '700px'
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

// Route paths for different routes (simplified coordinates)
const routePaths = {
    "Route 1": [
        { lat: 9.0800, lng: 7.4850 }, // Wuse III
        { lat: 9.0765, lng: 7.4800 }, // Wuse II
        { lat: 9.0720, lng: 7.4750 }, // Intermediate
        { lat: 9.0670, lng: 7.4700 }, // Intermediate
        { lat: 9.0620, lng: 7.4650 }, // Garki
        { lat: 9.0570, lng: 7.4600 }, // Garki II
    ],
    "Route 2": [
        { lat: 9.0550, lng: 7.4250 }, // Jabi
        { lat: 9.0600, lng: 7.4300 }, // Jabi II
        { lat: 9.0650, lng: 7.4350 }, // Utako
        { lat: 9.0700, lng: 7.4400 }, // Wuye
        { lat: 9.0750, lng: 7.4450 }, // Dakibiyu
    ],
    "Route 3": [
        { lat: 9.0450, lng: 7.4200 }, // Durumi
        { lat: 9.0400, lng: 7.4150 }, // Gudu
        { lat: 9.0350, lng: 7.4100 }, // Gudu II
        { lat: 9.0300, lng: 7.4050 }, // Guzape
    ],
    "Route 60": [
        { lat: 9.0150, lng: 7.3900 }, // Nile University
        { lat: 9.0200, lng: 7.3950 }, // Airport Road
        { lat: 9.0250, lng: 7.4000 }, // Lugbe
        { lat: 9.0300, lng: 7.4050 }, // Guzape
        { lat: 9.0350, lng: 7.4100 }, // Gudu II
    ]
};

const LiveTrackingPage = () => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'Tracking' | 'Stopped' | 'Parked' | 'Offline'>('all');
    const [selectedBus, setSelectedBus] = useState<MockBus | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [mapZoom, setMapZoom] = useState(12);
    const [refreshing, setRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [mockBuses, setMockBuses] = useState<MockBus[]>([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const animationRef = useRef<number>();

    // API hooks
    const {
        data: liveBusStatus,
        isLoading: isLoadingLiveData,
        error: liveDataError,
        refetch: refetchLiveData
    } = useLiveBusStatus();

    const {
        data: statistics,
        isLoading: isLoadingStats
    } = useTrackingStatistics();

    const {
        data: busesData,
        isLoading: isLoadingBuses
    } = useBuses({ isActive: true });

    const {
        data: routesData,
        isLoading: isLoadingRoutes
    } = useRoutes({ isActive: true });

    const updateTrackingStatus = useUpdateTrackingStatus();

    // Initialize mock buses based on real data
    useEffect(() => {
        if (busesData && routesData) {
            const initialMockBuses: MockBus[] = busesData.slice(0, 6).map((bus, index) => {
                const assignedRoute = routesData[index % routesData.length];
                const routePath = routePaths[assignedRoute?.name as keyof typeof routePaths] || routePaths["Route 1"];

                return {
                    busId: bus.id,
                    busName: bus.name,
                    registrationName: bus.registrationName,
                    routeId: assignedRoute?.id || '',
                    routeName: assignedRoute?.name || 'Route 1',
                    status: index % 3 === 0 ? 'Tracking' : index % 3 === 1 ? 'Stopped' : 'Parked',
                    latitude: routePath[0].lat,
                    longitude: routePath[0].lng,
                    speed: index % 3 === 0 ? 45 + Math.random() * 15 : 0,
                    heading: Math.random() * 360,
                    passengersOnBoard: Math.floor(Math.random() * (bus.totalSeats || 40)),
                    totalSeats: bus.totalSeats || 40,
                    driverName: `Driver ${index + 1}`,
                    nextStopName: `Stop ${Math.floor(Math.random() * 5) + 1}`,
                    estimatedArrival: new Date(Date.now() + 600000 + Math.random() * 1800000).toISOString(),
                    lastUpdated: new Date().toISOString(),
                    routePath: routePath,
                    currentPathIndex: 0,
                    direction: 1, // 1 for forward, -1 for backward
                };
            });

            setMockBuses(initialMockBuses);
        }
    }, [busesData, routesData]);

    // Animation loop for moving buses
    useEffect(() => {
        if (!isPlaying || mockBuses.length === 0) return;

        const animateBuses = () => {
            setMockBuses(prevBuses =>
                prevBuses.map(bus => {
                    if (bus.status !== 'Tracking' || !bus.routePath) return bus;

                    const path = bus.routePath;
                    const currentIndex = bus.currentPathIndex;
                    const nextIndex = currentIndex + bus.direction;

                    // Reverse direction if at end of path
                    if (nextIndex >= path.length || nextIndex < 0) {
                        return {
                            ...bus,
                            direction: bus.direction * -1,
                            currentPathIndex: currentIndex + (bus.direction * -1)
                        };
                    }

                    const currentPos = path[currentIndex];
                    const nextPos = path[nextIndex];

                    // Calculate distance and movement
                    const distance = Math.sqrt(
                        Math.pow(nextPos.lat - currentPos.lat, 2) +
                        Math.pow(nextPos.lng - currentPos.lng, 2)
                    );

                    // Move a small fraction of the distance
                    const fraction = 0.05;
                    const newLat = currentPos.lat + (nextPos.lat - currentPos.lat) * fraction;
                    const newLng = currentPos.lng + (nextPos.lng - currentPos.lng) * fraction;

                    // Calculate heading (direction in degrees)
                    const heading = Math.atan2(nextPos.lng - currentPos.lng, nextPos.lat - currentPos.lat) * (180 / Math.PI);

                    return {
                        ...bus,
                        latitude: newLat,
                        longitude: newLng,
                        heading: (heading + 360) % 360,
                        currentPathIndex: Math.abs(newLat - nextPos.lat) < 0.0001 &&
                            Math.abs(newLng - nextPos.lng) < 0.0001 ?
                            nextIndex : currentIndex,
                        lastUpdated: new Date().toISOString(),
                        speed: bus.status === 'Tracking' ? 40 + Math.random() * 20 : 0,
                        passengersOnBoard: Math.min(
                            bus.totalSeats,
                            bus.passengersOnBoard + (Math.random() > 0.7 ? 1 : 0)
                        )
                    };
                })
            );

            animationRef.current = requestAnimationFrame(animateBuses);
        };

        animationRef.current = requestAnimationFrame(animateBuses);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, mockBuses.length]);

    // Filter buses based on selected filter
    const filteredBuses = useMemo(() => {
        if (selectedFilter === 'all') return mockBuses;
        return mockBuses.filter(bus => bus.status === selectedFilter);
    }, [mockBuses, selectedFilter]);

    // Filter by search query
    const searchedBuses = useMemo(() => {
        if (!searchQuery.trim()) return filteredBuses;

        const query = searchQuery.toLowerCase();
        return filteredBuses.filter(bus =>
            bus.busName.toLowerCase().includes(query) ||
            bus.registrationName.toLowerCase().includes(query) ||
            bus.routeName?.toLowerCase().includes(query) ||
            bus.driverName?.toLowerCase().includes(query)
        );
    }, [filteredBuses, searchQuery]);

    // Calculate statistics from mock data
    const mockStatistics = useMemo(() => {
        const activeBuses = mockBuses.filter(b => b.status === 'Tracking').length;
        const stoppedBuses = mockBuses.filter(b => b.status === 'Stopped').length;
        const parkedBuses = mockBuses.filter(b => b.status === 'Parked').length;
        const averageSpeed = mockBuses.reduce((sum, bus) => sum + bus.speed, 0) / mockBuses.length || 0;

        return {
            activeBuses,
            stoppedBuses,
            parkedBuses,
            averageSpeed,
            totalBuses: mockBuses.length
        };
    }, [mockBuses]);

    // Handle bus click
    const handleBusClick = (bus: MockBus) => {
        setSelectedBus(bus);
        setMapCenter({ lat: bus.latitude, lng: bus.longitude });
        setMapZoom(15);
    };

    // Handle district click
    const handleDistrictClick = (district: typeof districts[0]) => {
        setMapCenter(district.position);
        setMapZoom(14);
        setSelectedBus(null);
    };

    // Handle refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Live data refreshed');
        } catch (error) {
            toast.error('Failed to refresh data');
        } finally {
            setRefreshing(false);
        }
    };

    // Handle status change
    const handleStatusChange = (busId: string, currentStatus: string) => {
        setMockBuses(prev =>
            prev.map(bus =>
                bus.busId === busId
                    ? {
                        ...bus,
                        status: currentStatus === 'Tracking' ? 'Stopped' : 'Tracking',
                        speed: currentStatus === 'Tracking' ? 0 : 40 + Math.random() * 20
                    }
                    : bus
            )
        );

        toast.success(`Bus ${currentStatus === 'Tracking' ? 'stopped' : 'started tracking'}`);
    };

    // Get bus icon color based on status
    const getBusIcon = (status: string) => {
        switch (status) {
            case 'Tracking':
                return {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#10B981', // Green for tracking
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 1.5,
                };
            case 'Stopped':
                return {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#F59E0B', // Amber for stopped
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 1.5,
                };
            case 'Parked':
                return {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#3B82F6', // Blue for parked
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 1.5,
                };
            case 'Offline':
            case 'Maintenance':
                return {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#9CA3AF', // Gray for offline/maintenance
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 1.5,
                };
            default:
                return {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#0066CC',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 1.5,
                };
        }
    };

    const getDistrictIcon = () => {
        return {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#E7A533',
            fillOpacity: 0.7,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            scale: 1,
        };
    };

    // Get direction icon based on heading
    const getDirectionIcon = (heading: number) => {
        if (heading >= 337.5 || heading < 22.5) return '↑'; // North
        if (heading >= 22.5 && heading < 67.5) return '↗'; // Northeast
        if (heading >= 67.5 && heading < 112.5) return '→'; // East
        if (heading >= 112.5 && heading < 157.5) return '↘'; // Southeast
        if (heading >= 157.5 && heading < 202.5) return '↓'; // South
        if (heading >= 202.5 && heading < 247.5) return '↙'; // Southwest
        if (heading >= 247.5 && heading < 292.5) return '←'; // West
        return '↖'; // Northwest
    };

    // Helper function to calculate time ago
    const calculateTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    // Helper function to format speed
    const formatSpeed = (speed: number) => {
        return `${Math.round(speed)} km/h`;
    };

    // Helper function to format time
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Tracking': return 'bg-green-100 text-green-800';
            case 'Stopped': return 'bg-yellow-100 text-yellow-800';
            case 'Parked': return 'bg-blue-100 text-blue-800';
            case 'Offline':
            case 'Maintenance':
                return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Tracking': return 'Tracking';
            case 'Stopped': return 'Stopped';
            case 'Parked': return 'Parked';
            case 'Offline': return 'Offline';
            case 'Maintenance': return 'Maintenance';
            default: return status;
        }
    };

    // Loading state
    if (isLoadingBuses || isLoadingRoutes || mockBuses.length === 0) {
        return (
            <div className="p-4 sm:p-6 bg-white min-h-screen">
                <div className="flex justify-center items-center h-[700px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-white min-h-screen">
            {/* Header with Statistics */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">


                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            {isPlaying ? 'Pause Simulation' : 'Play Simulation'}
                        </button>

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 rounded-lg ${viewMode === 'map' ? 'bg-[#0066CC] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Map View
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-[#0066CC] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                List View
                            </button>
                        </div>
                    </div>
                </div>


            </div>



            {/* Simulation Info */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={20} className="text-blue-600" />
                        <span className="text-blue-800 font-medium">Simulation Mode Active</span>
                    </div>
                    <span className="text-sm text-blue-600">
                        {isPlaying ? 'Buses are moving in real-time' : 'Simulation paused'}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            {viewMode === 'map' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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

                                    {/* Route Paths */}
                                    {Object.entries(routePaths).map(([routeName, path]) => (
                                        <Polyline
                                            key={routeName}
                                            path={path}
                                            options={{
                                                strokeColor: '#0066CC',
                                                strokeOpacity: 0.5,
                                                strokeWeight: 2,
                                                geodesic: true
                                            }}
                                        />
                                    ))}

                                    {/* Bus Markers with direction */}
                                    {searchedBuses.map((bus) => (
                                        <Marker
                                            key={bus.busId}
                                            position={{ lat: bus.latitude, lng: bus.longitude }}
                                            icon={{
                                                ...getBusIcon(bus.status),
                                                // Add rotation for direction
                                                rotation: bus.heading
                                            }}
                                            onClick={() => handleBusClick(bus)}
                                        />
                                    ))}

                                    {/* Info Window for Selected Bus */}
                                    {selectedBus && (
                                        <InfoWindow
                                            position={{ lat: selectedBus.latitude, lng: selectedBus.longitude }}
                                            onCloseClick={() => setSelectedBus(null)}
                                        >
                                            <div className="p-3 text-[#343434] max-w-xs">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-[#0066CC] text-lg">{selectedBus.busName}</h3>
                                                        <p className="text-sm text-gray-600">{selectedBus.registrationName}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBus.status)}`}>
                                                        {getStatusBadge(selectedBus.status)}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    {selectedBus.routeName && (
                                                        <div className="flex items-center gap-2">
                                                            <RouteIcon size={14} className="text-green-600" />
                                                            <span className="font-medium">Route:</span>
                                                            <span>{selectedBus.routeName}</span>
                                                        </div>
                                                    )}

                                                    {selectedBus.driverName && (
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} className="text-blue-600" />
                                                            <span className="font-medium">Driver:</span>
                                                            <span>{selectedBus.driverName}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <Navigation size={14} className="text-purple-600" />
                                                        <span className="font-medium">Speed:</span>
                                                        <span>{formatSpeed(selectedBus.speed)}</span>
                                                        <span className="text-gray-500">• {getDirectionIcon(selectedBus.heading)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-gray-600" />
                                                        <span className="font-medium">Updated:</span>
                                                        <span>{calculateTimeAgo(selectedBus.lastUpdated)}</span>
                                                    </div>

                                                    {selectedBus.nextStopName && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={14} className="text-red-600" />
                                                            <span className="font-medium">Next Stop:</span>
                                                            <span>{selectedBus.nextStopName}</span>
                                                            {selectedBus.estimatedArrival && (
                                                                <span className="text-xs text-gray-500">
                                                                    ({formatTime(selectedBus.estimatedArrival)})
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
                                                        <div className="text-center">
                                                            <div className="font-bold text-green-600">{selectedBus.passengersOnBoard}</div>
                                                            <div className="text-xs text-gray-600">On Board</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="font-bold text-blue-600">{selectedBus.totalSeats}</div>
                                                            <div className="text-xs text-gray-600">Total Seats</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="font-bold text-gray-600">
                                                                {Math.round((selectedBus.passengersOnBoard / selectedBus.totalSeats) * 100)}%
                                                            </div>
                                                            <div className="text-xs text-gray-600">Capacity</div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleStatusChange(selectedBus.busId, selectedBus.status)}
                                                        className={`w-full mt-2 px-3 py-1 text-sm rounded-lg ${selectedBus.status === 'Tracking' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                                    >
                                                        {selectedBus.status === 'Tracking' ? 'Mark as Stopped' : 'Mark as Tracking'}
                                                    </button>
                                                </div>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </GoogleMap>
                            </LoadScript>

                            {/* Map Legend */}
                            <div className="p-4 border-t border-gray-200">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Active (Tracking)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Stopped</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Parked</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Offline/Maintenance</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-[#E7A533] rounded-full"></div>
                                        <span className="text-sm text-gray-600">Districts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bus List Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-800">Active Buses</h3>
                                <span className="text-sm text-gray-600">{searchedBuses.length} found</span>
                            </div>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {searchedBuses.map((bus) => (
                                    <div
                                        key={bus.busId}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedBus?.busId === bus.busId ? 'border-[#0066CC] bg-blue-50' : 'border-gray-200 hover:border-[#0066CC]'}`}
                                        onClick={() => handleBusClick(bus)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Bus size={16} className={
                                                        bus.status === 'Tracking' ? 'text-green-600' :
                                                            bus.status === 'Stopped' ? 'text-yellow-600' :
                                                                bus.status === 'Parked' ? 'text-blue-600' : 'text-gray-400'
                                                    } />
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(bus.status)}`}>
                                                        {getStatusBadge(bus.status)}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-gray-800 mt-1">{bus.busName}</h4>
                                                <p className="text-xs text-gray-600">{bus.registrationName}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500">
                                                    {calculateTimeAgo(bus.lastUpdated)}
                                                </div>
                                                <div className="text-sm font-medium text-gray-700 mt-1">
                                                    {formatSpeed(bus.speed)}
                                                </div>
                                            </div>
                                        </div>

                                        {bus.routeName && (
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                <RouteIcon size={12} />
                                                <span>{bus.routeName}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Users size={12} className="text-gray-400" />
                                                    <span className="font-medium">{bus.passengersOnBoard}</span>
                                                    <span className="text-gray-500">/{bus.totalSeats}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Navigation size={12} className="text-gray-400" />
                                                    <span>{getDirectionIcon(bus.heading)}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(bus.busId, bus.status);
                                                }}
                                                className={`text-xs px-2 py-1 rounded ${bus.status === 'Tracking' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                            >
                                                {bus.status === 'Tracking' ? 'Stop' : 'Start'}
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {searchedBuses.length === 0 && (
                                    <div className="text-center py-8">
                                        <Bus size={32} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-600">No buses found</p>
                                        <p className="text-sm text-gray-500">Try changing your filters or search</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {searchedBuses.map((bus) => (
                                    <tr
                                        key={bus.busId}
                                        className={`hover:bg-gray-50 cursor-pointer ${selectedBus?.busId === bus.busId ? 'bg-blue-50' : ''}`}
                                        onClick={() => handleBusClick(bus)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <Bus size={20} className={
                                                        bus.status === 'Tracking' ? 'text-green-600' :
                                                            bus.status === 'Stopped' ? 'text-yellow-600' :
                                                                bus.status === 'Parked' ? 'text-blue-600' : 'text-gray-400'
                                                    } />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{bus.busName}</div>
                                                    <div className="text-sm text-gray-500">{bus.registrationName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bus.status)}`}>
                                                {getStatusBadge(bus.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {bus.routeName || 'No route assigned'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {bus.driverName || 'No driver assigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatSpeed(bus.speed)}</div>
                                            <div className="text-sm text-gray-500">{getDirectionIcon(bus.heading)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {bus.passengersOnBoard}/{bus.totalSeats}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {Math.round((bus.passengersOnBoard / bus.totalSeats) * 100)}% full
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {calculateTimeAgo(bus.lastUpdated)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(bus.busId, bus.status);
                                                }}
                                                className={`px-3 py-1 rounded ${bus.status === 'Tracking' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                            >
                                                {bus.status === 'Tracking' ? 'Stop' : 'Start'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {searchedBuses.length === 0 && (
                        <div className="text-center py-12">
                            <Bus size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                No buses match your current filters. Try adjusting your search or filters to see more results.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LiveTrackingPage;