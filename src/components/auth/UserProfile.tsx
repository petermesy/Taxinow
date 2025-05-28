
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, LogIn } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const UserProfile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Button
          onClick={() => setShowAuthModal(true)}
          variant="outline"
          size="sm"
          className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Driver/Admin Login
        </Button>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  return (
    <div className="flex items-center space-x-4 bg-white rounded-lg px-4 py-2 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.userType}</p>
        </div>
      </div>
      <Button
        onClick={logout}
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-gray-800"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};
