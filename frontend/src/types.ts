export interface Block {
  id: string;
  type: 'text' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberList' | 'todo' | 'quote' | 'toggle' | 'divider' | 'callout' | 'image';
  content: string;
  checked?: boolean; // for todo items
  isOpen?: boolean; // for toggle items
  indent?: number; // for nested blocks
}

export interface Page {
  id: string;
  title: string;
  icon: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  parentId?: string | null;
  coverImage?: string | null;
  isFavorite?: boolean;
}
