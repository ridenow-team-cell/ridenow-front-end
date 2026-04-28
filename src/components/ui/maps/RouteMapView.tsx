"use client"
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, Polyline, DirectionsService, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { 
    MapPin, 
    Plus, 
    Save, 
    X, 
    Layers, 
    Navigation, 
    Locate, 
    ChevronLeft, 
    ChevronRight,
    Search,
    Trash2,
    Clock,
    Map as MapIcon,
    Box,
    Globe,
    ZoomIn,
    ZoomOut
} from 'lucide-react';
import { Route, RouteStop, CreateRouteRequest } from '@/types/route';
import { routeService } from '@/services/route-service';
import { toast } from 'react-hot-toast';
import StopDetailOverlay from './StopDetailOverlay';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBjpTeVMERj4TPGN8RU6UOmCtt6nnYVVqk';

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

const defaultCenter = {
    lat: 9.0765,
    lng: 7.3986
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
};

const mapContainerStyle = {
    width: '100%',
    height: 'calc(100vh - 200px)',
    minHeight: '600px',
};

interface RouteMapViewProps {
    existingRoutes: Route[];
    onSaveRoute: (route: CreateRouteRequest) => void;
    isAddingRoute?: boolean;
    onCancelAdd?: () => void;
    showAllRoutes?: boolean;
}

