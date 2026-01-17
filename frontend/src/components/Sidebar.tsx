import { useState, useRef } from 'react';
import { Plus, Trash2, Search, ChevronDown, ChevronRight, Settings, Globe, Trash, Inbox } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { Page } from '../types';
import { UserDropdown } from './UserDropdown';
import { SettingsModal } from './SettingsModal';
import { toast } from 'sonner@2.0.3';

interface SidebarProps {
  pages: Page[];
  currentPageId: string | null;
  onSelectPage: (pageId: string | null) => void;
  onCreatePage: (parentId?: string | null) => void;
  onDeletePage: (pageId: string) => void;
}

interface SidebarItemProps {
  page: Page;
  level: number;
  currentPageId: string | null;
  isExpanded: boolean;
  children: Page[];
  onSelectPage: (pageId: string) => void;
  onToggleExpand: (pageId: string) => void;
  onCreateChild: (parentId: string) => void;
  onDeletePage: (pageId: string) => void;
}

function SidebarItem({
  page,
  level,
  currentPageId,
  isExpanded,
  children,
  onSelectPage,
  onToggleExpand,
  onCreateChild,
  onDeletePage,
}: SidebarItemProps) {
  const hasChildren = children.length > 0;
  const indentClass = level > 0 ? `pl-${level * 4}` : '';
  const indentStyle = { paddingLeft: `${level * 16}px` };

  return (
    <>
      <div
        className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
          currentPageId === page.id
            ? 'bg-gray-200 dark:bg-[#2F2F2F]'
            : 'hover:bg-gray-200 dark:hover:bg-[#2F2F2F]'
        }`}
        style={indentStyle}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0" onClick={() => onSelectPage(page.id)}>
          {/* Chevron for expand/collapse */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(page.id);
            }}
            className={`flex-shrink-0 p-0.5 hover:bg-gray-300 dark:hover:bg-[#3F3F3F] rounded transition-colors ${
              hasChildren ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-[#9B9A97]" />
            ) : (
              <ChevronRight className="w-3 h-3 text-[#9B9A97]" />
            )}
          </button>

          {/* Icon and Title */}
          <span className="text-base flex-shrink-0">{page.icon}</span>
          <span className="text-sm truncate text-[#37352F] dark:text-[#E3E3E3]">{page.title}</span>
        </div>

        {/* Action Buttons (visible on hover) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateChild(page.id);
            }}
            className="p-1 hover:bg-gray-300 dark:hover:bg-[#3F3F3F] rounded transition-colors"
            title="Add child page"
          >
            <Plus className="w-3 h-3 text-[#9B9A97]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Move "${page.title}" to trash?`)) {
                onDeletePage(page.id);
              }
            }}
            className="p-1 hover:bg-gray-300 dark:hover:bg-[#3F3F3F] rounded transition-colors"
            title="Move to trash"
          >
            <Trash2 className="w-3 h-3 text-[#9B9A97]" />
          </button>
        </div>
      </div>

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <div className="space-y-0.5">
          {children.map((childPage) => (
            <SidebarItemWrapper
              key={childPage.id}
              page={childPage}
              level={level + 1}
              currentPageId={currentPageId}
              allPages={children}
              expandedIds={new Set()} // Will be passed from parent
              onSelectPage={onSelectPage}
              onToggleExpand={onToggleExpand}
              onCreateChild={onCreateChild}
              onDeletePage={onDeletePage}
            />
          ))}
        </div>
      )}
    </>
  );
}

// Wrapper component to handle children calculation
interface SidebarItemWrapperProps {
  page: Page;
  level: number;
  currentPageId: string | null;
  allPages: Page[];
  expandedIds: Set<string>;
  onSelectPage: (pageId: string) => void;
  onToggleExpand: (pageId: string) => void;
  onCreateChild: (parentId: string) => void;
  onDeletePage: (pageId: string) => void;
}

function SidebarItemWrapper({
  page,
  level,
  currentPageId,
  allPages,
  expandedIds,
  onSelectPage,
  onToggleExpand,
  onCreateChild,
  onDeletePage,
}: SidebarItemWrapperProps) {
  const children = allPages.filter((p) => p.parentId === page.id);
  const isExpanded = expandedIds.has(page.id);

  return (
    <SidebarItem
      page={page}
      level={level}
      currentPageId={currentPageId}
      isExpanded={isExpanded}
      children={children}
      onSelectPage={onSelectPage}
      onToggleExpand={onToggleExpand}
      onCreateChild={onCreateChild}
      onDeletePage={onDeletePage}
    />
  );
}

export function Sidebar({
  pages,
  currentPageId,
  onSelectPage,
  onCreatePage,
  onDeletePage,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter pages based on search query
  const filteredPages = searchQuery
    ? pages.filter((page) => page.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : pages;

  // Derive favorite pages
  const favoritePages = pages.filter((page) => page.isFavorite && !page.isDeleted);

  // Organize pages into tree structure (only when not searching)
  const rootPages = searchQuery
    ? filteredPages
    : filteredPages.filter((page) => !page.parentId);

  const handleToggleExpand = (pageId: string) => {
    const newExpandedIds = new Set(expandedIds);
    if (newExpandedIds.has(pageId)) {
      newExpandedIds.delete(pageId);
    } else {
      newExpandedIds.add(pageId);
    }
    setExpandedIds(newExpandedIds);
  };

  const handleSelectPage = (pageId: string) => {
    onSelectPage(pageId);
    navigate('/');
  };

  const handleCreateChild = (parentId: string) => {
    onCreatePage(parentId);
    // Expand the parent to show the new child
    setExpandedIds(new Set(expandedIds).add(parentId));
    navigate('/');
  };

  return (
    <aside className="w-64 min-w-[16rem] bg-gray-50 dark:bg-[#202020] flex flex-col h-full">
      {/* User/Workspace Switcher Header */}
      <div className="p-4 border-b border-gray-200 dark:border-[#2F2F2F] relative">
        <button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#2F2F2F] transition-colors"
        >
          {/* Avatar */}
          <div 
            className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center bg-[#37352F] dark:bg-[#E3E3E3] text-white dark:text-[#191919] text-xs font-medium"
          >
            U
          </div>
          {/* Workspace Name */}
          <span className="flex-1 text-sm font-medium truncate text-left text-[#37352F] dark:text-[#E3E3E3]">
            User's Workspace
          </span>
          {/* Chevron */}
          <ChevronDown size={16} className="text-[#9B9A97]" />
        </button>

        {/* User Dropdown */}
        {showUserDropdown && (
          <UserDropdown 
            onClose={() => setShowUserDropdown(false)}
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        )}
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-[#2F2F2F]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-[#2F2F2F] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-[#2F2F2F] bg-white dark:bg-[#191919] text-[#37352F] dark:text-[#E3E3E3] placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Utility Section */}
      <div className="px-2 py-3 border-b border-gray-200 dark:border-[#2F2F2F]">
        <button
          onClick={() => {
            searchInputRef.current?.focus();
          }}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-[#2F2F2F] rounded-md transition-colors cursor-pointer text-[#37352F] dark:text-[#E3E3E3]"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
        <button
          onClick={() => {
            toast.info('Inbox coming soon');
          }}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-[#2F2F2F] rounded-md transition-colors cursor-pointer text-[#37352F] dark:text-[#E3E3E3]"
        >
          <Inbox className="w-4 h-4" />
          <span>Inbox</span>
        </button>
        <button
          onClick={() => {
            onSelectPage(null);
            navigate('/feed');
          }}
          className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-[#2F2F2F] rounded-md transition-colors cursor-pointer text-[#37352F] dark:text-[#E3E3E3] ${
            location.pathname === '/feed' ? 'bg-gray-200 dark:bg-[#2F2F2F]' : ''
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Community Feed</span>
        </button>
        <button
          onClick={() => {
            onSelectPage(null);
            navigate('/trash');
          }}
          className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-[#2F2F2F] rounded-md transition-colors cursor-pointer text-[#37352F] dark:text-[#E3E3E3] ${
            location.pathname === '/trash' ? 'bg-gray-200 dark:bg-[#2F2F2F]' : ''
          }`}
        >
          <Trash className="w-4 h-4" />
          <span>Trash</span>
        </button>
      </div>

      {/* Pages Section */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-2">
          <button
            onClick={() => {
              onCreatePage(null);
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-[#2F2F2F] rounded-md transition-colors text-[#37352F] dark:text-[#E3E3E3]"
          >
            <Plus className="w-4 h-4" />
            <span>New Page</span>
          </button>
        </div>

        {/* Favorites Section */}
        {!searchQuery && favoritePages.length > 0 && (
          <div className="mb-4">
            <div className="px-2 py-1 text-xs font-semibold text-[#9B9A97] uppercase tracking-wide">
              Favorites
            </div>
            <div className="space-y-0.5 mt-1">
              {favoritePages.map((page) => (
                <div
                  key={page.id}
                  className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                    currentPageId === page.id
                      ? 'bg-gray-200 dark:bg-[#2F2F2F]'
                      : 'hover:bg-gray-200 dark:hover:bg-[#2F2F2F]'
                  }`}
                  onClick={() => handleSelectPage(page.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-base flex-shrink-0">{page.icon}</span>
                    <span className="text-sm truncate text-[#37352F] dark:text-[#E3E3E3]">{page.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Move "${page.title}" to trash?`)) {
                        onDeletePage(page.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 dark:hover:bg-[#3F3F3F] rounded transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-[#9B9A97]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-0.5">
          {searchQuery ? (
            // Flat list when searching
            filteredPages.map((page) => (
              <div
                key={page.id}
                className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                  currentPageId === page.id
                    ? 'bg-gray-200 dark:bg-[#2F2F2F]'
                    : 'hover:bg-gray-200 dark:hover:bg-[#2F2F2F]'
                }`}
                onClick={() => handleSelectPage(page.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-base flex-shrink-0">{page.icon}</span>
                  <span className="text-sm truncate text-[#37352F] dark:text-[#E3E3E3]">{page.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Move "${page.title}" to trash?`)) {
                      onDeletePage(page.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 dark:hover:bg-[#3F3F3F] rounded transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-[#9B9A97]" />
                </button>
              </div>
            ))
          ) : (
            // Tree structure when not searching
            rootPages.map((page) => (
              <SidebarItemWrapper
                key={page.id}
                page={page}
                level={0}
                currentPageId={currentPageId}
                allPages={pages}
                expandedIds={expandedIds}
                onSelectPage={handleSelectPage}
                onToggleExpand={handleToggleExpand}
                onCreateChild={handleCreateChild}
                onDeletePage={onDeletePage}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 text-xs text-[#9B9A97]">
        {pages.length} {pages.length === 1 ? 'page' : 'pages'}
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </aside>
  );
}