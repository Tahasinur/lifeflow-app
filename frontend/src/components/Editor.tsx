import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { ImageIcon, Smile, X, Image as ImageIconLucide } from 'lucide-react';
import { Page, Block } from '../types';
import { BlockComponent } from './BlockComponent';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EditorProps {
  page: Page;
  onUpdatePage: (page: Page) => void;
}

const generateId = () => {
  try { return crypto.randomUUID(); } 
  catch (e) { return Date.now().toString() + Math.random().toString(36).substring(2); }
};

export function Editor({ page, onUpdatePage }: EditorProps) {
  // CRITICAL FIX: Ensure blocks is always an array
  const safeBlocks = page.blocks || [];

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isHoveringCover, setIsHoveringCover] = useState(false);
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  // 1. Auto-fix empty pages (Initialize with one block)
  useEffect(() => {
    if (safeBlocks.length === 0) {
      const newBlock: Block = {
        id: generateId(),
        type: 'text',
        content: '',
      };
      onUpdatePage({
        ...page,
        blocks: [newBlock],
        updatedAt: new Date().toISOString(),
      });
    }
  }, [safeBlocks.length, page.id]);

  // 2. Adjust Title Height
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.style.height = 'auto';
      titleInputRef.current.style.height = titleInputRef.current.scrollHeight + 'px';
    }
  }, [page.title]);

  // --- HANDLERS (Restored) ---

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdatePage({ ...page, title: e.target.value });
  };

  const handleAddIcon = () => {
    onUpdatePage({ ...page, icon: '📄' });
  };

  const handleRemoveIcon = () => {
    onUpdatePage({ ...page, icon: '' }); // Or null, depending on your type
  };

  const handleIconChange = (newIcon: string) => {
    onUpdatePage({ ...page, icon: newIcon });
  };

  const handleAddCover = () => {
    const randomCover = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200';
    onUpdatePage({ ...page, coverImage: randomCover });
  };

  const handleChangeCover = () => {
    // For now, just another random image. 
    // In a real app, this would open a picker.
    const covers = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200',
    ];
    const random = covers[Math.floor(Math.random() * covers.length)];
    onUpdatePage({ ...page, coverImage: random });
  };

  const handleRemoveCover = () => {
    onUpdatePage({ ...page, coverImage: null });
  };

  // --- BLOCK HANDLERS ---

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    const updatedBlocks = safeBlocks.map((block) =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    onUpdatePage({ ...page, blocks: updatedBlocks, updatedAt: new Date().toISOString() });
  };

  const handleBlockDelete = (blockId: string) => {
    const updatedBlocks = safeBlocks.filter((block) => block.id !== blockId);
    // Always ensure at least one block exists
    if (updatedBlocks.length === 0) {
      updatedBlocks.push({ id: generateId(), type: 'text', content: '' });
    }
    onUpdatePage({ ...page, blocks: updatedBlocks, updatedAt: new Date().toISOString() });
  };

  const handleAddBlock = (afterBlockId: string, type: Block['type'] = 'text') => {
    const blockIndex = safeBlocks.findIndex((b) => b.id === afterBlockId);
    if (blockIndex === -1) return;
    
    const newBlock: Block = { id: generateId(), type, content: '' };
    const updatedBlocks = [...safeBlocks];
    updatedBlocks.splice(blockIndex + 1, 0, newBlock);
    onUpdatePage({ ...page, blocks: updatedBlocks, updatedAt: new Date().toISOString() });
  };
  
  const handleBlockTypeChange = (blockId: string, newType: Block['type']) => {
    handleBlockUpdate(blockId, { type: newType });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;

    const reorderedBlocks = Array.from(safeBlocks);
    const [movedBlock] = reorderedBlocks.splice(source.index, 1);
    reorderedBlocks.splice(destination.index, 0, movedBlock);

    onUpdatePage({ ...page, blocks: reorderedBlocks, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-[#191919]">
      
      {/* 1. COVER IMAGE SECTION */}
      <div 
        className="group relative w-full h-48 sm:h-60 lg:h-72 bg-gray-50 dark:bg-[#202020] transition-colors"
        onMouseEnter={() => setIsHoveringCover(true)}
        onMouseLeave={() => setIsHoveringCover(false)}
      >
        {page.coverImage ? (
          <>
             {/* Use your custom component or standard img */}
             <img 
                src={page.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
             />
             {isHoveringCover && (
                <div className="absolute bottom-4 right-20 flex gap-2">
                   <button 
                      onClick={handleChangeCover}
                      className="px-2 py-1 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-xs text-gray-600 dark:text-gray-200 rounded shadow-sm backdrop-blur-sm transition-colors"
                   >
                      Change cover
                   </button>
                   <button 
                      onClick={handleRemoveCover}
                      className="px-2 py-1 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-xs text-gray-600 dark:text-gray-200 rounded shadow-sm backdrop-blur-sm transition-colors"
                   >
                      Remove
                   </button>
                </div>
             )}
          </>
        ) : (
           // Placeholder when no cover exists (only visible on hover of header area usually, 
           // but for simplicity we hide it unless hovered or just show nothing)
           <div className="w-full h-full hidden group-hover:block bg-gray-100/50 dark:bg-[#2F2F2F]/50" />
        )}
      </div>

      {/* 2. HEADER CONTENT (Icon, Title, Meta-buttons) */}
      <div 
         className="max-w-[900px] mx-auto px-12 sm:px-24 pb-4 -mt-12 relative z-10"
         onMouseEnter={() => setIsHoveringHeader(true)}
         onMouseLeave={() => setIsHoveringHeader(false)}
      >
         {/* Icon */}
         <div className="group/icon relative inline-block mb-4">
             {page.icon ? (
                 <div className="text-[78px] leading-none select-none transition-transform hover:scale-105 cursor-pointer">
                    {page.icon}
                    {/* Remove Icon Button (on hover) */}
                    <div 
                        onClick={(e) => { e.stopPropagation(); handleRemoveIcon(); }}
                        className="absolute -top-2 -right-2 p-1 bg-gray-200 dark:bg-[#3F3F3F] rounded-full opacity-0 group-hover/icon:opacity-100 cursor-pointer transition-opacity"
                    >
                        <X size={12} className="text-gray-500 dark:text-gray-300" />
                    </div>
                 </div>
             ) : (
                 // If no icon, show placeholder logic if needed, or nothing
                 null
             )}
         </div>

         {/* Meta Buttons (Add Icon / Add Cover) */}
         {/* Visible if no cover/icon OR if hovering header */}
         <div className={`flex gap-4 text-gray-400 dark:text-gray-500 mb-2 transition-opacity duration-200 ${
             isHoveringHeader || !page.icon || !page.coverImage ? 'opacity-100' : 'opacity-0'
         }`}>
             {!page.icon && (
                 <button 
                    onClick={handleAddIcon}
                    className="flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] px-2 py-1 rounded text-sm transition-colors"
                 >
                    <Smile size={16} /> Add icon
                 </button>
             )}
             {!page.coverImage && (
                 <button 
                    onClick={handleAddCover}
                    className="flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] px-2 py-1 rounded text-sm transition-colors"
                 >
                    <ImageIconLucide size={16} /> Add cover
                 </button>
             )}
         </div>

         {/* Title Input */}
         <textarea
            ref={titleInputRef}
            value={page.title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full resize-none overflow-hidden bg-transparent text-4xl font-bold text-[#37352F] dark:text-[#E3E3E3] placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none leading-tight"
            rows={1}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Focus the first block
                    // Implementation detail: You might need a ref to the first block or simple DOM lookup
                    const firstBlock = document.querySelector('textarea[placeholder="Type \'/\' for commands"]');
                    (firstBlock as HTMLElement)?.focus();
                }
            }}
         />
      </div>

       {/* 3. BLOCKS SECTION (Drag & Drop) */}
       <div className="max-w-[900px] mx-auto px-12 sm:px-24 pb-32">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-[2px]">
                {safeBlocks.map((block, index) => (
                  <BlockComponent
                    key={block.id}
                    block={block}
                    index={index}
                    onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
                    onDelete={() => handleBlockDelete(block.id)}
                    onAddBlock={(type) => handleAddBlock(block.id, type)}
                    onTypeChange={(newType) => handleBlockTypeChange(block.id, newType)}
                    isLast={index === safeBlocks.length - 1}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
       </div>

    </div>
  );
}