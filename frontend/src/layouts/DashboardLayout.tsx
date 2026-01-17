import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardLayout() {
  const {
    pages,
    trashPages,
    currentPageId,
    setCurrentPageId,
    handleCreatePage,
    handleMoveToTrash,
    handleRestorePage,
    handlePermanentDelete,
    handleUpdatePage,
  } = useDashboard();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const currentPage = pages.find((p) => p.id === currentPageId);

  return (
    <div className="flex h-screen bg-white dark:bg-[#191919]">
      {/* Sidebar - animated wrapper */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200 dark:border-[#2F2F2F] ${
          isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <Sidebar
          pages={pages}
          currentPageId={currentPageId}
          onSelectPage={setCurrentPageId}
          onCreatePage={handleCreatePage}
          onDeletePage={handleMoveToTrash}
        />
      </div>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          currentPage={currentPage}
          onToggleFavorite={
            currentPage
              ? () => handleUpdatePage({ ...currentPage, isFavorite: !currentPage.isFavorite })
              : undefined
          }
        />
        <Outlet
          context={{
            pages,
            trashPages,
            currentPageId,
            handleUpdatePage,
            handleRestorePage,
            handlePermanentDelete,
          }}
        />
      </main>
    </div>
  );
}