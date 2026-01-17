import { useState } from 'react';
import { Heart, MessageCircle, Copy, BookOpen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { FeedItem } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
} from '../components/ui/dialog';

const MOCK_FEED: FeedItem[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      avatar: 'SC',
    },
    type: 'template',
    title: 'Complete Marketing Campaign Template',
    description: 'A comprehensive template for planning and executing marketing campaigns with pre-built sections for strategy, content calendar, and analytics tracking.',
    likes: 247,
    timestamp: '2h ago',
    tags: ['Marketing', 'Templates', 'Productivity'],
  },
  {
    id: '2',
    author: {
      name: 'Davide Martinez',
      avatar: 'DM',
    },
    type: 'blog',
    title: 'Deep Work: How I Redesigned My Workspace for Focus',
    description: 'After 6 months of experimentation, here\'s how I structured my Lifeflow workspace to eliminate distractions and achieve 4+ hours of deep work daily.',
    likes: 512,
    timestamp: '5h ago',
    tags: ['Productivity', 'Deep Work', 'Best Practices'],
  },
  {
    id: '3',
    author: {
      name: 'Alex Kim',
      avatar: 'AK',
    },
    type: 'template',
    title: 'Engineering Team Weekly Sync Template',
    description: 'Streamline your team meetings with this structured template. Includes sections for blockers, wins, upcoming goals, and action items.',
    likes: 189,
    timestamp: '1d ago',
    tags: ['Engineering', 'Templates', 'Team Management'],
  },
  {
    id: '4',
    author: {
      name: 'Emma Thompson',
      avatar: 'ET',
    },
    type: 'workspace_update',
    title: 'Launched My Personal Knowledge Base',
    description: 'Just published my complete setup for managing books, articles, and research notes. 200+ linked pages and counting!',
    likes: 324,
    timestamp: '2d ago',
    tags: ['Knowledge Management', 'Personal', 'Inspiration'],
  },
];

type FilterType = 'all' | 'template' | 'blog';

