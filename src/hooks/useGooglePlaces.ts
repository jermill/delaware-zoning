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
  reinitialize: () => void;
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
    // Ensure we're in the browser
    if (typeof window === 'undefined') {
      console.log('[useGooglePlaces] Not in browser environment');
      return;
    }
    
    const apiKey = clientEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    console.log('[useGooglePlaces] API key check:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey) {
      console.error('[useGooglePlaces] Google Maps API key is missing');
      return;
    }

    // Check if script is already loaded
    if (typeof window !== 'undefined' && window.google?.maps?.places) {
      console.log('[useGooglePlaces] Google Maps already loaded');
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      console.log('[useGooglePlaces] Google Maps script already in DOM, waiting for load...');
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          console.log('[useGooglePlaces] Google Maps loaded successfully');
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Load the script
    console.log('[useGooglePlaces] Loading Google Maps script...');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('[useGooglePlaces] Google Maps script loaded successfully');
      setIsLoaded(true);
    };
    script.onerror = (error) => {
      console.error('[useGooglePlaces] Failed to load Google Maps script:', error);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup is handled by browser
    };
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    console.log('[useGooglePlaces] Autocomplete init check:', {
      isLoaded,
      hasInput: !!inputRef.current,
      hasAutocomplete: !!autocompleteRef.current,
      hasGoogle: !!window.google
    });

    if (!isLoaded || !inputRef.current || autocompleteRef.current) {
      return;
    }
    
    // Double check we're in browser and google is available
    if (typeof window === 'undefined' || !window.google) {
      console.error('[useGooglePlaces] Google Maps not available');
      return;
    }

    try {
      console.log('[useGooglePlaces] Initializing autocomplete...');
      
      // Initialize autocomplete with Delaware bounds
      const google = window.google;
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

      console.log('[useGooglePlaces] Autocomplete initialized successfully');

      // Handle place selection
      autocompleteRef.current.addListener('place_changed', () => {
        console.log('[useGooglePlaces] Place changed event fired');
        const place = autocompleteRef.current?.getPlace();
        console.log('[useGooglePlaces] Selected place:', place);
        
        if (!place?.geometry?.location) {
          console.error('[useGooglePlaces] No geometry found for place');
          return;
        }

        // Check if address is in Delaware
        const addressComponents = place.address_components || [];
        const stateComponent = addressComponents.find(
          (component: any) => component.types.includes('administrative_area_level_1')
        );

        console.log('[useGooglePlaces] State component:', stateComponent);

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

        console.log('[useGooglePlaces] Place result:', result);
        setSelectedPlace(result);
        
        if (onPlaceSelected) {
          onPlaceSelected(result);
        }
      });
    } catch (error) {
      console.error('[useGooglePlaces] Error initializing Google Places Autocomplete:', error);
    }
  }, [isLoaded]); // Removed onPlaceSelected from dependencies to prevent re-initialization

  const clearSelection = useCallback(() => {
    console.log('[useGooglePlaces] Clearing selection');
    setSelectedPlace(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    // Clear autocomplete reference to allow re-initialization
    if (autocompleteRef.current && typeof window !== 'undefined' && window.google) {
      try {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      } catch (e) {
        console.error('[useGooglePlaces] Error clearing listeners:', e);
      }
      autocompleteRef.current = null;
    }
  }, []);

  const reinitialize = useCallback(() => {
    console.log('[useGooglePlaces] Forcing reinitialize');
    // Clear existing autocomplete
    if (autocompleteRef.current && typeof window !== 'undefined' && window.google) {
      try {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      } catch (e) {
        console.error('[useGooglePlaces] Error clearing listeners:', e);
      }
      autocompleteRef.current = null;
    }
    
    // Trigger re-initialization by updating a counter or similar
    // The useEffect will handle the actual initialization
    if (isLoaded && inputRef.current && typeof window !== 'undefined' && window.google) {
      try {
        console.log('[useGooglePlaces] Reinitializing autocomplete...');
        
        const google = window.google;

        const delawareBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(38.45, -75.79),
          new google.maps.LatLng(39.84, -75.05)
        );

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          bounds: delawareBounds,
          strictBounds: true,
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'geometry', 'place_id', 'address_components'],
          types: ['address'],
        });

        console.log('[useGooglePlaces] Autocomplete reinitialized successfully');

        autocompleteRef.current.addListener('place_changed', () => {
          console.log('[useGooglePlaces] Place changed event fired');
          const place = autocompleteRef.current?.getPlace();
          console.log('[useGooglePlaces] Selected place:', place);
          
          if (!place?.geometry?.location) {
            console.error('[useGooglePlaces] No geometry found for place');
            return;
          }

          const addressComponents = place.address_components || [];
          const stateComponent = addressComponents.find(
            (component: any) => component.types.includes('administrative_area_level_1')
          );

          console.log('[useGooglePlaces] State component:', stateComponent);

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

          console.log('[useGooglePlaces] Place result:', result);
          setSelectedPlace(result);
          
          if (onPlaceSelected) {
            onPlaceSelected(result);
          }
        });
      } catch (error) {
        console.error('[useGooglePlaces] Error reinitializing autocomplete:', error);
      }
    }
  }, [isLoaded, onPlaceSelected]);

  return {
    inputRef,
    isLoaded,
    selectedPlace,
    clearSelection,
    reinitialize,
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


