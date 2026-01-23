import { useState, useEffect, useRef } from 'react';
import { Page } from '../types';

export function useDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  
  // Ref to store the timer for auto-save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. FETCH PAGES
  const loadPages = async () => {
    // 1. Get the current user from storage
    const userJson = localStorage.getItem('lifeflow-user');
    if (!userJson) return; // Not logged in
    const user = JSON.parse(userJson);

    try {
        // 2. Send the User ID in the URL
        const res = await fetch(`http://localhost:8080/api/pages?userId=${user.id}`);
        const data = await res.json();
        setPages(data);
    } catch (err) {
        console.error("Error loading pages:", err);
    }
};

  // 2. THE SAVER (Actual API Call)
  const saveToBackend = async (page: Page) => {
    console.log("Saving to backend...", page.title); // Debug log
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
      console.error("Save failed:", error);
    }
  };

  // 3. UPDATE PAGE (Optimistic UI + Debounced Save)
  const handleUpdatePage = async (updatedPage: Page) => {
    // A. Update UI Immediately (Fast!)
    setPages((prev) => {
      const exists = prev.find((p) => p.id === updatedPage.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedPage.id ? updatedPage : p));
      }
      return [...prev, updatedPage];
    });

    // B. Clear any pending save timer
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // C. Set a new timer (Wait 1 second before actually saving)
    saveTimeoutRef.current = setTimeout(() => {
      saveToBackend(updatedPage);
    }, 1000);
  };

  // 4. CREATE PAGE
  const handleCreatePage = async (parentId: string | null = null) => {
    let newId;
    try { newId = crypto.randomUUID(); } 
    catch (e) { newId = Date.now().toString(); }

    const newPage: Page = {
      id: newId,
      title: 'Untitled',
      icon: '📄',
      coverImage: null,
      blocks: [], // Empty blocks list
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: parentId || null,
      isFavorite: false,
      isDeleted: false,
    };

    // For creation, we save immediately (no debounce needed)
    await saveToBackend(newPage);
    
    setPages(prev => [...prev, newPage]);
    setCurrentPageId(newPage.id);
    return newPage.id;
  };

  // 5. DELETE / TRASH
  const handleMoveToTrash = async (pageId: string) => {
    setPages((prev) => 
        prev.map(p => p.id === pageId ? { ...p, isDeleted: true } : p)
    );
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
    
    // Save immediately on restore
    await saveToBackend(restoredPage);
    
    setPages(prev => prev.map(p => p.id === pageId ? restoredPage : p));
  };

  const handlePermanentDelete = async (pageId: string) => {
    setPages((prev) => prev.filter((p) => p.id !== pageId));
    // Note: You would usually add a backend call here for hard delete
  };

  const activePages = pages.filter(p => !p.isDeleted);
  const trashPages = pages.filter(p => p.isDeleted);

  return {
    pages: activePages,
    trashPages,
    currentPageId,
    setCurrentPageId,
    isLoading,
    handleCreatePage,
    handleUpdatePage,
    handleMoveToTrash,
    handleRestorePage,
    handlePermanentDelete,
  };
}