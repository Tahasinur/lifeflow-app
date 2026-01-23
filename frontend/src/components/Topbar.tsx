import { Share, MessageSquare, Clock, Star, MoreHorizontal, Menu, X } from 'lucide-react';

// 1. Define the props the component expects
interface TopbarProps {
  pageTitle: string;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

// 2. Add the props to the function arguments
export function Topbar({ pageTitle, isMobileMenuOpen, onToggleMobileMenu }: TopbarProps) {
  return (
    <div className="h-12 flex items-center justify-between px-3 border-b border-gray-200 dark:border-[#2F2F2F] bg-white dark:bg-[#191919] flex-shrink-0">
      <div className="flex items-center gap-2 overflow-hidden">
        {/* Mobile Menu Button */}
        <button 
            onClick={onToggleMobileMenu}
            className="md:hidden p-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded text-[#37352F] dark:text-[#E3E3E3]"
        >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Page Title */}
        <div className="flex items-center gap-1 text-sm truncate">
            <span className="truncate font-medium text-[#37352F] dark:text-[#E3E3E3]">
                {pageTitle}
            </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded text-[#37352F] dark:text-[#E3E3E3]">
          <Share className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded text-[#37352F] dark:text-[#E3E3E3]">
          <MessageSquare className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded text-[#37352F] dark:text-[#E3E3E3]">
          <Clock className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded text-[#37352F] dark:text-[#E3E3E3]">
          <Star className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded text-[#37352F] dark:text-[#E3E3E3]">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}