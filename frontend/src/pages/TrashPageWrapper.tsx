import { useOutletContext } from 'react-router';
import { TrashPage } from './TrashPage';
import { Page } from '../types';

interface OutletContext {
  trashPages: Page[];
  handleRestorePage: (pageId: string) => void;
  handlePermanentDelete: (pageId: string) => void;
}

export function TrashPageWrapper() {
  const { trashPages, handleRestorePage, handlePermanentDelete } = useOutletContext<OutletContext>();

  return (
    <TrashPage
      trashPages={trashPages}
      onRestore={handleRestorePage}
      onPermanentDelete={handlePermanentDelete}
    />
  );
}