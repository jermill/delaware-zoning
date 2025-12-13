import { useState, useEffect, useRef, useCallback } from 'react';
import { clientEnv } from '@/lib/env.client';

interface PlaceResult {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface UseGooglePlacesResult {
  inputRef: React.RefObject<HTMLInputElement | null>;
  isLoaded: boolean;
  selectedPlace: PlaceResult | null;
  clearSelection: () => void;
}

export function useGooglePlaces(
  onPlaceSelected?: (place: PlaceResult) => void
): UseGooglePlacesResult {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleMapsAutocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = clientEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key is missing');
      return;
    }

    // Check if script is already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error('Failed to load Google Maps script');
    document.head.appendChild(script);

    return () => {
      // Cleanup is handled by browser
    };
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) {
      return;
    }

    try {
      // Initialize autocomplete with Delaware bounds
      const google = window.google!;
      const delawareBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(38.45, -75.79), // Southwest corner
        new google.maps.LatLng(39.84, -75.05)  // Northeast corner
      );

      // NOTE: Using deprecated Autocomplete API (still supported, not scheduled for discontinuation)
      // TODO: Migrate to google.maps.places.PlaceAutocompleteElement in future
      // See: https://developers.google.com/maps/documentation/javascript/places-migration-overview
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        bounds: delawareBounds,
        strictBounds: true,
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'geometry', 'place_id', 'address_components'],
        types: ['address'],
      });

      // Handle place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (!place?.geometry?.location) {
          console.error('No geometry found for place');
          return;
        }

        // Check if address is in Delaware
        const addressComponents = place.address_components || [];
        const stateComponent = addressComponents.find(
          (component: any) => component.types.includes('administrative_area_level_1')
        );

        if (stateComponent?.short_name !== 'DE') {
          alert('Please select an address in Delaware');
          if (inputRef.current) {
            inputRef.current.value = '';
          }
          return;
        }

        const result: PlaceResult = {
          address: place.formatted_address || '',
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          placeId: place.place_id || '',
        };

        setSelectedPlace(result);
        
        if (onPlaceSelected) {
          onPlaceSelected(result);
        }
      });
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [isLoaded, onPlaceSelected]);

  const clearSelection = useCallback(() => {
    setSelectedPlace(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  return {
    inputRef,
    isLoaded,
    selectedPlace,
    clearSelection,
  };
}

// Type declarations for Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        LatLng: any;
        LatLngBounds: any;
        places: {
          Autocomplete: any;
          PlacesServiceStatus: any;
        };
      };
    };
  }
}

// Hack to make google types available
type GoogleMapsAutocomplete = any;
type GoogleMapsLatLngBounds = any;
type GoogleMapsLatLng = any;

