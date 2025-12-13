import { useState, useEffect } from 'react';
import { clientEnv } from '@/lib/env.client';

export interface ZoningData {
  address: string | null;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  zoning: {
    id: string;
    districtCode: string;
    name: string;
    description: string;
    county: string;
    municipality: string | null;
    state: string;
    isMock: boolean;
    dataSource: string | null;
    lastVerified: string | null;
  };
  permittedUses: Array<{
    category: string;
    type: string;
    status: 'allowed' | 'conditional' | 'not_allowed';
    conditions: string | null;
    notes: string | null;
  }>;
  dimensionalStandards: {
    frontSetback: number;
    sideSetback: number;
    rearSetback: number;
    maxHeight: number;
    minLotArea: number;
    minLotWidth: number;
    far: number;
    parkingRatio: number;
    parkingNotes: string;
  } | null;
  requiredPermits: Array<{
    type: string;
    required: boolean;
    conditional: boolean;
    description: string;
    link: string;
  }>;
  floodZone: {
    femaZone: string;
    floodRisk: string;
    description: string;
  } | null;
}

interface UseZoningSearchResult {
  data: ZoningData | null;
  loading: boolean;
  error: string | null;
  search: (address: string, lat?: number, lon?: number) => Promise<void>;
  reset: () => void;
}

// Helper function to geocode address using Google Maps API
async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
  const apiKey = clientEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=administrative_area:DE|country:US&key=${apiKey}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lon: location.lng,
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export function useZoningSearch(): UseZoningSearchResult {
  const [data, setData] = useState<ZoningData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (address: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      let latitude = lat;
      let longitude = lon;

      // If coordinates are not provided, try to geocode the address
      if (latitude === undefined || longitude === undefined) {
        const geocodeResult = await geocodeAddress(address);
        if (geocodeResult) {
          latitude = geocodeResult.lat;
          longitude = geocodeResult.lon;
        } else {
          throw new Error(
            'Could not find coordinates for this address. Please select an address from the autocomplete suggestions.'
          );
        }
      }

      // Fetch zoning data with coordinates
      const response = await fetch(
        `/api/zoning/search?lat=${latitude}&lon=${longitude}&address=${encodeURIComponent(address)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch zoning data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      console.error('Zoning search error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    search,
    reset,
  };
}

