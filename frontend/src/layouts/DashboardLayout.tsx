import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { Page } from '../types';
import { toast } from 'sonner';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { pageId } = useParams(); // 1. We grab the ID from the URL here
  const [pages, setPages] = useState<Page[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load Pages
  const loadPages = async () => {
    const userJson = localStorage.getItem('lifeflow-user');
    if (!userJson) return;
    const user = JSON.parse(userJson);
    try {
      const res = await fetch(`/api/pages?userId=${user.id}`);
      if (res.ok) setPages(await res.json());
    } catch (err) {
      console.error("Failed to load pages", err);
    }
  };

  useEffect(() => { loadPages(); }, []);

  // Create Page
  const handleCreatePage = async (parentId?: string | null) => {
    const userJson = localStorage.getItem('lifeflow-user');
    if (!userJson) { toast.error("Login required"); return; }
    const user = JSON.parse(userJson);

    const newPage = {
        id: crypto.randomUUID(),
        title: 'Untitled',
        icon: '📄',
        parentId: parentId || null,
        userId: user.id,
        blocks: [], // 2. CRITICAL: Initialize blocks to prevent Editor crash
    };

    try {
        const res = await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPage)
        });
        if (res.ok) {
            await loadPages();
            navigate(`/${newPage.id}`);
        }
    } catch (e) { toast.error("Failed to create"); }
  };

  // 3. Update Page (This was MISSING, preventing the Editor from saving)
  const handleUpdatePage = async (updatedPage: Page) => {
    // Instant UI update
    setPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));

    // Save to Backend
    try {
        await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPage)
        });
    } catch (e) { console.error("Save failed", e); }
  };

  // 4. Delete Page (Smart Redirect)
  const handleDeletePage = async (id: string) => {
     try {
        const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
        
        if (res.ok) {
            await loadPages();
            
            // 5. CRITICAL FIX: Only go Home if we deleted the ACTIVE page.
            // This stops the app from crashing by navigating away unexpectedly.
            if (pageId === id) {
                navigate('/');
            }
        }
     } catch (e) { console.error(e); }
  };

  const currentPage = pages.find(p => p.id === pageId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#191919]">
      <Sidebar
        pages={pages}
        currentPageId={pageId || null}
        onSelectPage={(id) => navigate(`/${id}`)}
        onCreatePage={handleCreatePage}
        onDeletePage={handleDeletePage}
      />
      
      <main className="flex-1 h-full flex flex-col overflow-hidden">
        <Topbar 
            pageTitle={currentPage?.title || "Lifeflow"} 
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <div className="flex-1 overflow-auto">
             {/* 6. THE MAIN FIX: Passing 'currentPageId' and 'handleUpdatePage' */}
             <Outlet context={{ 
                pages, 
                loadPages, 
                handleUpdatePage, 
                currentPageId: pageId || null 
             }} />
        </div>
      </main>
    </div>
  );
}