import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import type { Location, Taxi, Booking } from '@/pages/Index';

interface MapContainerProps {
  userLocation: Location | null;
  taxis: Taxi[];
  currentBooking: Booking | null;
}

export const MapContainer: React.FC<MapContainerProps> = ({ 
  userLocation, 
  taxis, 
  currentBooking 
}) => {
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-green-100 to-blue-200 opacity-50 rounded-lg"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>
      </div>

      {/* User Location */}
      {userLocation && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: '50%',
            top: '50%',
          }}
        >
          <div className="relative">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              You are here
            </div>
            {/* User location pulse effect */}
            <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
      )}

      {/* Taxi Markers */}
      {userLocation && taxis.map((taxi, index) => {
        const isBooked = currentBooking?.taxiId === taxi.id;
        const offsetX = ((taxi.location.lng - userLocation.lng) * 8000) + 50;
        const offsetY = ((userLocation.lat - taxi.location.lat) * 8000) + 50;
        
        // Keep taxis within map bounds
        const clampedX = Math.max(10, Math.min(90, offsetX));
        const clampedY = Math.max(10, Math.min(90, offsetY));
        
        return (
          <div
            key={taxi.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ${
              isBooked ? 'scale-125 z-30' : ''
            }`}
            style={{
              left: `${clampedX}%`,
              top: `${clampedY}%`,
            }}
          >
            <div className="relative group cursor-pointer">
              <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                isBooked 
                  ? 'bg-green-500 animate-bounce' 
                  : taxi.isAvailable 
                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                    : 'bg-gray-400'
              }`}>
                <Navigation className="w-3 h-3 text-white" />
              </div>
              
              {/* Taxi Info Tooltip */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="text-xs font-semibold text-gray-800">{taxi.driverName}</div>
                <div className="text-xs text-gray-600">{taxi.vehicleType}</div>
                <div className="text-xs text-gray-600">{taxi.distance}km away</div>
                <div className="text-xs text-gray-600">~{taxi.estimatedArrival} min</div>
                {isBooked && (
                  <div className="text-xs font-semibold text-green-600">Your Taxi</div>
                )}
              </div>

              {/* Direction indicator for booked taxi */}
              {isBooked && (
                <div className="absolute -inset-2 border-2 border-green-400 rounded-full animate-ping"></div>
              )}
            </div>
          </div>
        );
      })}

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-xs">
        <div className="font-semibold text-gray-800 mb-2">Map Legend</div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span>Available Taxi</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Your Booked Taxi</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
          <span>Busy Taxi</span>
        </div>
      </div>

      {/* Real-time Update Indicator */}
      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
        Live Updates
      </div>
    </div>
  );
};
