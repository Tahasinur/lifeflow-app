import { useEffect, useRef } from 'react';
import { Block } from '../types';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  ChevronRight,
  Minus,
  MessageSquare,
  Image,
} from 'lucide-react';

interface BlockMenuProps {
  onSelectType: (type: Block['type']) => void;
  onClose: () => void;
  query: string;
  selectedIndex: number;
}

const blockTypes: Array<{
  type: Block['type'];
  label: string;
  icon: any;
  description: string;
  keywords: string[];
}> = [
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    description: 'Just start writing with plain text',
    keywords: ['text', 'paragraph', 'p'],
  },
  {
    type: 'heading1',
    label: 'Heading 1',
    icon: Heading1,
    description: 'Big section heading',
    keywords: ['heading', 'h1', 'title', 'big'],
  },
  {
    type: 'heading2',
    label: 'Heading 2',
    icon: Heading2,
    description: 'Medium section heading',
    keywords: ['heading', 'h2', 'subtitle', 'medium'],
  },
  {
    type: 'heading3',
    label: 'Heading 3',
    icon: Heading3,
    description: 'Small section heading',
    keywords: ['heading', 'h3', 'small'],
  },
  {
    type: 'bulletList',
    label: 'Bulleted list',
    icon: List,
    description: 'Create a simple bulleted list',
    keywords: ['bullet', 'list', 'ul', 'unordered'],
  },
  {
    type: 'numberList',
    label: 'Numbered list',
    icon: ListOrdered,
    description: 'Create a list with numbering',
    keywords: ['number', 'numbered', 'list', 'ol', 'ordered'],
  },
  {
    type: 'todo',
    label: 'To-do list',
    icon: CheckSquare,
    description: 'Track tasks with a to-do list',
    keywords: ['todo', 'task', 'checkbox', 'check', 'list'],
  },
  {
    type: 'toggle',
    label: 'Toggle list',
    icon: ChevronRight,
    description: 'Toggles can hide and show content',
    keywords: ['toggle', 'collapse', 'accordion', 'dropdown'],
  },
  {
    type: 'quote',
    label: 'Quote',
    icon: Quote,
    description: 'Capture a quote',
    keywords: ['quote', 'blockquote', 'cite'],
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    description: 'Visually divide blocks',
    keywords: ['divider', 'separator', 'line', 'hr', 'horizontal'],
  },
  {
    type: 'callout',
    label: 'Callout',
    icon: MessageSquare,
    description: 'Make writing stand out',
    keywords: ['callout', 'note', 'info', 'warning', 'alert', 'box'],
  },
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    description: 'Upload or embed with a link',
    keywords: ['image', 'picture', 'photo', 'img', 'media'],
  },
];

export function BlockMenu({ onSelectType, onClose, query, selectedIndex }: BlockMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  // Filter block types based on query
  const filteredBlockTypes = query
    ? blockTypes.filter((blockType) => {
        const searchQuery = query.toLowerCase();
        return (
          blockType.label.toLowerCase().includes(searchQuery) ||
          blockType.description.toLowerCase().includes(searchQuery) ||
          blockType.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery))
        );
      })
    : blockTypes;

  // Clamp selectedIndex to valid range
  const clampedIndex = Math.min(selectedIndex, filteredBlockTypes.length - 1);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [clampedIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Handle Enter key to select the highlighted item
  useEffect(() => {
    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && filteredBlockTypes.length > 0) {
        event.preventDefault();
        const selectedType = filteredBlockTypes[clampedIndex];
        if (selectedType) {
          onSelectType(selectedType.type);
        }
      }
    };

    document.addEventListener('keydown', handleEnter);
    return () => {
      document.removeEventListener('keydown', handleEnter);
    };
  }, [clampedIndex, filteredBlockTypes, onSelectType]);

  if (filteredBlockTypes.length === 0) {
    return (
      <div
        ref={menuRef}
        className="absolute left-0 top-full mt-1 w-80 bg-white dark:bg-[#252525] rounded-lg shadow-lg border border-gray-200 dark:border-[#2F2F2F] py-2 z-20"
      >
        <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          No results for "{query}"
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="absolute left-0 top-full mt-1 w-80 bg-white dark:bg-[#252525] rounded-lg shadow-lg border border-gray-200 dark:border-[#2F2F2F] py-2 z-20 max-h-96 overflow-y-auto"
    >
      {!query && (
        <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
          BASIC BLOCKS
        </div>
      )}
      {filteredBlockTypes.map((blockType, index) => {
        const Icon = blockType.icon;
        const isSelected = index === clampedIndex;
        return (
          <button
            key={blockType.type}
            ref={isSelected ? selectedItemRef : null}
            onClick={() => onSelectType(blockType.type)}
            className={`w-full flex items-start gap-3 px-3 py-2 transition-colors text-left ${
              isSelected
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-100 dark:hover:bg-[#2F2F2F]'
            }`}
          >
            <div className="mt-0.5 text-gray-600 dark:text-gray-400">
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${
                isSelected
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-900 dark:text-[#E3E3E3]'
              }`}>
                {blockType.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {blockType.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}