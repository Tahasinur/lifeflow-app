import { useState, useEffect } from 'react';
import { Page } from '../types';

export function useDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  // 1. FETCH ALL PAGES ON LOAD
  useEffect(() => {
    fetch('/api/pages')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
            console.error("API Error:", data);
            setPages([]);
            return;
        }
        // Convert 'blocksJson' string back to array if needed
        const formattedPages = data.map((p: any) => ({
          ...p,
          blocks: p.blocksJson ? JSON.parse(p.blocksJson) : []
        }));
        setPages(formattedPages);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load pages:", err);
        setIsLoading(false);
      });
  }, []);

  // --- HELPERS ---
  
  // Save to Backend
  const saveToBackend = async (page: Page) => {
    const payload = {
      ...page,
      blocksJson: JSON.stringify(page.blocks || [])
    };
    try {
      await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  // --- ACTIONS (Matching DashboardLayout names) ---

  const handleUpdatePage = async (updatedPage: Page) => {
    setPages((prev) => {
      const exists = prev.find((p) => p.id === updatedPage.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedPage.id ? updatedPage : p));
      }
      return [...prev, updatedPage];
    });
    await saveToBackend(updatedPage);
  };

  const handleCreatePage = async (parentId: string | null = null) => {
    // 1. Generate ID safely
    let newId;
    try { newId = crypto.randomUUID(); } 
    catch (e) { newId = Date.now().toString(); }

    // 2. Create Object
    const newPage: Page = {
      id: newId,
      title: 'Untitled',
      icon: '📄',
      coverImage: null,
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: parentId || null, // Ensure null if undefined
      isFavorite: false,
      isDeleted: false,
    };

    console.log("Creating page with Parent ID:", parentId);

    // 3. Update State & Backend
    await handleUpdatePage(newPage);
    
    // 4. Select it immediately
    setCurrentPageId(newPage.id);
    return newPage.id;
  };

  const handleMoveToTrash = async (pageId: string) => {
    // Optimistic: Mark as deleted locally
    setPages((prev) => 
        prev.map(p => p.id === pageId ? { ...p, isDeleted: true } : p)
    );

    // Call Backend Delete
    try {
      await fetch(`/api/pages/${pageId}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleRestorePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    const restoredPage = { ...page, isDeleted: false };
    await handleUpdatePage(restoredPage);
  };

  const handlePermanentDelete = async (pageId: string) => {
    // For now, we'll just remove it from UI. 
    // (Real hard-delete endpoint requires backend update, but this is okay for MVP)
    setPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  // --- FILTERED LISTS ---
  // Active pages are those NOT deleted
  const activePages = pages.filter(p => !p.isDeleted);
  // Trash pages are those deleted
  const trashPages = pages.filter(p => p.isDeleted);

  return {
    pages: activePages,     // Only show active pages in Sidebar
    trashPages,             // Show deleted pages in Trash
    currentPageId,
    setCurrentPageId,
    isLoading,
    handleCreatePage,       // Matches DashboardLayout
    handleUpdatePage,       // Matches DashboardLayout
    handleMoveToTrash,      // Matches DashboardLayout
    handleRestorePage,      // Matches DashboardLayout
    handlePermanentDelete,  // Matches DashboardLayout
  };
}