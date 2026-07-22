import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Collection, CollectionsFile, SavedRequest } from '@/types';
import { loadCollections, saveCollections } from '@/storage';
import { createId } from '@/utils/id';
import { validateCollectionsFile } from '@/utils/importExport';

interface CollectionsContextValue {
  collections: Collection[];
  /** Creates a collection and returns its generated id. */
  createCollection: (name: string) => string;
  renameCollection: (id: string, name: string) => void;
  deleteCollection: (id: string) => void;
  addRequestToCollection: (collectionId: string, request: SavedRequest) => void;
  removeRequestFromCollection: (collectionId: string, requestId: string) => void;
  /** Merges imported collections into the existing list. Throws on invalid input. */
  importCollections: (raw: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CollectionsContext = createContext<CollectionsContextValue | null>(null);

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>(loadCollections);

  useEffect(() => {
    saveCollections(collections);
  }, [collections]);

  const createCollection = useCallback((name: string): string => {
    const collection: Collection = {
      id: createId(),
      name: name.trim() || 'New Collection',
      requests: [],
    };
    setCollections((prev) => [...prev, collection]);
    return collection.id;
  }, []);

  const renameCollection = useCallback((id: string, name: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: name.trim() || c.name } : c)),
    );
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addRequestToCollection = useCallback(
    (collectionId: string, request: SavedRequest) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId ? { ...c, requests: [...c.requests, request] } : c,
        ),
      );
    },
    [],
  );

  const removeRequestFromCollection = useCallback(
    (collectionId: string, requestId: string) => {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? { ...c, requests: c.requests.filter((r) => r.id !== requestId) }
            : c,
        ),
      );
    },
    [],
  );

  const importCollections = useCallback((raw: string) => {
    // validateCollectionsFile throws a descriptive Error if the structure is invalid.
    const file: CollectionsFile = validateCollectionsFile(raw);
    // Re-id everything to avoid collisions with existing data.
    const imported: Collection[] = file.collections.map((c) => ({
      id: createId(),
      name: c.name,
      requests: c.requests.map((r) => ({ ...r, id: createId() })),
    }));
    setCollections((prev) => [...prev, ...imported]);
  }, []);

  const value = useMemo<CollectionsContextValue>(
    () => ({
      collections,
      createCollection,
      renameCollection,
      deleteCollection,
      addRequestToCollection,
      removeRequestFromCollection,
      importCollections,
    }),
    [
      collections,
      createCollection,
      renameCollection,
      deleteCollection,
      addRequestToCollection,
      removeRequestFromCollection,
      importCollections,
    ],
  );

  return (
    <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>
  );
}
