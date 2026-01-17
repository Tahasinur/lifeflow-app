import { RotateCcw, Trash2 } from 'lucide-react';
import { Page } from '../types';

interface TrashPageProps {
  trashPages: Page[];
  onRestore: (pageId: string) => void;
  onPermanentDelete: (pageId: string) => void;
}

export function TrashPage({ trashPages, onRestore, onPermanentDelete }: TrashPageProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#191919]">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-[#2F2F2F] bg-white dark:bg-[#191919] px-6 py-4">
        <h1 className="text-2xl font-semibold text-[#37352F] dark:text-[#E3E3E3]">
          Trash
        </h1>
        <p className="text-sm mt-1 text-[#9B9A97]">
          Pages in trash will be kept for 30 days before permanent deletion
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-[#191919]">
        {trashPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#9B9A97]">
            <Trash2 size={48} className="mb-4 opacity-50" />
            <p className="text-lg">No pages in trash</p>
            <p className="text-sm mt-2">Deleted pages will appear here</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="space-y-2">
              {trashPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-[#202020] border border-gray-200 dark:border-[#2F2F2F] rounded-lg hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                >
                  {/* Page Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{page.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium truncate text-[#37352F] dark:text-[#E3E3E3]">
                        {page.title}
                      </h3>
                      <p className="text-xs mt-0.5 text-[#9B9A97]">
                        Deleted {formatDate(page.deletedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onRestore(page.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-[#252525] border border-gray-300 dark:border-[#2F2F2F] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2F2F2F] transition-colors text-[#37352F] dark:text-[#E3E3E3]"
                      title="Restore page"
                    >
                      <RotateCcw size={16} />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Permanently delete "${page.title}"? This action cannot be undone.`)) {
                          onPermanentDelete(page.id);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-[#252525] border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-red-600 dark:text-red-400"
                      title="Delete forever"
                    >
                      <Trash2 size={16} />
                      <span>Delete Forever</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
