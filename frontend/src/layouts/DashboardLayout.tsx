import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar'; // <--- RESTORED IMPORT
import { Page } from '../types';
import { toast } from 'sonner';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { pageId } = useParams();
  const [pages, setPages] = useState<Page[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to load pages for the CURRENT user
  const loadPages = async () => {
    const userJson = localStorage.getItem('lifeflow-user');
    // Fallback: If no user is found, don't crash, just stop.
    if (!userJson) return; 
    
    const user = JSON.parse(userJson);

    try {
      // Fetch pages tagged with this User ID
      const res = await fetch(`/api/pages?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (err) {
      console.error("Failed to load pages", err);
    }
  };

  // Load pages on mount
  useEffect(() => {
    loadPages();
  }, []);

  const handleCreatePage = async (parentId?: string | null) => {
    const userJson = localStorage.getItem('lifeflow-user');
    if (!userJson) {
        toast.error("You must be logged in to create pages");
        return;
    }
    const user = JSON.parse(userJson);

    const newPage = {
        id: crypto.randomUUID(), // <--- FIX: Generate ID on the client
        title: 'Untitled',
        icon: '📄',
        parentId: parentId || null,
        userId: user.id 
    };

    try {
        const res = await fetch('/api/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPage)
        });
        
        if (res.ok) {
            loadPages(); // Refresh list
            // Optional: Navigate to new page immediately
            navigate(`/${newPage.id}`);
        } else {
            toast.error("Failed to create page");
        }
    } catch (e) {
        console.error(e);
        toast.error("Server error");
    }
  };

  const handleDeletePage = async (id: string) => {
     try {
        await fetch(`/api/pages/${id}`, { method: 'DELETE' });
        loadPages();
        navigate('/');
     } catch (e) {
        console.error(e);
     }
  };

  // Find current page title for Topbar
  const currentPage = pages.find(p => p.id === pageId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#191919]">
      <Sidebar
        pages={pages}
        currentPageId={pageId || null}
        onSelectPage={(id) => id ? navigate(`/${id}`) : navigate('/')}
        onCreatePage={handleCreatePage}
        onDeletePage={handleDeletePage}
      />
      
      <main className="flex-1 h-full flex flex-col overflow-hidden">
        {/* RESTORED TOPBAR HERE */}
        <Topbar 
            pageTitle={currentPage?.title || "Lifeflow"} 
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        {/* Pass data to EditorPage via context */}
        <div className="flex-1 overflow-auto">
             <Outlet context={{ pages, loadPages }} />
        </div>
      </main>
    </div>
  );
}