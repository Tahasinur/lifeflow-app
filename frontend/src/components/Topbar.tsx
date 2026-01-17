import { useState } from 'react';
import { Menu, Share2, MoreHorizontal, Star, Copy, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Page } from '../types';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Input } from './ui/input';

interface TopbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  currentPage?: Page;
  onToggleFavorite?: () => void;
}

export function Topbar({
  isSidebarOpen,
  onToggleSidebar,
  currentPage,
  onToggleFavorite,
}: TopbarProps) {
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.href;
    
    try {
      // Try modern Clipboard API first
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard');
    } catch (err) {
      // Fallback for browsers/contexts where Clipboard API is blocked
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopied(true);
          toast.success('Link copied to clipboard');
        } else {
          toast.error('Failed to copy link');
        }
      } catch (fallbackErr) {
        toast.error('Failed to copy link');
        console.error('Copy failed:', fallbackErr);
      }
    }
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="h-12 border-b border-gray-200 dark:border-[#2F2F2F] bg-white dark:bg-[#191919] flex items-center justify-between px-4">
      {/* Left: Menu Button + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Menu Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors text-[#37352F] dark:text-[#E3E3E3]"
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#37352F] dark:text-[#E3E3E3]">
          <span className="text-gray-500 dark:text-gray-400">User's Workspace</span>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          <span className="flex items-center gap-2">
            <span>{currentPage?.icon || '📄'}</span>
            <span>{currentPage?.title || 'Untitled'}</span>
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {onToggleFavorite && currentPage && (
          <button
            onClick={onToggleFavorite}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors ${
              currentPage.isFavorite
                ? 'text-yellow-400'
                : 'text-[#37352F] dark:text-[#E3E3E3]'
            }`}
            title={currentPage.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${currentPage.isFavorite ? 'fill-yellow-400' : ''}`} />
          </button>
        )}
        
        {/* Share Popover */}
        <Popover open={sharePopoverOpen} onOpenChange={setSharePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors text-[#37352F] dark:text-[#E3E3E3]"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 bg-white dark:bg-[#252525] border-gray-200 dark:border-[#2F2F2F]">
            <div className="space-y-3">
              {/* Header */}
              <div>
                <h3 className="text-sm font-semibold text-[#37352F] dark:text-[#E3E3E3]">
                  Share to web
                </h3>
              </div>

              {/* URL Input and Copy Button */}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 text-xs bg-gray-50 dark:bg-[#191919] border-gray-200 dark:border-[#2F2F2F] text-[#37352F] dark:text-[#E3E3E3]"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-black dark:bg-[#E3E3E3] text-white dark:text-[#191919] rounded-md hover:bg-gray-800 dark:hover:bg-[#FFFFFF] transition-colors whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors text-[#37352F] dark:text-[#E3E3E3]"
          onClick={() => toast.info('More options coming soon')}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
