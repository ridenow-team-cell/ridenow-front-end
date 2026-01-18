const GOOGLE_MAPS_API_KEY = 'AIzaSyBjpTeVMERj4TPGN8RU6UOmCtt6nnYVVqk';

export interface PlacePrediction {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

export interface PlaceDetails {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    address_components: Array<{
        long_name: string;
        short_name: string;
        types: string[];
    }>;
}

export const googleMapsService = {
    // Autocomplete place predictions
    autocomplete: async (input: string): Promise<PlacePrediction[]> => {
        if (!input || input.length < 3) return [];

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}&components=country:ng`
            );
            const data = await response.json();
            return data.predictions || [];
        } catch (error) {
            console.error('Google Maps autocomplete error:', error);
            return [];
        }
    },

    // Get place details
    getPlaceDetails: async (placeId: string): Promise<PlaceDetails | null> => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            return data.result || null;
        } catch (error) {
            console.error('Google Maps place details error:', error);
            return null;
        }
    },

    // Reverse geocode (coordinates to address)
    reverseGeocode: async (lat: number, lng: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            return data.results?.[0]?.formatted_address || 'Address not found';
        } catch (error) {
            console.error('Google Maps reverse geocode error:', error);
            return 'Address not found';
        }
    },

    // Calculate distance between two points (simplified)
    calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        // Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    // Estimate travel time (simplified - 50km/h average)
    estimateTravelTime: (distanceKm: number): string => {
        const averageSpeed = 50; // km/h
        const hours = distanceKm / averageSpeed;
        const minutes = Math.round(hours * 60);

        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hrs = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
        }
    }
};