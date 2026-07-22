import { useRef, useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { useTabs } from '@/hooks/useTabs';
import { tabFromSavedRequest } from '@/utils/request';
import { downloadCollection } from '@/utils/importExport';
import { methodColor } from '@/components/UI/MethodBadge';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from '@/components/UI/Icons';

/** Sidebar panel for managing collections and their saved requests. */
export function Collections() {
  const {
    collections,
    createCollection,
    renameCollection,
    deleteCollection,
    removeRequestFromCollection,
    importCollections,
  } = useCollections();
  const { openTab } = useTabs();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCreate = () => {
    createCollection(newName);
    setNewName('');
    setCreateOpen(false);
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importCollections(String(reader.result));
        setImportError(null);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Failed to import file.');
      }
    };
    reader.onerror = () => setImportError('Could not read the file.');
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="sidebar__section-head">
        <span className="sidebar__section-title">Collections</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="icon-btn"
            onClick={() => fileInput.current?.click()}
            title="Import collection"
            aria-label="Import collection"
          >
            <UploadIcon size={15} />
          </button>
          <button
            className="icon-btn"
            onClick={() => setCreateOpen(true)}
            title="New collection"
            aria-label="New collection"
          >
            <PlusIcon size={16} />
          </button>
        </div>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
          e.target.value = '';
        }}
      />

      {importError && (
        <div className="error-card" style={{ margin: 12 }}>
          <div className="error-card__icon">⚠️</div>
          <div>
            <div className="error-card__title">Import failed</div>
            <div className="error-card__message">{importError}</div>
          </div>
        </div>
      )}

      {collections.length === 0 ? (
        <p className="empty-state">
          No collections yet.
          <br />
          Create one or import a JSON file.
        </p>
      ) : (
        collections.map((collection) => {
          const isOpen = expanded[collection.id] ?? false;
          return (
            <div className="collection" key={collection.id}>
              <div className="collection__head" onClick={() => toggle(collection.id)}>
                {isOpen ? (
                  <ChevronDownIcon size={15} style={{ color: 'var(--text-faint)' }} />
                ) : (
                  <ChevronRightIcon size={15} style={{ color: 'var(--text-faint)' }} />
                )}
                <span className="collection__name">{collection.name}</span>
                <span className="collection__count">{collection.requests.length}</span>
                <div
                  className="list-item__actions"
                  style={{ opacity: 1 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="icon-btn"
                    onClick={() =>
                      setRenaming({ id: collection.id, name: collection.name })
                    }
                    title="Rename"
                    aria-label="Rename collection"
                  >
                    <PencilIcon size={14} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => downloadCollection(collection)}
                    title="Export"
                    aria-label="Export collection"
                  >
                    <DownloadIcon size={14} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => deleteCollection(collection.id)}
                    title="Delete"
                    aria-label="Delete collection"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="collection__requests">
                  {collection.requests.length === 0 ? (
                    <p className="empty-state" style={{ padding: '12px 14px' }}>
                      Empty collection.
                    </p>
                  ) : (
                    collection.requests.map((req) => (
                      <div
                        className="collection__request"
                        key={req.id}
                        onClick={() => openTab(tabFromSavedRequest(req))}
                        title="Load request"
                      >
                        <span
                          className="list-item__method"
                          style={{ color: methodColor(req.method) }}
                        >
                          {req.method}
                        </span>
                        <div className="list-item__main">
                          <div className="list-item__title">{req.name}</div>
                          <div className="list-item__sub">{req.url}</div>
                        </div>
                        <div className="list-item__actions">
                          <button
                            className="icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRequestFromCollection(collection.id, req.id);
                            }}
                            aria-label="Remove request"
                          >
                            <TrashIcon size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Create collection modal */}
      <Modal
        open={createOpen}
        title="New collection"
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
          </>
        }
      >
        <div className="field">
          <label className="field__label">Collection name</label>
          <input
            className="field__input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="My Collection"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
        </div>
      </Modal>

      {/* Rename collection modal */}
      <Modal
        open={renaming !== null}
        title="Rename collection"
        onClose={() => setRenaming(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRenaming(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (renaming) renameCollection(renaming.id, renaming.name);
                setRenaming(null);
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="field">
          <label className="field__label">Collection name</label>
          <input
            className="field__input"
            value={renaming?.name ?? ''}
            onChange={(e) =>
              setRenaming((prev) => (prev ? { ...prev, name: e.target.value } : prev))
            }
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
