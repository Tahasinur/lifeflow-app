import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Copy, BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
} from '../components/ui/dialog';

// Data Shape from Backend
interface FeedItem {
    id: string;
    title: string;
    description: string;
    authorName: string;
    authorAvatar: string;
    type: 'template' | 'blog' | 'workspace_update';
    likes: number;
    tags: string[];
    createdAt: string;
}

export function FeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<FeedItem | null>(null);

  // 1. Load Real Data
  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      // Add ?t=... to force a fresh network request (Cache Busting)
      const res = await fetch(`/api/feed?t=${Date.now()}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Server returned:", data); // Check your browser console!
        // Sort newest first just in case
        const sortedData = data.sort((a: FeedItem, b: FeedItem) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedItems(sortedData);
      }
    } catch (err) {
      console.error("Failed to load feed:", err);
      toast.error("Could not load feed");
    }
  };

  // 2. Post Demo Data
  const handleCreateDemoPost = async () => {
    const newItem = {
        title: "My Project Update",
        description: "I just built this feature using React and Spring Boot!",
        authorName: "You",
        authorAvatar: "ME",
        type: "workspace_update",
        tags: ["Dev", "Spring Boot"],
    };

    try {
        await fetch('/api/feed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });
        toast.success("Post created!");
        loadFeed(); 
    } catch (e) {
        toast.error("Failed to create post");
    }
  };

  const filteredFeed = feedItems.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const toggleLike = async (itemId: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) newSet.delete(itemId);
      else newSet.add(itemId);
      return newSet;
    });
    try {
        await fetch(`/api/feed/${itemId}/like`, { method: 'POST' });
        loadFeed();
    } catch (e) { console.error(e); }
  };

  const getActionText = (type: FeedItem['type']) => {
    switch (type) {
      case 'template': return 'shared a template';
      case 'blog': return 'wrote a blog';
      case 'workspace_update': return 'shared a workspace update';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#191919]">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#2F2F2F] bg-white dark:bg-[#191919] px-6 py-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-semibold text-[#37352F] dark:text-[#FFFFFF]">Discover</h1>
                <p className="text-sm mt-2 text-[#9B9A97]">See what others are building</p>
            </div>
            <button 
                onClick={handleCreateDemoPost}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
                <Plus size={16} />
                Post Update
            </button>
        </div>

        <div className="flex gap-2 mt-6">
          {['all', 'template', 'blog'].map((f) => (
             <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm rounded-full transition-colors capitalize ${
                  filter === f
                    ? 'bg-black dark:bg-[#E3E3E3] text-white dark:text-[#191919]'
                    : 'bg-gray-100 dark:bg-[#2F2F2F] hover:bg-gray-200 dark:hover:bg-[#3F3F3F] text-[#37352F] dark:text-[#E3E3E3]'
                }`}
              >
                {f}
              </button>
          ))}
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-[#191919]">
        <div className="max-w-3xl mx-auto px-6 py-8">
            {filteredFeed.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No posts yet. Click "Post Update" to start!
                </div>
            )}

          <div className="space-y-6">
            {filteredFeed.map((item) => (
              <div key={item.id} className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-[#2F2F2F] rounded-lg p-6 hover:border-gray-300 dark:hover:border-[#3F3F3F] transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#37352F] dark:bg-[#E3E3E3] text-white dark:text-[#191919] font-medium">
                      {item.authorAvatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#37352F] dark:text-[#E3E3E3]">
                        <span>{item.authorName}</span>
                        <span className="font-normal ml-1 text-[#9B9A97]">{getActionText(item.type)}</span>
                      </div>
                      <div className="text-xs text-[#9B9A97]">{new Date(item.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2 text-[#37352F] dark:text-[#FFFFFF]">{item.title}</h2>
                    <p className="text-sm leading-relaxed text-[#37352F] dark:text-[#E3E3E3]">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-[#2F2F2F]">
                    <button onClick={() => toggleLike(item.id)} className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-[#2F2F2F] transition-colors ${likedItems.has(item.id) ? 'text-red-500' : 'text-[#37352F] dark:text-[#E3E3E3]'}`}>
                      <Heart size={16} fill={likedItems.has(item.id) ? 'currentColor' : 'none'} />
                      <span>{item.likes}</span>
                    </button>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}