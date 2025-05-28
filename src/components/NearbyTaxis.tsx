
import React from 'react';
import { Navigation, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Taxi } from '@/pages/Index';

interface NearbyTaxisProps {
  taxis: Taxi[];
  onBookTaxi: (taxiId: string) => void;
}

export const NearbyTaxis: React.FC<NearbyTaxisProps> = ({ taxis, onBookTaxi }) => {
  if (taxis.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Nearby Taxis</h3>
        <div className="text-center py-8">
          <Navigation className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No available taxis nearby</p>
          <p className="text-sm text-gray-400 mt-2">Please try again in a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Available Taxis ({taxis.length})
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {taxis.slice(0, 5).map((taxi) => (
          <div 
            key={taxi.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{taxi.driverName}</h4>
                  <p className="text-sm text-gray-600">{taxi.vehicleType}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{taxi.rating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-gray-500">{taxi.plateNumber}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapIcon className="w-4 h-4" />
                  <span>{taxi.distance} km</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>~{taxi.estimatedArrival} min</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => onBookTaxi(taxi.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
              size="sm"
            >
              Book Now
            </Button>
          </div>
        ))}
      </div>

      {taxis.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing 5 of {taxis.length} available taxis
          </p>
        </div>
      )}
    </div>
  );
};

const MapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);