const RouteMapView: React.FC<RouteMapViewProps> = ({
    existingRoutes,
    onSaveRoute,
    isAddingRoute = false,
    onCancelAdd,
    showAllRoutes = false
}) => {
    // States
    const [center, setCenter] = useState(defaultCenter);
    const [zoom, setZoom] = useState(12);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [newRoute, setNewRoute] = useState<CreateRouteRequest>({
        name: '',
        description: '',
        stops: [],
        estimatedDuration: '00:00:00',
        distance: 0,
        isActive: true
    });
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [displayExistingRoutes, setDisplayExistingRoutes] = useState(showAllRoutes);
    const [mapTypeId, setMapTypeId] = useState<string>('roadmap');
    const [tilt, setTilt] = useState(0);
    
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: libraries
    });

    // Refs
    const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

    // Initialize Directions Service
    const onLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
        directionsServiceRef.current = new google.maps.DirectionsService();
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Handle Map Click (Add Stop)
    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (!isAddingRoute || !e.latLng) return;

        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        // Get address from coordinates (Reverse Geocoding)
        if (typeof google === 'undefined') return;
        
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            let address = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            if (status === 'OK' && results && results[0]) {
                address = results[0].formatted_address;
            }

            const newStop: Omit<RouteStop, 'order'> = {
                name: `Stop ${newRoute.stops.length + 1}`,
                address: address,
                latitude: lat,
                longitude: lng,
                isPickupPoint: true,
                isDropoffPoint: true,
                estimatedArrivalTimeOffset: '00:00:00'
            };

            setNewRoute(prev => ({
                ...prev,
                stops: [...prev.stops, newStop]
            }));
        });
    }, [isAddingRoute, newRoute.stops.length]);

    // Calculate Route when stops change
    useEffect(() => {
        if (newRoute.stops.length < 2) {
            setDirections(null);
            return;
        }

        const calculateRoute = async () => {
            setIsCalculating(true);
            if (typeof google === 'undefined') {
                setIsCalculating(false);
                return;
            }

            const origin = { lat: newRoute.stops[0].latitude, lng: newRoute.stops[0].longitude };
            const destination = { lat: newRoute.stops[newRoute.stops.length - 1].latitude, lng: newRoute.stops[newRoute.stops.length - 1].longitude };
            const waypoints = newRoute.stops.slice(1, -1).map(stop => ({
                location: { lat: stop.latitude, lng: stop.longitude },
                stopover: true
            }));

            if (!directionsServiceRef.current) return;

            directionsServiceRef.current.route(
                {
                    origin,
                    destination,
                    waypoints,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        setDirections(result);
                        
                        // Calculate total distance and duration
                        const legs = result.routes[0].legs;
                        let totalDistance = 0;
                        let totalDurationSeconds = 0;

                        legs.forEach(leg => {
                            totalDistance += leg.distance?.value || 0;
                            totalDurationSeconds += leg.duration?.value || 0;
                        });

                        // Format duration to HH:MM:SS
                        const hours = Math.floor(totalDurationSeconds / 3600);
                        const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
                        const seconds = totalDurationSeconds % 60;
                        const durationStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                        setNewRoute(prev => ({
                            ...prev,
                            distance: totalDistance / 1000, // Convert to km
                            estimatedDuration: durationStr
                        }));
                    } else {
                        console.error('Directions request failed due to ' + status);
                        toast.error('Could not calculate road path. Using straight lines instead.');
                    }
                    setIsCalculating(false);
                }
            );
        };

        const timeoutId = setTimeout(calculateRoute, 500);
        return () => clearTimeout(timeoutId);
    }, [newRoute.stops]);

    // Management Handlers
    const removeStop = (index: number) => {
        setNewRoute(prev => ({
            ...prev,
            stops: prev.stops.filter((_, i) => i !== index)
        }));
    };

    const updateStop = (index: number, field: keyof RouteStop, value: any) => {
        setNewRoute(prev => {
            const updatedStops = [...prev.stops];
            updatedStops[index] = { ...updatedStops[index], [field]: value };
            return { ...prev, stops: updatedStops };
        });
    };

    const handleSave = () => {
        if (!newRoute.name) {
            toast.error('Please enter a route name');
            return;
        }
        if (newRoute.stops.length < 2) {
            toast.error('A route must have at least 2 stops');
            return;
        }

        // Map stops to include the required 1-indexed order
        const routeToSave = {
            ...newRoute,
            stops: newRoute.stops.map((stop, index) => ({
                ...stop,
                order: index + 1
            }))
        };

        onSaveRoute(routeToSave as any);
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 shadow-xl bg-white">
            {/* Map Area */}
            <div className="relative">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={zoom}
                        mapTypeId={mapTypeId}
                        tilt={tilt}
                        onClick={onMapClick}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        options={{
                            ...mapOptions,
                            tilt: tilt
                        }}
                    >
                        {/* Existing Routes (Optional display) */}
                        {displayExistingRoutes && existingRoutes.map((route) => (
                            <React.Fragment key={route.id}>
                                {route.stops.map((stop, idx) => (
                                    <Marker
                                        key={`${route.id}-${idx}`}
                                        position={{ lat: stop.latitude, lng: stop.longitude }}
                                        icon={{
                                            path: google.maps.SymbolPath.CIRCLE,
                                            fillColor: '#0066CC',
                                            fillOpacity: 0.6,
                                            strokeWeight: 1,
                                            strokeColor: '#ffffff',
                                            scale: 6,
                                        }}
                                        title={`${route.name}: ${stop.name}`}
                                    />
                                ))}
                            </React.Fragment>
                        ))}

                        {/* New Route Markers */}
                        {newRoute.stops.map((stop, index) => (
                            <Marker
                                key={`new-stop-${index}`}
                                position={{ lat: stop.latitude, lng: stop.longitude }}
                                label={{
                                    text: (index + 1).toString(),
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => setSelectedStopIndex(index)}
                                icon={{
                                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                                    fillColor: index === 0 ? "#10B981" : index === newRoute.stops.length - 1 ? "#EF4444" : "#E7A533",
                                    fillOpacity: 1,
                                    strokeWeight: 2,
                                    strokeColor: '#ffffff',
                                    scale: 1.5,
                                    anchor: new google.maps.Point(12, 22),
                                    labelOrigin: new google.maps.Point(12, 10)
                                }}
                            />
                        ))}

                        {/* Directions Renderer */}
                        {directions && (
                            <DirectionsRenderer
                                directions={directions}
                                options={{
                                    suppressMarkers: true,
                                    polylineOptions: {
                                        strokeColor: '#0066CC',
                                        strokeOpacity: 0.8,
                                        strokeWeight: 5
                                    }
                                }}
                            />
                        )}

                        {/* Stop Info Window */}
                        {selectedStopIndex !== null && newRoute.stops[selectedStopIndex] && (
                            <InfoWindow
                                position={{ 
                                    lat: newRoute.stops[selectedStopIndex].latitude, 
                                    lng: newRoute.stops[selectedStopIndex].longitude 
                                }}
                                onCloseClick={() => setSelectedStopIndex(null)}
                                options={{ pixelOffset: new google.maps.Size(0, -30) }}
                            >
                                <StopDetailOverlay 
                                    stop={newRoute.stops[selectedStopIndex]}
                                    index={selectedStopIndex}
                                    totalStops={newRoute.stops.length}
                                    onUpdate={(field, value) => updateStop(selectedStopIndex, field, value)}
                                    onRemove={() => {
                                        removeStop(selectedStopIndex);
                                        setSelectedStopIndex(null);
                                    }}
                                    onClose={() => setSelectedStopIndex(null)}
                                />
                            </InfoWindow>
                        )}
                    </GoogleMap>
                ) : (
                    <div className="flex items-center justify-center h-[600px] bg-gray-50 text-gray-400">
                        {loadError ? 'Error loading maps' : 'Loading Map...'}
                    </div>
                )}

                {/* Floating Controls */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {/* Zoom Controls */}
                    <div className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <button 
                            onClick={() => setZoom(prev => Math.min(prev + 1, 20))}
                            className="p-3 text-gray-700 hover:bg-gray-50 transition-all border-b border-gray-100"
                            title="Zoom In"
                        >
                            <ZoomIn size={20} />
                        </button>
                        <button 
                            onClick={() => setZoom(prev => Math.max(prev - 1, 1))}
                            className="p-3 text-gray-700 hover:bg-gray-50 transition-all"
                            title="Zoom Out"
                        >
                            <ZoomOut size={20} />
                        </button>
                    </div>

                    <button 
                        onClick={() => setCenter(defaultCenter)}
                        className="p-3 bg-white text-gray-700 rounded-xl shadow-lg hover:bg-gray-50 transition-all border border-gray-100"
                        title="Recenter Map"
                    >
                        <Locate size={20} />
                    </button>

                    <button 
                        onClick={() => {
                            const newType = mapTypeId === 'roadmap' 
                                ? 'satellite' 
                                : 'roadmap';
                            setMapTypeId(newType);
                        }}
                        className={`p-3 rounded-xl shadow-lg transition-all border border-gray-100 ${mapTypeId === 'satellite' ? 'bg-[#0066CC] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        title="Toggle Satellite View"
                    >
                        <Globe size={20} />
                    </button>

                    <button 
                        onClick={() => setTilt(tilt === 0 ? 45 : 0)}
                        className={`p-3 rounded-xl shadow-lg transition-all border border-gray-100 ${tilt === 45 ? 'bg-[#0066CC] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        title="Toggle 3D Tilt"
                    >
                        <Box size={20} />
                    </button>

                    <button 
                        onClick={() => setDisplayExistingRoutes(!displayExistingRoutes)}
                        className={`p-3 rounded-xl shadow-lg transition-all border border-gray-100 ${displayExistingRoutes ? 'bg-[#0066CC] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        title="Toggle Existing Routes"
                    >
                        <Layers size={20} />
                    </button>
                </div>

                {/* Side Panel (Route Details) */}
                <div className={`absolute top-4 right-4 bottom-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : 'translate-x-[calc(100%+20px)]'}`}>
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MapIcon className="text-[#0066CC]" size={20} />
                            <h3 className="font-bold text-gray-800">
                                {isAddingRoute ? 'Create New Route' : 'Route Overview'}
                            </h3>
                        </div>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 lg:hidden"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                        {isAddingRoute ? (
                            <div className="space-y-6">
                                {/* Route Metadata */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Route Name</label>
                                        <input 
                                            type="text"
                                            value={newRoute.name}
                                            onChange={(e) => setNewRoute(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="e.g. Abuja Central Express"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Description</label>
                                        <textarea 
                                            value={newRoute.description}
                                            onChange={(e) => setNewRoute(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Describe the route..."
                                            rows={2}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/20 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Stats Bar */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                                            <Navigation size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Distance</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">{newRoute.distance.toFixed(1)} km</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                        <div className="flex items-center gap-2 text-green-600 mb-1">
                                            <Clock size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Duration</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800">
                                            {newRoute.estimatedDuration.split(':').slice(0, 2).join('h ') + 'm'}
                                        </p>
                                    </div>
                                </div>

                                {/* Stops List */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stops ({newRoute.stops.length})</label>
                                        <p className="text-[10px] text-[#0066CC] font-medium">Click map to add</p>
                                    </div>
                                    
                                    {newRoute.stops.length === 0 ? (
                                        <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                                            <MapPin size={32} className="mx-auto text-gray-200 mb-2" />
                                            <p className="text-xs text-gray-400">Click anywhere on the map<br/>to add your first stop</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {newRoute.stops.map((stop, idx) => (
                                                <div 
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedStopIndex(idx);
                                                        setCenter({ lat: stop.latitude, lng: stop.longitude });
                                                    }}
                                                    className="group flex items-center gap-3 p-3 bg-gray-50 hover:bg-white hover:shadow-md rounded-xl border border-transparent hover:border-gray-100 transition-all cursor-pointer"
                                                >
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                                                        idx === 0 ? 'bg-green-500' : idx === newRoute.stops.length - 1 ? 'bg-red-500' : 'bg-[#E7A533]'
                                                    }`}>
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-800 truncate">{stop.name}</p>
                                                        <p className="text-[10px] text-gray-400 truncate">{stop.address}</p>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeStop(idx);
                                                        }}
                                                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Search size={40} className="mx-auto text-gray-200 mb-4" />
                                <h4 className="font-bold text-gray-800 mb-2">Select a Route</h4>
                                <p className="text-xs text-gray-500 px-4">Click "Add Route" to start creating a new path or select an existing one.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        {isAddingRoute ? (
                            <div className="flex gap-3">
                                <button 
                                    onClick={onCancelAdd}
                                    className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-white transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={isCalculating || newRoute.stops.length < 2}
                                    className="flex-[2] py-3 px-4 bg-[#0066CC] text-white rounded-xl text-xs font-bold hover:bg-[#0052a3] transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                                >
                                    {isCalculating ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    Save Route
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={onCancelAdd} // This would be the "Add New" trigger from outside
                                className="w-full py-3 px-4 bg-[#E7A533] text-white rounded-xl text-xs font-bold hover:bg-[#d1942d] transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Create New Route
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar Toggle (when closed) */}
                {!sidebarOpen && (
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="absolute top-4 right-4 p-3 bg-white text-gray-700 rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition-all z-10"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </div>
    );
};

export default RouteMapView;
