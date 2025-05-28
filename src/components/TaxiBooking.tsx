
import React, { useState } from 'react';
import { Car, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Taxi } from '@/pages/Index';

interface TaxiBookingProps {
  taxis: Taxi[];
  onBookTaxi: (taxiId: string) => void;
}

export const TaxiBooking: React.FC<TaxiBookingProps> = ({ taxis, onBookTaxi }) => {
  const [selectedTaxiType, setSelectedTaxiType] = useState<string>('');

  const taxiTypes = [
    {
      type: 'Economy',
      icon: '🚗',
      basePrice: 8,
      perKm: 1.5,
      description: 'Affordable rides'
    },
    {
      type: 'Premium',
      icon: '🚙',
      basePrice: 12,
      perKm: 2.0,
      description: 'Comfortable vehicles'
    },
    {
      type: 'SUV',
      icon: '🚙',
      basePrice: 15,
      perKm: 2.5,
      description: 'Spacious for groups'
    }
  ];

  const getAvailableTaxisByType = (type: string) => {
    return taxis.filter(taxi => taxi.vehicleType === type && taxi.isAvailable);
  };

  const getEstimatedPrice = (type: string) => {
    const typeInfo = taxiTypes.find(t => t.type === type);
    if (!typeInfo) return 0;
    
    const nearestTaxi = getAvailableTaxisByType(type)[0];
    if (!nearestTaxi) return 0;
    
    return typeInfo.basePrice + (nearestTaxi.distance * typeInfo.perKm);
  };

  const handleBookByType = (type: string) => {
    const availableTaxis = getAvailableTaxisByType(type);
    if (availableTaxis.length > 0) {
      onBookTaxi(availableTaxis[0].id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Book by Type</h3>
      
      <div className="space-y-3">
        {taxiTypes.map((typeInfo) => {
          const availableTaxis = getAvailableTaxisByType(typeInfo.type);
          const estimatedPrice = getEstimatedPrice(typeInfo.type);
          const nearestTaxi = availableTaxis[0];
          
          return (
            <Card 
              key={typeInfo.type}
              className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                selectedTaxiType === typeInfo.type 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTaxiType(typeInfo.type)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{typeInfo.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-800">{typeInfo.type}</h4>
                    <p className="text-sm text-gray-600">{typeInfo.description}</p>
                    {nearestTaxi && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          ~{nearestTaxi.estimatedArrival} min away
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  {availableTaxis.length > 0 ? (
                    <>
                      <div className="flex items-center space-x-1 text-lg font-semibold text-gray-800">
                        <DollarSign className="w-4 h-4" />
                        <span>{estimatedPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-green-600 font-medium">
                        {availableTaxis.length} available
                      </p>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">
                      No taxis available
                    </div>
                  )}
                </div>
              </div>
              
              {selectedTaxiType === typeInfo.type && availableTaxis.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookByType(typeInfo.type);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Book {typeInfo.type} - ${estimatedPrice.toFixed(2)}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Pricing Information</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p>• Base fare + distance-based pricing</p>
          <p>• Real-time estimates based on nearest taxi</p>
          <p>• No surge pricing in demo mode</p>
        </div>
      </div>
    </div>
  );
};
