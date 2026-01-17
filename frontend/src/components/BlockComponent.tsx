import { useState, useRef, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Block } from '../types';
import { Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { BlockMenu } from './BlockMenu';
import { ImagePlus } from 'lucide-react';

interface BlockComponentProps {
  block: Block;
  index: number;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onAddBlock: (type: Block['type']) => void;
  onTypeChange: (type: Block['type']) => void;
  isLast: boolean;
}

export function BlockComponent({
  block,
  index,
  onUpdate,
  onDelete,
  onAddBlock,
  onTypeChange,
  isLast,
}: BlockComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [slashMenuQuery, setSlashMenuQuery] = useState('');
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedMenuIndex(0);
  }, [slashMenuQuery]);

  // Check if content starts with / and extract query
  useEffect(() => {
    if (block.content.startsWith('/')) {
      const query = block.content.slice(1);
      setSlashMenuQuery(query);
      if (!showTypeMenu) {
        setShowTypeMenu(true);
      }
    } else if (showTypeMenu) {
      setShowTypeMenu(false);
      setSlashMenuQuery('');
      setSelectedMenuIndex(0);
    }
  }, [block.content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle keyboard navigation when menu is open
    if (showTypeMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMenuIndex((prev) => prev + 1); // BlockMenu will handle bounds
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMenuIndex((prev) => Math.max(0, prev - 1));
        return;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        // Selection will be handled by BlockMenu
        return;
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowTypeMenu(false);
        setSlashMenuQuery('');
        setSelectedMenuIndex(0);
        // Clear the slash
        onUpdate({ content: '' });
        return;
      }
    }

    // Normal keyboard handling
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAddBlock('text');
      // Focus will be handled by the new block
      setTimeout(() => {
        const allTextareas = document.querySelectorAll('textarea');
        const currentIndex = Array.from(allTextareas).indexOf(e.currentTarget);
        const nextTextarea = allTextareas[currentIndex + 1] as HTMLTextAreaElement;
        if (nextTextarea) {
          nextTextarea.focus();
        }
      }, 0);
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      onDelete();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ content: e.target.value });
    adjustHeight(e.target);
  };

  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  useEffect(() => {
    if (inputRef.current) {
      adjustHeight(inputRef.current);
    }
  }, [block.content]);

  const getPlaceholder = () => {
    switch (block.type) {
      case 'heading1':
        return 'Heading 1';
      case 'heading2':
        return 'Heading 2';
      case 'heading3':
        return 'Heading 3';
      case 'quote':
        return 'Quote';
      case 'toggle':
        return 'Toggle list';
      case 'callout':
        return 'Callout text';
      default:
        return "Type '/' for commands";
    }
  };

  const getClassName = () => {
    const base = 'w-full resize-none focus:outline-none bg-transparent';
    const textColor = 'text-[#37352F] dark:text-[#D4D4D4]';
    
    switch (block.type) {
      case 'heading1':
        return `${base} ${textColor} text-[40px] leading-[1.2] font-bold`;
      case 'heading2':
        return `${base} ${textColor} text-[30px] leading-[1.3] font-bold`;
      case 'heading3':
        return `${base} ${textColor} text-[24px] leading-[1.3] font-bold`;
      case 'quote':
        return `${base} ${textColor} text-[16px] leading-[1.5] border-l-3 border-[#37352F] dark:border-gray-400 pl-4`;
      default:
        return `${base} ${textColor} text-[16px] leading-[1.5]`;
    }
  };

  const indentStyle = block.indent ? { marginLeft: `${block.indent * 24}px` } : {};

  const handleSelectFromMenu = (type: Block['type']) => {
    onTypeChange(type);
    // Clear the slash command
    onUpdate({ content: '' });
    setShowTypeMenu(false);
    setSlashMenuQuery('');
    setSelectedMenuIndex(0);
    // Refocus the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const renderBlockContent = () => {
    // Divider block - simple horizontal line
    if (block.type === 'divider') {
      return (
        <div style={indentStyle}>
          <hr className="border-t border-gray-200 dark:border-gray-700 my-4" />
        </div>
      );
    }

    // Callout block - highlighted box with icon
    if (block.type === 'callout') {
      return (
        <div 
          className="flex items-start gap-3 p-4 bg-gray-100 dark:bg-[#2F2F2F] rounded-lg" 
          style={indentStyle}
        >
          <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
          <textarea
            ref={inputRef}
            value={block.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className={`flex-1 ${getClassName()} bg-transparent`}
            rows={1}
          />
        </div>
      );
    }

    // Image block - placeholder or actual image
    if (block.type === 'image') {
      const handleAddImage = () => {
        // Random Unsplash images
        const images = [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
          'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
          'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
          'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800',
        ];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        onUpdate({ content: randomImage });
      };

      if (!block.content) {
        // Show placeholder with Add Image button
        return (
          <div style={indentStyle}>
            <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-[#2F2F2F] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <button
                onClick={handleAddImage}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[#37352F] dark:text-[#E3E3E3] hover:bg-gray-200 dark:hover:bg-[#3F3F3F] rounded-md transition-colors"
              >
                <ImagePlus className="w-5 h-5" />
                <span>Add Image</span>
              </button>
            </div>
          </div>
        );
      }

      // Show actual image
      return (
        <div style={indentStyle}>
          <div className="relative group">
            <img
              src={block.content}
              alt="Block image"
              className="w-full rounded-lg"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
              }}
            />
            <button
              onClick={handleAddImage}
              className="absolute top-2 right-2 px-3 py-1.5 text-xs bg-white/90 dark:bg-[#252525]/90 hover:bg-white dark:hover:bg-[#2F2F2F] text-[#37352F] dark:text-[#E3E3E3] rounded-md transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
            >
              Change Image
            </button>
          </div>
        </div>
      );
    }

    if (block.type === 'toggle') {
      return (
        <div className="flex items-start gap-1" style={indentStyle}>
          <button
            onClick={() => onUpdate({ isOpen: !block.isOpen })}
            className="mt-[3px] p-0.5 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded flex-shrink-0"
          >
            {block.isOpen ? (
              <ChevronDown className="w-[18px] h-[18px] text-[#37352F] dark:text-[#D4D4D4]" />
            ) : (
              <ChevronRight className="w-[18px] h-[18px] text-[#37352F] dark:text-[#D4D4D4]" />
            )}
          </button>
          <textarea
            ref={inputRef}
            value={block.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className={getClassName()}
            rows={1}
          />
        </div>
      );
    }

    if (block.type === 'todo') {
      return (
        <div className="flex items-start gap-2" style={indentStyle}>
          <input
            type="checkbox"
            checked={block.checked || false}
            onChange={(e) => onUpdate({ checked: e.target.checked })}
            className="mt-[5px] w-[16px] h-[16px] rounded border-gray-300 dark:border-gray-600"
          />
          <textarea
            ref={inputRef}
            value={block.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="To-do"
            className={`flex-1 ${getClassName()} ${
              block.checked ? 'line-through text-gray-400 dark:text-gray-600' : ''
            }`}
            rows={1}
          />
        </div>
      );
    }

    if (block.type === 'bulletList') {
      return (
        <div className="flex items-start gap-2" style={indentStyle}>
          <span className="mt-[5px] text-[#37352F] dark:text-[#D4D4D4]">•</span>
          <textarea
            ref={inputRef}
            value={block.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="List item"
            className={`flex-1 ${getClassName()}`}
            rows={1}
          />
        </div>
      );
    }

    if (block.type === 'numberList') {
      return (
        <div className="flex items-start gap-2" style={indentStyle}>
          <span className="mt-[5px] text-[#37352F] dark:text-[#D4D4D4]">1.</span>
          <textarea
            ref={inputRef}
            value={block.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="List item"
            className={`flex-1 ${getClassName()}`}
            rows={1}
          />
        </div>
      );
    }

    return (
      <div style={indentStyle}>
        <textarea
          ref={inputRef}
          value={block.content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className={getClassName()}
          rows={1}
        />
      </div>
    );
  };

  return (
    <Draggable draggableId={block.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group relative py-[3px] px-[2px] bg-white dark:bg-[#191919] ${
            snapshot.isDragging ? 'shadow-lg rounded' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start">
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-[52px] mr-[4px] pt-[3px]">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded"
              >
                <Plus className="w-[18px] h-[18px] text-gray-400 dark:text-gray-500" />
              </button>
              <button 
                {...provided.dragHandleProps}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] rounded cursor-grab active:cursor-grabbing"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400 dark:text-gray-500"
                >
                  <circle cx="6" cy="5" r="1" fill="currentColor" />
                  <circle cx="6" cy="9" r="1" fill="currentColor" />
                  <circle cx="6" cy="13" r="1" fill="currentColor" />
                  <circle cx="12" cy="5" r="1" fill="currentColor" />
                  <circle cx="12" cy="9" r="1" fill="currentColor" />
                  <circle cx="12" cy="13" r="1" fill="currentColor" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-w-0">{renderBlockContent()}</div>
          </div>

          {showMenu && (
            <BlockMenu
              onSelectType={(type) => {
                onAddBlock(type);
                setShowMenu(false);
              }}
              onClose={() => setShowMenu(false)}
              query=""
              selectedIndex={0}
            />
          )}

          {showTypeMenu && (
            <BlockMenu
              onSelectType={handleSelectFromMenu}
              onClose={() => {
                setShowTypeMenu(false);
                setSlashMenuQuery('');
                setSelectedMenuIndex(0);
              }}
              query={slashMenuQuery}
              selectedIndex={selectedMenuIndex}
            />
          )}
        </div>
      )}
    </Draggable>
  );
}