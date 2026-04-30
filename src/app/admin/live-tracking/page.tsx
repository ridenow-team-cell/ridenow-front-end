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
type SimStudent = { id: string; stopIdx: number; startPos: {lat: number, lng: number}; pos: {lat: number, lng: number}; phase: 'walking' | 'waiting' | 'boarded'; };

const SCENARIO_BUS_START = { lat: 9.0765, lng: 7.4800 }; // Wuse 2
const SCENARIO_STOPS = [
    { lat: 9.0680, lng: 7.4700 }, // Stop 1: Utako
    { lat: 9.0650, lng: 7.4400 }, // Stop 2: Wuye
    { lat: 9.0450, lng: 7.4200 }, // Stop 3: Jabi Junction
    { lat: 9.0250, lng: 7.4000 }, // Stop 4: Lugbe Entrance
];
const SCENARIO_DEST = { lat: 9.0150, lng: 7.3900 };      // Nile University

const INITIAL_STUDENTS: SimStudent[] = [
    { id: 'std_1', stopIdx: 0, startPos: { lat: 9.0700, lng: 7.4720 }, pos: { lat: 9.0700, lng: 7.4720 }, phase: 'walking' },
    { id: 'std_2', stopIdx: 0, startPos: { lat: 9.0670, lng: 7.4680 }, pos: { lat: 9.0670, lng: 7.4680 }, phase: 'walking' },
    { id: 'std_3', stopIdx: 1, startPos: { lat: 9.0660, lng: 7.4420 }, pos: { lat: 9.0660, lng: 7.4420 }, phase: 'walking' },
    { id: 'std_4', stopIdx: 1, startPos: { lat: 9.0630, lng: 7.4380 }, pos: { lat: 9.0630, lng: 7.4380 }, phase: 'walking' },
    { id: 'std_5', stopIdx: 2, startPos: { lat: 9.0470, lng: 7.4220 }, pos: { lat: 9.0470, lng: 7.4220 }, phase: 'walking' },
    { id: 'std_6', stopIdx: 3, startPos: { lat: 9.0270, lng: 7.4020 }, pos: { lat: 9.0270, lng: 7.4020 }, phase: 'walking' },
    { id: 'std_7', stopIdx: 3, startPos: { lat: 9.0230, lng: 7.3980 }, pos: { lat: 9.0230, lng: 7.3980 }, phase: 'walking' },
];

