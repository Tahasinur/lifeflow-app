import { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { ImageIcon, Image as ImageIconLucide } from 'lucide-react';
import { Page, Block } from '../types';
import { BlockComponent } from './BlockComponent';

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
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Auto-fix empty pages
  useEffect(() => {
    // Check safeBlocks instead of page.blocks
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
  }, [safeBlocks.length, page.id]); // Added page.id dependency

  // ... (Keep handleTitleChange, handleIconChange, handleAddCover, etc. exactly as they were)

  // FIX: Use safeBlocks in handlers if accessing page.blocks directly
  // Actually, for handlers, it's safer to map over safeBlocks or ensure page.blocks exists
  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    const updatedBlocks = safeBlocks.map((block) =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    onUpdatePage({ ...page, blocks: updatedBlocks, updatedAt: new Date().toISOString() });
  };

  const handleBlockDelete = (blockId: string) => {
    const updatedBlocks = safeBlocks.filter((block) => block.id !== blockId);
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

  // ... (Keep the JSX return statement almost the same, but use safeBlocks.map)

  return (
    <div className="h-full overflow-y-auto">
       {/* ... (Cover and Header sections remain same) ... */}
       
       {/* Blocks Section */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div className="mt-4" {...provided.droppableProps} ref={provided.innerRef}>
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
  );
}