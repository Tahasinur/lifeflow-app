import { LogOut, Moon, Sun, Check, Plus, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner@2.0.3';
import { useTheme } from '../hooks/useTheme';

interface UserDropdownProps {
  onClose: () => void;
  onOpenSettings?: () => void;
}

export function UserDropdown({ onClose, onOpenSettings }: UserDropdownProps) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    toast.success('Logged out successfully');
    onClose();
  };

  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    }
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1">
      {/* Account Switcher Section */}
      <div className="px-2 py-2">
        {/* Current Account */}
        <div className="flex items-center justify-between px-2 py-2 rounded-md bg-gray-100 dark:bg-[#2F2F2F]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center bg-[#37352F] dark:bg-[#E3E3E3] text-white dark:text-[#191919] text-xs font-medium">
              U
            </div>
            <span className="text-sm font-medium truncate text-[#37352F] dark:text-[#E3E3E3]">
              User Name
            </span>
          </div>
          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        </div>

        {/* Add Another Account */}
        <button
          onClick={() => {
            toast.info('Account switching coming soon');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2 py-2 mt-1 text-sm hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors text-[#37352F] dark:text-[#E3E3E3]"
        >
          <Plus className="w-4 h-4" />
          <span>Add another account</span>
        </button>

        {/* Create New Account */}
        <button
          onClick={() => {
            toast.info('Account creation coming soon');
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors text-[#37352F] dark:text-[#E3E3E3]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create a new account</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

      {/* Menu Items */}
      <div className="px-2 py-1">
        {/* Settings & Members */}
        {onOpenSettings && (
          <button
            onClick={handleOpenSettings}
            className="w-full flex items-center gap-3 px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors text-[#37352F] dark:text-[#E3E3E3]"
          >
            <span>Settings & members</span>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            toggleTheme();
          }}
          className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors text-[#37352F] dark:text-[#E3E3E3]"
        >
          <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Divider */}
      <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

      {/* Log Out */}
      <div className="px-2 py-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors text-[#37352F] dark:text-[#E3E3E3]"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}