import { useState, useEffect } from 'react';
import { Page } from '../types';

const DEFAULT_PAGES: Page[] = [
  {
    id: 'demo-welcome',
    title: 'Welcome to Lifeflow',
    icon: '👋',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    blocks: [
      {
        id: 'b-welcome-1',
        type: 'heading1',
        content: 'Getting Started',
      },
      {
        id: 'b-welcome-2',
        type: 'text',
        content: 'Welcome to Lifeflow! This is a Notion-style workspace where you can organize your thoughts, projects, and ideas.',
      },
      {
        id: 'b-welcome-3',
        type: 'heading2',
        content: 'Features',
      },
      {
        id: 'b-welcome-4',
        type: 'bulletList',
        content: 'Block-based editor with multiple content types',
      },
      {
        id: 'b-welcome-5',
        type: 'bulletList',
        content: 'Hierarchical page structure',
      },
      {
        id: 'b-welcome-6',
        type: 'bulletList',
        content: 'Multi-tab interface for quick switching',
      },
      {
        id: 'b-welcome-7',
        type: 'bulletList',
        content: 'Dark mode support',
      },
    ],
  },
  {
    id: 'demo-roadmap',
    title: 'Project Roadmap',
    icon: '🗺️',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    blocks: [
      {
        id: 'b-roadmap-1',
        type: 'text',
        content: 'This template helps you plan and track your project milestones. Use the checklist below to mark completed tasks and keep your team aligned.',
      },
      {
        id: 'b-roadmap-2',
        type: 'heading2',
        content: 'Q1 Goals',
      },
      {
        id: 'b-roadmap-3',
        type: 'todo',
        content: 'Launch MVP',
        checked: true,
      },
      {
        id: 'b-roadmap-4',
        type: 'todo',
        content: 'Implement Auth',
        checked: false,
      },
      {
        id: 'b-roadmap-5',
        type: 'heading2',
        content: 'Milestones',
      },
      {
        id: 'b-roadmap-6',
        type: 'todo',
        content: 'Define project scope and requirements',
        checked: true,
      },
      {
        id: 'b-roadmap-7',
        type: 'todo',
        content: 'Create wireframes and design mockups',
        checked: true,
      },
      {
        id: 'b-roadmap-8',
        type: 'todo',
        content: 'Set up development environment',
        checked: true,
      },
      {
        id: 'b-roadmap-9',
        type: 'todo',
        content: 'Implement core features',
        checked: false,
      },
      {
        id: 'b-roadmap-10',
        type: 'todo',
        content: 'Write documentation',
        checked: false,
      },
      {
        id: 'b-roadmap-11',
        type: 'todo',
        content: 'Conduct user testing',
        checked: false,
      },
      {
        id: 'b-roadmap-12',
        type: 'todo',
        content: 'Deploy to production',
        checked: false,
      },
    ],
  },
  {
    id: 'demo-blog',
    title: 'Engineering Blog',
    icon: '✍️',
    coverImage: 'https://images.unsplash.com/photo-1499750310159-5254f3615481?w=1200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    blocks: [
      {
        id: 'b-blog-1',
        type: 'heading1',
        content: 'The Future of AI',
      },
      {
        id: 'b-blog-2',
        type: 'text',
        content: 'Artificial intelligence is reshaping how we build software. From code generation to automated testing, AI tools are becoming essential in modern development workflows.',
      },
      {
        id: 'b-blog-3',
        type: 'text',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'b-blog-4',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDF8fHx8MTc2ODY0NTY2OHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: 'b-blog-5',
        type: 'text',
        content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. The possibilities are endless as we continue to push the boundaries of what machines can achieve.',
      },
      {
        id: 'b-blog-6',
        type: 'quote',
        content: 'The best way to predict the future is to invent it.',
      },
    ],
  },
];

export function useDashboard() {
  // Initialize pages from localStorage or use default pages
  const [allPages, setAllPages] = useState<Page[]>(() => {
    const saved = localStorage.getItem('lifeflow-pages');
    return saved ? JSON.parse(saved) : DEFAULT_PAGES;
  });

  // Initialize current page ID
  const [currentPageId, setCurrentPageId] = useState<string | null>(() => {
    const saved = localStorage.getItem('lifeflow-pages');
    if (saved) {
      const parsedPages = JSON.parse(saved);
      const firstActivePage = parsedPages.find((p: Page) => !p.isDeleted);
      return firstActivePage ? firstActivePage.id : null;
    }
    return DEFAULT_PAGES[0].id;
  });

  // Save pages to localStorage whenever they change
  useEffect(() => {
    if (allPages.length > 0) {
      localStorage.setItem('lifeflow-pages', JSON.stringify(allPages));
    }
  }, [allPages]);

  // Filter active (non-deleted) pages
  const pages = allPages.filter((p) => !p.isDeleted);
  
  // Filter trash (deleted) pages
  const trashPages = allPages.filter((p) => p.isDeleted);

  const handleCreatePage = (parentId?: string | null) => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      title: 'Untitled',
      icon: '📄',
      blocks: [
        {
          id: crypto.randomUUID(),
          type: 'text',
          content: '',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      parentId: parentId || null,
    };
    setAllPages([...allPages, newPage]);
    setCurrentPageId(newPage.id);
  };

  const handleMoveToTrash = (pageId: string) => {
    const updatedPages = allPages.map((p) =>
      p.id === pageId
        ? { ...p, isDeleted: true, deletedAt: new Date().toISOString() }
        : p
    );
    setAllPages(updatedPages);
    
    // If the current page was deleted, switch to another active page
    if (currentPageId === pageId) {
      const remainingPages = updatedPages.filter((p) => !p.isDeleted);
      setCurrentPageId(remainingPages.length > 0 ? remainingPages[0].id : null);
    }
  };

  const handleRestorePage = (pageId: string) => {
    const updatedPages = allPages.map((p) =>
      p.id === pageId
        ? { ...p, isDeleted: false, deletedAt: undefined }
        : p
    );
    setAllPages(updatedPages);
  };

  const handlePermanentDelete = (pageId: string) => {
    const updatedPages = allPages.filter((p) => p.id !== pageId);
    setAllPages(updatedPages);
  };

  const handleUpdatePage = (updatedPage: Page) => {
    setAllPages(allPages.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
  };

  return {
    pages,
    trashPages,
    currentPageId,
    setCurrentPageId,
    handleCreatePage,
    handleMoveToTrash,
    handleRestorePage,
    handlePermanentDelete,
    handleUpdatePage,
  };
}
