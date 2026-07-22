import { useState } from 'react';
import type { RequestTab } from '@/types';
import { useCollections } from '@/hooks/useCollections';
import { savedRequestFromTab } from '@/utils/request';
import { Modal } from '@/components/UI/Modal';
import { Button } from '@/components/UI/Button';

interface SaveRequestModalProps {
  open: boolean;
  tab: RequestTab;
  onClose: () => void;
}

const NEW_COLLECTION = '__new__';

/** Lets the user save the current request into an existing or new collection. */
export function SaveRequestModal({ open, tab, onClose }: SaveRequestModalProps) {
  const { collections, createCollection, addRequestToCollection } = useCollections();
  const [name, setName] = useState(tab.name);
  const [target, setTarget] = useState<string>(
    collections.length > 0 ? collections[0].id : NEW_COLLECTION,
  );
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleSave = () => {
    const requestName = name.trim() || tab.url || 'Untitled Request';
    const saved = savedRequestFromTab(tab, requestName);

    if (target === NEW_COLLECTION) {
      // Create the collection and add the request to it in one step.
      const collectionName = newCollectionName.trim() || 'New Collection';
      const newId = createCollection(collectionName);
      addRequestToCollection(newId, saved);
    } else {
      addRequestToCollection(target, saved);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Save request"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <div className="field">
        <label className="field__label">Request name</label>
        <input
          className="field__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My request"
          autoFocus
        />
      </div>

      <div className="field">
        <label className="field__label">Collection</label>
        <select
          className="field__select"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
          <option value={NEW_COLLECTION}>+ New collection…</option>
        </select>
      </div>

      {target === NEW_COLLECTION && (
        <div className="field">
          <label className="field__label">New collection name</label>
          <input
            className="field__input"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="New Collection"
          />
        </div>
      )}
    </Modal>
  );
}