const MAP_STYLES = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#eeeeee" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#e5e5e5" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#dadada" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{ "color": "#e5e5e5" }]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{ "color": "#eeeeee" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#c9c9c9" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    }
];

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

    // Scenario Simulation State

    const [scenarioActive, setScenarioActive] = useState(false);
    const [scenarioPhase, setScenarioPhase] = useState<'idle' | 'approaching' | 'boarding' | 'transit' | 'arrived'>('idle');
    const [scenarioBusPos, setScenarioBusPos] = useState(SCENARIO_BUS_START);
    const [scenarioBusHeading, setScenarioBusHeading] = useState(0);
    const [scenarioDetailedPath, setScenarioDetailedPath] = useState<{lat: number, lng: number}[]>([]);
    const [scenarioStopIndices, setScenarioStopIndices] = useState<number[]>([]);
    const [scenarioLoaded, setScenarioLoaded] = useState(false);
    
    // Imperative refs for smooth movement
    const busMarkerRef = useRef<google.maps.Marker | null>(null);
    const studentMarkersRef = useRef<Record<string, google.maps.Marker>>({});
    const currentBusPosRef = useRef(SCENARIO_BUS_START);
    const currentStudentPosRef = useRef<Record<string, {lat: number, lng: number}>>({});
    const animationFrameRef = useRef<number>();


    // Fetch directions
    useEffect(() => {
        if (!scenarioActive) {
            setScenarioLoaded(false);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            return;
        }

        let isMounted = true;
        const loadScenario = async () => {
            if (!window.google || !window.google.maps) {
                setTimeout(loadScenario, 100);
                return;
            }

            const directionsService = new window.google.maps.DirectionsService();
            try {
                const result = await directionsService.route({
                    origin: SCENARIO_BUS_START,
                    destination: SCENARIO_DEST,
                    waypoints: SCENARIO_STOPS.map(s => ({ location: s, stopover: true })),
                    travelMode: window.google.maps.TravelMode.DRIVING
                });
                
                if (result.routes && result.routes[0] && isMounted) {
                    const path = result.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
                    
                    // Map waypoints to closest path indices
                    const stopIndices = SCENARIO_STOPS.map(stop => {
                        let closestIdx = 0;
                        let minD = Infinity;
                        path.forEach((p, i) => {
                            const d = Math.hypot(p.lat - stop.lat, p.lng - stop.lng);
                            if (d < minD) { minD = d; closestIdx = i; }
                        });
                        return closestIdx;
                    });

                    setScenarioDetailedPath(path);
                    setScenarioStopIndices(stopIndices);
                    setScenarioLoaded(true);
                }
            } catch (e) {
                console.error("Directions routing failed:", e);
                // Fallback to straight lines
                setScenarioDetailedPath([SCENARIO_BUS_START, ...SCENARIO_STOPS, SCENARIO_DEST]);
                setScenarioStopIndices(SCENARIO_STOPS.map((_, i) => i + 1));
                setScenarioLoaded(true);
            }
        };
        
        loadScenario();
        
        return () => {
            isMounted = false;
        }
    }, [scenarioActive]);

    useEffect(() => {
        if (!scenarioActive || !scenarioLoaded || scenarioDetailedPath.length === 0) return;

        let bPos = SCENARIO_BUS_START;
        let students = JSON.parse(JSON.stringify(INITIAL_STUDENTS)) as SimStudent[];
        let currentPhase = 'approaching';
        let busTargetIdx = 1;
        let currentStopIdx = 0; // index into SCENARIO_STOPS / scenarioStopIndices
        
        setScenarioPhase('approaching');
        
        let lastTime = performance.now();
        let boardingTimeLeft = 0;

        const animate = (time: number) => {
            const dt = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;

            const busSpeed = 0.001; 
            const studentSpeed = 0.0008; 
            
            // Move Students
            students.forEach(std => {
                if (std.phase === 'walking') {
                    const target = SCENARIO_STOPS[std.stopIdx];
                    if (!target) return;
                    
                    const dist = Math.hypot(target.lat - std.pos.lat, target.lng - std.pos.lng);
                    if (dist > 0.0001) {
                        std.pos = {
                            lat: std.pos.lat + ((target.lat - std.pos.lat) / dist) * studentSpeed * dt,
                            lng: std.pos.lng + ((target.lng - std.pos.lng) / dist) * studentSpeed * dt
                        };
                    } else {
                        std.pos = { ...target };
                        std.phase = 'waiting';
                    }
                }
                
                // Sync with refs for re-render stability
                currentStudentPosRef.current[std.id] = { ...std.pos };
                
                const marker = studentMarkersRef.current[std.id];
                if (marker && typeof std.pos.lat === 'number' && !isNaN(std.pos.lat)) {
                    if (std.phase === 'boarded') {
                        if (marker.getVisible()) marker.setVisible(false);
                    } else {
                        if (!marker.getVisible()) marker.setVisible(true);
                        marker.setPosition(new window.google.maps.LatLng(std.pos.lat, std.pos.lng));
                    }
                }
            });

            // Move Bus
            if (currentPhase === 'approaching' || currentPhase === 'transit') {
                if (busTargetIdx < scenarioDetailedPath.length) {
                    const targetPos = scenarioDetailedPath[busTargetIdx];
                    const bDist = Math.hypot(targetPos.lat - bPos.lat, targetPos.lng - bPos.lng);
                    
                    if (bDist > 0.00005) {
                        bPos = {
                            lat: bPos.lat + (targetPos.lat - bPos.lat) / bDist * busSpeed * dt,
                            lng: bPos.lng + (targetPos.lng - bPos.lng) / bDist * busSpeed * dt
                        };
                        const heading = Math.atan2(targetPos.lng - bPos.lng, targetPos.lat - bPos.lat) * (180 / Math.PI);
                        setScenarioBusHeading((heading + 360) % 360);
                    } else {
                        bPos = targetPos;
                        
                        // Check if we reached a stop
                        if (currentStopIdx < scenarioStopIndices.length && busTargetIdx === scenarioStopIndices[currentStopIdx]) {
                            currentPhase = 'boarding';
                            setScenarioPhase('boarding');
                            boardingTimeLeft = 2.0; // minimum wait time
                        } else {
                            busTargetIdx++;
                        }
                    }
                } else {
                    currentPhase = 'arrived';
                    setScenarioPhase('arrived');
                }
                
                currentBusPosRef.current = { ...bPos };
                if (busMarkerRef.current && typeof bPos.lat === 'number' && !isNaN(bPos.lat)) {
                    busMarkerRef.current.setPosition(new window.google.maps.LatLng(bPos.lat, bPos.lng));
                }
            } else if (currentPhase === 'boarding') {
                // Check if all students for currentStopIdx are at the stop
                const studentsAtStop = students.filter(s => s.stopIdx === currentStopIdx);
                const allWaiting = studentsAtStop.every(s => s.phase === 'waiting' || s.phase === 'boarded');
                
                if (allWaiting) {
                    boardingTimeLeft -= dt;
                    if (boardingTimeLeft <= 0) {
                        // Board them
                        studentsAtStop.forEach(s => s.phase = 'boarded');
                        currentPhase = 'transit';
                        setScenarioPhase('transit');
                        currentStopIdx++;
                        busTargetIdx++;
                    }
                }
            }
            
            if (currentPhase !== 'arrived') {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [scenarioActive, scenarioLoaded, scenarioDetailedPath, scenarioStopIndices]);

    const handleToggleScenario = () => {
        setScenarioActive(!scenarioActive);
        if (!scenarioActive) {
            setMapCenter(SCENARIO_BUS_START);
            setMapZoom(15);
        }
    };

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

    return (
        <div className="p-4 sm:p-6 bg-white min-h-screen">
            {/* Header with Scenario Controls */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Road-Snapped Simulation</h1>
                    <p className="text-gray-500">Explicit Scenario: Wuse 2 to Nile University (7 Students, 4 Stops)</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${isPlaying ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        {isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
                    </button>

                    <button
                        onClick={handleToggleScenario}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-sm transition-all ${scenarioActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#0066CC] text-white hover:bg-blue-700'}`}
                    >
                        <Play size={20} />
                        {scenarioActive ? 'Stop Simulation' : 'Start Simulation'}
                    </button>
                </div>
            </div>

            {/* Simulation Status Overlay (Subtle) */}
            {scenarioActive && (
                <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-purple-200 flex items-center justify-center overflow-hidden">
                                    <Users size={14} className="text-purple-600" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-purple-900">
                                {scenarioPhase === 'boarding' ? 'Picking up students...' : 
                                 scenarioPhase === 'transit' ? 'In transit to Nile University' :
                                 scenarioPhase === 'approaching' ? 'Bus approaching pickup stop' :
                                 scenarioPhase === 'arrived' ? 'Journey Completed' : 'Waiting to start'}
                            </p>
                            <p className="text-xs text-purple-600">7 Students • 4 Pickup Locations</p>
                        </div>
                    </div>
                    {scenarioPhase === 'arrived' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                            SUCCESS
                        </span>
                    )}
                </div>
            )}

            {/* Main Map Content - Full Width */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                <LoadScript
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBjpTeVMERj4TPGN8RU6UOmCtt6nnYVVqk'}
                    libraries={['places']}
                >
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: 'calc(100vh - 280px)', minHeight: '600px' }}
                        center={mapCenter}
                        zoom={mapZoom}
                        options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: true,
                            zoomControl: true,
                            styles: MAP_STYLES
                        }}
                    >
                        {/* Scenario Route */}
                        {scenarioActive && scenarioDetailedPath.length > 0 && (
                            <Polyline
                                path={scenarioDetailedPath}
                                options={{
                                    strokeColor: '#8B5CF6',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 6,
                                    geodesic: true,
                                    zIndex: 5
                                }}
                            />
                        )}

                        {/* Explicit Scenario Markers */}
                        {scenarioActive && (
                            <>
                                {/* Start & Finish Points */}
                                <Marker
                                    position={SCENARIO_BUS_START}
                                    label="START"
                                    icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
                                />
                                <Marker
                                    position={SCENARIO_DEST}
                                    label="FINISH"
                                    icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                                />

                                {/* Pickup Stops */}
                                {SCENARIO_STOPS.map((stop, idx) => (
                                    <Marker
                                        key={`stop_${idx}`}
                                        position={stop}
                                        icon={{
                                            path: window.google.maps.SymbolPath.CIRCLE,
                                            fillColor: '#8B5CF6',
                                            fillOpacity: 1,
                                            strokeWeight: 2,
                                            strokeColor: '#FFFFFF',
                                            scale: 8,
                                        }}
                                        label={{
                                            text: `${idx + 1}`,
                                            color: "white",
                                            fontSize: "10px",
                                            fontWeight: "bold"
                                        }}
                                    />
                                ))}

                                {/* Student Markers */}
                                {INITIAL_STUDENTS.map(std => (
                                    <Marker
                                        key={std.id}
                                        position={currentStudentPosRef.current[std.id] || std.pos}
                                        onLoad={(m) => { if (m) studentMarkersRef.current[std.id] = m; }}
                                        icon={{
                                            url: '/avatar.png',
                                            scaledSize: typeof window !== 'undefined' && window.google ? new window.google.maps.Size(28, 28) : undefined,
                                        }}
                                        zIndex={20}
                                    />
                                ))}

                                {/* Bus Marker */}
                                <Marker
                                    position={currentBusPosRef.current}
                                    onLoad={(m) => { if (m) busMarkerRef.current = m; }}
                                    icon={{
                                        url: '/bus-marker.png',
                                        scaledSize: typeof window !== 'undefined' && window.google ? new window.google.maps.Size(54, 54) : undefined,
                                    }}
                                    zIndex={30}
                                />
                            </>
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

export default LiveTrackingPage;