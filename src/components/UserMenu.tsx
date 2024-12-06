import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Settings, LogOut, User } from 'lucide-react';
import { ChangePasswordForm } from './Auth/ChangePasswordForm';

export const UserMenu: React.FC = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <>
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <User className="h-4 w-4" />
          <span className="font-medium">{user?.name}</span>
          <Settings className="h-4 w-4" />
        </button>
        
        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Change Password</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
};