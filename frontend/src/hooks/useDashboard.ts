import { useState, useEffect } from 'react';
import { Page } from '../types';

export function useDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. LOAD PAGES (GET)
  useEffect(() => {
    fetch('/api/pages')
      .then((res) => res.json())
      .then((data) => {
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

  // 2. CREATE / UPDATE (POST)
  const updatePage = async (updatedPage: Page) => {
    setPages((prev) => {
      const exists = prev.find((p) => p.id === updatedPage.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedPage.id ? updatedPage : p));
      }
      return [...prev, updatedPage];
    });

    const payload = {
      ...updatedPage,
      blocksJson: JSON.stringify(updatedPage.blocks || [])
    };

    try {
      await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to save page:", error);
    }
  };

  // --- THE FIX IS HERE ---
  const addPage = async (titleOrEvent?: string | any) => {
    // If it's a Click Event or undefined, use "Untitled", otherwise use the string provided
    const title = typeof titleOrEvent === 'string' ? titleOrEvent : 'Untitled';

    const newPage: Page = {
      id: crypto.randomUUID(),
      title,
      icon: '📄',
      coverImage: null,
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: null,
      isFavorite: false,
      isDeleted: false,
    };
    
    console.log("Adding new page:", newPage); // <--- Check your Console for this!
    await updatePage(newPage);
    return newPage.id;
  };

  // 3. DELETE (DELETE)
  const deletePage = async (pageId: string) => {
    setPages((prev) => prev.filter((p) => p.id !== pageId));
    try {
      await fetch(`/api/pages/${pageId}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  return { pages, isLoading, addPage, updatePage, deletePage };
}