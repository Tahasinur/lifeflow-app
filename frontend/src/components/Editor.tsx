import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { ImageIcon, Image as ImageIconLucide } from 'lucide-react';
import { Page, Block } from '../types';
import { BlockComponent } from './BlockComponent';

interface EditorProps {
  page: Page;
  onUpdatePage: (page: Page) => void;
}

export function Editor({ page, onUpdatePage }: EditorProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isHoveringCover, setIsHoveringCover] = useState(false);
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleChange = (newTitle: string) => {
    onUpdatePage({
      ...page,
      title: newTitle || 'Untitled',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleIconChange = () => {
    const icons = ['📄', '📝', '📋', '📌', '💡', '🎯', '✨', '🚀', '📚', '🎨', '💼', '🏠', '⭐', '🔥', '💻', '📱'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    onUpdatePage({
      ...page,
      icon: randomIcon,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddIcon = () => {
    handleIconChange();
  };

  const handleRemoveIcon = () => {
    onUpdatePage({
      ...page,
      icon: '',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddCover = () => {
    // Random Unsplash images for covers
    const coverImages = [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
      'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200',
    ];
    const randomCover = coverImages[Math.floor(Math.random() * coverImages.length)];
    onUpdatePage({
      ...page,
      coverImage: randomCover,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleChangeCover = () => {
    handleAddCover();
  };

  const handleRemoveCover = () => {
    onUpdatePage({
      ...page,
      coverImage: null,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    const updatedBlocks = page.blocks.map((block) =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    onUpdatePage({
      ...page,
      blocks: updatedBlocks,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleBlockDelete = (blockId: string) => {
    const updatedBlocks = page.blocks.filter((block) => block.id !== blockId);
    if (updatedBlocks.length === 0) {
      // Always keep at least one block
      updatedBlocks.push({
        id: crypto.randomUUID(),
        type: 'text',
        content: '',
      });
    }
    onUpdatePage({
      ...page,
      blocks: updatedBlocks,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddBlock = (afterBlockId: string, type: Block['type'] = 'text') => {
    const blockIndex = page.blocks.findIndex((b) => b.id === afterBlockId);
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type,
      content: '',
    };
    const updatedBlocks = [...page.blocks];
    updatedBlocks.splice(blockIndex + 1, 0, newBlock);
    onUpdatePage({
      ...page,
      blocks: updatedBlocks,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleBlockTypeChange = (blockId: string, newType: Block['type']) => {
    handleBlockUpdate(blockId, { type: newType });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // Check if destination exists (user might drop outside)
    if (!destination) {
      return;
    }

    // If dropped in the same position, do nothing
    if (destination.index === source.index) {
      return;
    }

    // Reorder the blocks array
    const reorderedBlocks = Array.from(page.blocks);
    const [movedBlock] = reorderedBlocks.splice(source.index, 1);
    reorderedBlocks.splice(destination.index, 0, movedBlock);

    // Update the page with reordered blocks
    onUpdatePage({
      ...page,
      blocks: reorderedBlocks,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Cover Image Section */}
      {page.coverImage && (
        <div
          className="relative w-full h-48 group"
          onMouseEnter={() => setIsHoveringCover(true)}
          onMouseLeave={() => setIsHoveringCover(false)}
        >
          <img
            src={page.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {/* Cover Controls */}
          <div
            className={`absolute bottom-3 right-3 flex gap-2 transition-opacity ${
              isHoveringCover ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleChangeCover}
              className="px-3 py-1.5 text-sm bg-white/90 dark:bg-[#252525]/90 hover:bg-white dark:hover:bg-[#2F2F2F] text-[#37352F] dark:text-[#E3E3E3] rounded-md transition-colors backdrop-blur-sm"
            >
              Change Cover
            </button>
            <button
              onClick={handleRemoveCover}
              className="px-3 py-1.5 text-sm bg-white/90 dark:bg-[#252525]/90 hover:bg-white dark:hover:bg-[#2F2F2F] text-[#37352F] dark:text-[#E3E3E3] rounded-md transition-colors backdrop-blur-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-[900px] mx-auto px-24 py-12">
        {/* Header Section with Icon and Title */}
        <div
          className="mb-2 group"
          onMouseEnter={() => setIsHoveringHeader(true)}
          onMouseLeave={() => setIsHoveringHeader(false)}
        >
          {/* Header Controls - Hidden by default, visible on hover */}
          <div
            className={`flex items-center gap-2 mb-4 transition-opacity ${
              isHoveringHeader ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {!page.icon && (
              <button
                onClick={handleAddIcon}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#37352F] dark:text-[#E3E3E3] hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Add icon</span>
              </button>
            )}
            {!page.coverImage && (
              <button
                onClick={handleAddCover}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#37352F] dark:text-[#E3E3E3] hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded-md transition-colors"
              >
                <ImageIconLucide className="w-4 h-4" />
                <span>Add cover</span>
              </button>
            )}
          </div>

          {/* Icon - Overlaps cover slightly if cover exists */}
          {page.icon && (
            <div className={page.coverImage ? '-mt-12' : ''}>
              <button
                onClick={handleIconChange}
                className="text-[78px] leading-[1.2] mb-1 hover:opacity-70 transition-opacity"
                title="Change icon"
              >
                {page.icon}
              </button>
            </div>
          )}

          {/* Title */}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={page.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false);
                }
              }}
              className="w-full text-[40px] leading-[1.2] font-bold focus:outline-none bg-transparent text-[#37352F] dark:text-white"
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className="text-[40px] leading-[1.2] font-bold cursor-text hover:bg-gray-50/50 dark:hover:bg-white/5 px-1 -mx-1 rounded text-[#37352F] dark:text-white"
            >
              {page.title}
            </h1>
          )}
        </div>

        {/* Blocks Section */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div
                className="mt-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {page.blocks.map((block, index) => (
                  <BlockComponent
                    key={block.id}
                    block={block}
                    index={index}
                    onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
                    onDelete={() => handleBlockDelete(block.id)}
                    onAddBlock={(type) => handleAddBlock(block.id, type)}
                    onTypeChange={(newType) => handleBlockTypeChange(block.id, newType)}
                    isLast={index === page.blocks.length - 1}
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
