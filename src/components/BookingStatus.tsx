
import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  Navigation, 
  Phone, 
  X, 
  Star,
  MapPin 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Booking } from '@/pages/Index';

interface BookingStatusProps {
  booking: Booking;
  onCancel: () => void;
}

export const BookingStatus: React.FC<BookingStatusProps> = ({ booking, onCancel }) => {
  const getStatusInfo = () => {
    switch (booking.status) {
      case 'searching':
        return {
          title: 'Finding your taxi...',
          description: 'Looking for the best driver nearby',
          icon: <Clock className="w-6 h-6 text-yellow-500 animate-spin" />,
          color: 'yellow'
        };
      case 'confirmed':
        return {
          title: 'Taxi confirmed!',
          description: 'Your driver is getting ready',
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          color: 'green'
        };
      case 'arriving':
        return {
          title: 'Driver is on the way',
          description: `Arriving in ${booking.estimatedArrival} minutes`,
          icon: <Navigation className="w-6 h-6 text-blue-500 animate-pulse" />,
          color: 'blue'
        };
      case 'arrived':
        return {
          title: 'Your taxi has arrived!',
          description: 'Please head to the pickup location',
          icon: <MapPin className="w-6 h-6 text-green-500 animate-bounce" />,
          color: 'green'
        };
      default:
        return {
          title: 'Booking in progress',
          description: 'Please wait...',
          icon: <Clock className="w-6 h-6 text-gray-500" />,
          color: 'gray'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="p-6 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {statusInfo.icon}
          <div>
            <h3 className="font-semibold text-gray-800">{statusInfo.title}</h3>
            <p className="text-sm text-gray-600">{statusInfo.description}</p>
          </div>
        </div>
        {booking.status === 'searching' && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onCancel}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Searching</span>
          <span>Confirmed</span>
          <span>Arriving</span>
          <span>Arrived</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              statusInfo.color === 'yellow' ? 'bg-yellow-400' :
              statusInfo.color === 'green' ? 'bg-green-400' :
              statusInfo.color === 'blue' ? 'bg-blue-400' : 'bg-gray-400'
            }`}
            style={{
              width: booking.status === 'searching' ? '25%' :
                     booking.status === 'confirmed' ? '50%' :
                     booking.status === 'arriving' ? '75%' :
                     booking.status === 'arrived' ? '100%' : '0%'
            }}
          ></div>
        </div>
      </div>

      {/* Driver Information */}
      {booking.driver && booking.status !== 'searching' && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-3">Your Driver</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Name:</span>
              <span className="font-medium">{booking.driver.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vehicle:</span>
              <span className="font-medium">{booking.driver.vehicle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{booking.driver.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {booking.driver && booking.status !== 'searching' && (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={() => window.open(`tel:${booking.driver!.phone}`)}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Driver
          </Button>
        )}
        
        {booking.status !== 'arrived' && booking.status !== 'completed' && (
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={onCancel}
          >
            Cancel Booking
          </Button>
        )}
      </div>

      {/* Booking ID */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Booking ID: {booking.id}
        </p>
      </div>
    </Card>
  );
};
