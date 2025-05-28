
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Location } from '@/pages/Index';

interface LocationPickerProps {
  onLocationSelected: (location: Location) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelected }) => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location'
          };
          onLocationSelected(location);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to a default location (New York City)
          const fallbackLocation: Location = {
            lat: 40.7128,
            lng: -74.0060,
            address: 'New York City, NY (Demo Location)'
          };
          onLocationSelected(fallbackLocation);
          setIsLoading(false);
        }
      );
    } else {
      // Geolocation not supported, use demo location
      const demoLocation: Location = {
        lat: 40.7128,
        lng: -74.0060,
        address: 'New York City, NY (Demo Location)'
      };
      onLocationSelected(demoLocation);
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      // In a real app, you would geocode the address
      // For demo, we'll use a random location near NYC
      const location: Location = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        address: address.trim()
      };
      onLocationSelected(location);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">TaxiNow</h1>
          <p className="text-gray-600">Set your pickup location to find nearby taxis</p>
        </div>

        <div className="space-y-6">
          {/* Current Location Button */}
          <Button
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center space-x-2"
          >
            <Navigation className="w-5 h-5" />
            <span>{isLoading ? 'Getting location...' : 'Use Current Location'}</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          {/* Manual Address Input */}
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your address
              </label>
              <Input
                id="address"
                type="text"
                placeholder="e.g., 123 Main St, New York, NY"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={!address.trim()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3"
            >
              Set Pickup Location
            </Button>
          </form>

          {/* Demo Locations */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">Quick demo locations:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLocationSelected({
                  lat: 40.7589,
                  lng: -73.9851,
                  address: 'Times Square, NYC'
                })}
                className="text-xs"
              >
                Times Square
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLocationSelected({
                  lat: 40.6892,
                  lng: -74.0445,
                  address: 'Brooklyn Bridge, NYC'
                })}
                className="text-xs"
              >
                Brooklyn Bridge
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            This is a demo app. In production, you would connect to a real backend with PostgreSQL and Socket.IO.
          </p>
        </div>
      </div>
    </div>
  );
};
