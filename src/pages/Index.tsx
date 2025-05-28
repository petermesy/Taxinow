import React, { useState, useEffect } from 'react';
import { MapContainer } from '@/components/MapContainer';
import { TaxiBooking } from '@/components/TaxiBooking';
import { LocationPicker } from '@/components/LocationPicker';
import { BookingStatus } from '@/components/BookingStatus';
import { NearbyTaxis } from '@/components/NearbyTaxis';
import { UserProfile } from '@/components/auth/UserProfile';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Taxi {
  id: string;
  driverName: string;
  vehicleType: string;
  plateNumber: string;
  rating: number;
  location: Location;
  distance: number;
  estimatedArrival: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  taxiId: string;
  status: 'searching' | 'confirmed' | 'arriving' | 'arrived' | 'completed' | 'cancelled';
  estimatedArrival: number;
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
    plateNumber: string;
    rating: number;
  };
}

const Index = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearbyTaxis, setNearbyTaxis] = useState<Taxi[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(true);

  // Simulate real-time taxi location updates every 30 seconds
  useEffect(() => {
    if (!userLocation) return;

    const generateRandomTaxis = (): Taxi[] => {
      const taxis: Taxi[] = [];
      const taxiTypes = ['Economy', 'Premium', 'SUV'];
      const drivers = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Brown', 'David Wilson'];
      
      for (let i = 0; i < 8; i++) {
        const lat = userLocation.lat + (Math.random() - 0.5) * 0.02;
        const lng = userLocation.lng + (Math.random() - 0.5) * 0.02;
        const distance = Math.random() * 5 + 0.5; // 0.5 to 5.5 km
        
        taxis.push({
          id: `taxi-${i}`,
          driverName: drivers[Math.floor(Math.random() * drivers.length)],
          vehicleType: taxiTypes[Math.floor(Math.random() * taxiTypes.length)],
          plateNumber: `ABC-${1000 + i}`,
          rating: 4.0 + Math.random() * 1.0,
          location: { lat, lng },
          distance: parseFloat(distance.toFixed(1)),
          estimatedArrival: Math.ceil(distance * 2), // Rough estimate: 2 min per km
          isAvailable: Math.random() > 0.3, // 70% available
        });
      }
      
      return taxis.sort((a, b) => a.distance - b.distance);
    };

    // Initial taxi generation
    setNearbyTaxis(generateRandomTaxis());

    // Update taxi locations every 30 seconds
    const interval = setInterval(() => {
      setNearbyTaxis(prev => prev.map(taxi => ({
        ...taxi,
        location: {
          lat: taxi.location.lat + (Math.random() - 0.5) * 0.001,
          lng: taxi.location.lng + (Math.random() - 0.5) * 0.001,
        },
        distance: parseFloat((taxi.distance + (Math.random() - 0.5) * 0.1).toFixed(1)),
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, [userLocation]);

  // Simulate booking flow
  useEffect(() => {
    if (!currentBooking) return;

    const statusFlow: Booking['status'][] = ['searching', 'confirmed', 'arriving', 'arrived'];
    let currentIndex = statusFlow.indexOf(currentBooking.status);

    if (currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      const timeout = setTimeout(() => {
        const selectedTaxi = nearbyTaxis.find(t => t.id === currentBooking.taxiId);
        
        setCurrentBooking(prev => prev ? {
          ...prev,
          status: nextStatus,
          driver: selectedTaxi ? {
            name: selectedTaxi.driverName,
            phone: '+1 234 567 8900',
            vehicle: `${selectedTaxi.vehicleType} - ${selectedTaxi.plateNumber}`,
            plateNumber: selectedTaxi.plateNumber,
            rating: selectedTaxi.rating,
          } : prev.driver,
          estimatedArrival: nextStatus === 'arriving' ? selectedTaxi?.estimatedArrival || 5 : prev.estimatedArrival
        } : null);
      }, nextStatus === 'confirmed' ? 3000 : nextStatus === 'arriving' ? 2000 : 5000);

      return () => clearTimeout(timeout);
    }
  }, [currentBooking, nearbyTaxis]);

  const handleLocationSelected = (location: Location) => {
    setUserLocation(location);
    setShowLocationPicker(false);
  };

  const handleBookTaxi = (taxiId: string) => {
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      taxiId,
      status: 'searching',
      estimatedArrival: 0,
    };
    setCurrentBooking(booking);
  };

  const handleCancelBooking = () => {
    setCurrentBooking(null);
  };

  if (showLocationPicker && !userLocation) {
    return <LocationPicker onLocationSelected={handleLocationSelected} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-4xl font-bold text-gray-800">TaxiNow</h1>
            <UserProfile />
          </div>
          <p className="text-gray-600">Find and book taxis near you in real-time</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <MapContainer 
                userLocation={userLocation}
                taxis={nearbyTaxis}
                currentBooking={currentBooking}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Booking Status */}
            {currentBooking && (
              <BookingStatus 
                booking={currentBooking}
                onCancel={handleCancelBooking}
              />
            )}

            {/* Location Display */}
            {userLocation && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Location</h3>
                <p className="text-gray-600 text-sm">
                  {userLocation.address || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
                </p>
                <button 
                  onClick={() => setShowLocationPicker(true)}
                  className="mt-3 text-blue-600 text-sm hover:text-blue-800 transition-colors"
                >
                  Change location
                </button>
              </div>
            )}

            {/* Nearby Taxis */}
            {!currentBooking && (
              <>
                <NearbyTaxis 
                  taxis={nearbyTaxis.filter(t => t.isAvailable)} 
                  onBookTaxi={handleBookTaxi}
                />
                
                <TaxiBooking 
                  taxis={nearbyTaxis.filter(t => t.isAvailable)}
                  onBookTaxi={handleBookTaxi}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