export function FeedPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<FeedItem | null>(null);

  const filteredFeed = MOCK_FEED.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const toggleLike = (itemId: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleDuplicate = () => {
    toast.success('Template duplicated to your workspace');
  };

  const handleReadBlog = (item: FeedItem) => {
    setSelectedBlog(item);
    setDialogOpen(true);
  };

  const handleToggleComment = (itemId: string) => {
    if (commentingOn === itemId) {
      setCommentingOn(null);
      setCommentText('');
    } else {
      setCommentingOn(itemId);
      setCommentText('');
    }
  };

  const handleSubmitComment = (itemId: string) => {
    if (commentText.trim()) {
      toast.success('Comment posted!');
      setCommentText('');
      setCommentingOn(null);
    }
  };

  const getActionText = (type: FeedItem['type']) => {
    switch (type) {
      case 'template':
        return 'shared a template';
      case 'blog':
        return 'wrote a blog';
      case 'workspace_update':
        return 'shared a workspace update';
    }
  };

  const getActionButton = (item: FeedItem) => {
    if (item.type === 'template') {
      return (
        <button
          onClick={handleDuplicate}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-[#E3E3E3] text-white dark:text-[#191919] text-sm rounded-lg hover:bg-gray-800 dark:hover:bg-[#FFFFFF] transition-colors"
        >
          <Copy size={16} />
          <span>Duplicate</span>
        </button>
      );
    }
    return (
      <button
        onClick={() => handleReadBlog(item)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-[#2F2F2F] text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-[#2F2F2F] transition-colors text-[#37352F] dark:text-[#E3E3E3]"
      >
        <BookOpen size={16} />
        <span>Read</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#191919]">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#2F2F2F] bg-white dark:bg-[#191919] px-6 py-6">
        <h1 className="text-3xl font-semibold text-[#37352F] dark:text-[#FFFFFF]">
          Discover
        </h1>
        <p className="text-sm mt-2 text-[#9B9A97]">
          See what others are building
        </p>

        {/* Filter Pills */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-black dark:bg-[#E3E3E3] text-white dark:text-[#191919]'
                : 'bg-gray-100 dark:bg-[#2F2F2F] hover:bg-gray-200 dark:hover:bg-[#3F3F3F] text-[#37352F] dark:text-[#E3E3E3]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('template')}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              filter === 'template'
                ? 'bg-black dark:bg-[#E3E3E3] text-white dark:text-[#191919]'
                : 'bg-gray-100 dark:bg-[#2F2F2F] hover:bg-gray-200 dark:hover:bg-[#3F3F3F] text-[#37352F] dark:text-[#E3E3E3]'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setFilter('blog')}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              filter === 'blog'
                ? 'bg-black dark:bg-[#E3E3E3] text-white dark:text-[#191919]'
                : 'bg-gray-100 dark:bg-[#2F2F2F] hover:bg-gray-200 dark:hover:bg-[#3F3F3F] text-[#37352F] dark:text-[#E3E3E3]'
            }`}
          >
            Blogs
          </button>
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-[#191919]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {filteredFeed.map((item) => (
              <div key={item.id}>
                <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-[#2F2F2F] rounded-lg p-6 hover:border-gray-300 dark:hover:border-[#3F3F3F] transition-colors">
                  {/* Author Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#37352F] dark:bg-[#E3E3E3] text-white dark:text-[#191919] font-medium">
                      {item.author.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#37352F] dark:text-[#E3E3E3]">
                        <span>{item.author.name}</span>
                        <span className="font-normal ml-1 text-[#9B9A97]">
                          {getActionText(item.type)}
                        </span>
                      </div>
                      <div className="text-xs text-[#9B9A97]">
                        {item.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2 text-[#37352F] dark:text-[#FFFFFF]">
                      {item.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-[#37352F] dark:text-[#E3E3E3]">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-[#2F2F2F] rounded-full text-[#37352F] dark:text-[#E3E3E3]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-[#2F2F2F]">
                    <button
                      onClick={() => toggleLike(item.id)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-[#2F2F2F] transition-colors ${
                        likedItems.has(item.id) ? 'text-red-500' : 'text-[#37352F] dark:text-[#E3E3E3]'
                      }`}
                    >
                      <Heart
                        size={16}
                        fill={likedItems.has(item.id) ? 'currentColor' : 'none'}
                      />
                      <span>{item.likes + (likedItems.has(item.id) ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={() => handleToggleComment(item.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-[#2F2F2F] transition-colors text-[#37352F] dark:text-[#E3E3E3]"
                    >
                      <MessageCircle size={16} />
                      <span>Comment</span>
                    </button>
                    <div className="ml-auto">{getActionButton(item)}</div>
                  </div>
                </div>

                {/* Comment Input Area */}
                {commentingOn === item.id && (
                  <div className="mt-3 bg-gray-50 dark:bg-[#202020] border border-gray-200 dark:border-[#2F2F2F] rounded-lg p-4">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-[#2F2F2F] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-[#2F2F2F] bg-white dark:bg-[#191919] text-[#37352F] dark:text-[#E3E3E3] placeholder:text-gray-400"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => {
                          setCommentingOn(null);
                          setCommentText('');
                        }}
                        className="px-4 py-2 text-sm border border-gray-300 dark:border-[#2F2F2F] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2F2F2F] transition-colors text-[#37352F] dark:text-[#E3E3E3]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitComment(item.id)}
                        className="px-4 py-2 text-sm bg-black dark:bg-[#E3E3E3] text-white dark:text-[#191919] rounded-lg hover:bg-gray-800 dark:hover:bg-[#FFFFFF] transition-colors"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBlog?.title}</DialogTitle>
            <DialogClose onClose={() => setDialogOpen(false)} />
          </DialogHeader>
          <DialogBody>
            {selectedBlog && (
              <div>
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#37352F] dark:bg-white text-white dark:text-[#37352F] font-medium">
                    {selectedBlog.author.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-[#37352F] dark:text-white">{selectedBlog.author.name}</div>
                    <div className="text-sm text-[#9B9A97] dark:text-gray-400">
                      {selectedBlog.timestamp}
                    </div>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="prose max-w-none dark:prose-invert">
                  <p className="text-base leading-relaxed mb-4 text-[#37352F] dark:text-gray-300">
                    {selectedBlog.description}
                  </p>
                  <p className="text-base leading-relaxed mb-4 text-[#37352F] dark:text-gray-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                  </p>
                  <p className="text-base leading-relaxed mb-4 text-[#37352F] dark:text-gray-300">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <h3 className="text-lg font-semibold mt-6 mb-3 text-[#37352F] dark:text-white">Key Takeaways</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-[#37352F] dark:text-gray-300">
                    <li>Focus on deep work sessions of 90 minutes minimum</li>
                    <li>Create dedicated workspace sections for different tasks</li>
                    <li>Use block-based organization to reduce cognitive load</li>
                    <li>Review and refine your system weekly</li>
                  </ul>
                  <p className="text-base leading-relaxed text-[#37352F] dark:text-gray-300">
                    The journey to better productivity is ongoing, but with the right tools and
                    mindset, you can create a workspace that truly supports your goals.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {selectedBlog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-[#37352F] dark:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}