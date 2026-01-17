import { useOutletContext } from 'react-router';
import { Editor } from '../components/Editor';
import { Page } from '../types';

interface OutletContext {
  pages: Page[];
  currentPageId: string | null;
  handleUpdatePage: (updatedPage: Page) => void;
}

export function EditorPage() {
  const { pages, currentPageId, handleUpdatePage } = useOutletContext<OutletContext>();
  
  const currentPage = pages.find((p) => p.id === currentPageId);

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-600">
        <p>Select a page or create a new one to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-[#191919]">
      <Editor page={currentPage} onUpdatePage={handleUpdatePage} />
    </div>
  );
}