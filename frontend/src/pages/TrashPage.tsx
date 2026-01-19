import { Trash2, RotateCcw, FileText, AlertTriangle } from 'lucide-react';
import { Page } from '../types';

interface TrashPageProps {
  trashPages: Page[];
  onRestore: (pageId: string) => void;
  onDeleteForever: (pageId: string) => void;
}

export function TrashPage({ trashPages, onRestore, onDeleteForever }: TrashPageProps) {
  if (trashPages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[#9B9A97] p-8">
        <div className="w-16 h-16 bg-gray-100 dark:bg-[#2F2F2F] rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-[#37352F] dark:text-[#E3E3E3] mb-2">Trash is empty</h2>
        <p className="max-w-md text-center">
          Pages you delete will appear here. You can restore them or delete them permanently.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-24 py-12">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200 dark:border-[#2F2F2F]">
        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-md">
          <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#37352F] dark:text-[#E3E3E3]">Trash</h1>
          <p className="text-sm text-[#9B9A97] mt-1">
            {trashPages.length} deleted {trashPages.length === 1 ? 'page' : 'pages'}
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {trashPages.map((page) => (
          <div
            key={page.id}
            className="group flex items-center justify-between p-4 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#2F2F2F] rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-[#2F2F2F] rounded text-xl">
                {page.icon || <FileText className="w-5 h-5 text-gray-400" />}
              </div>
              <div>
                <h3 className="font-medium text-[#37352F] dark:text-[#E3E3E3]">
                  {page.title || 'Untitled'}
                </h3>
                <p className="text-xs text-[#9B9A97]">
                  Last edited: {new Date(page.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onRestore(page.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                title="Restore Page"
              >
                <RotateCcw className="w-4 h-4" />
                Restore
              </button>
              
              <button
                onClick={() => {
                   if(confirm("Are you sure? This cannot be undone.")) {
                       onDeleteForever(page.id);
                   }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                title="Delete Forever"
              >
                <AlertTriangle className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}