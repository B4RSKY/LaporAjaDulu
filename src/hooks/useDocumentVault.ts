import { useCallback, useEffect, useMemo, useState } from 'react';
import { createAuditEvent, recordAuditEvent } from '../services/audit/activityAudit';
import { ReportDraft, VaultItem } from '../types/vault';
import {
  calculateTotalVaultSize,
  deleteVaultItem,
  loadVaultItems,
  saveReportToVault,
} from '../utils/scopedStorage';

export function useDocumentVault() {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);

  const refreshVault = useCallback(async () => {
    setIsLoading(true);
    setVaultError(null);
    try {
      const items = await loadVaultItems();
      setVaultItems(items);
    } catch {
      setVaultError('Gagal memuat berkas dari Scoped Storage.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveDraftToVault = useCallback(
    async (draft: ReportDraft): Promise<VaultItem | null> => {
      setIsLoading(true);
      setVaultError(null);
      try {
        const saved = await saveReportToVault(draft);
        if (saved) {
          recordAuditEvent(
            createAuditEvent('VAULT_DOCUMENT_SAVED', { sizeBytes: saved.fileSizeBytes })
          );
          await refreshVault();
        }
        return saved;
      } catch {
        setVaultError('Gagal menyimpan bukti laporan ke Document Vault.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshVault]
  );

  const removeVaultItem = useCallback(
    async (itemId: string): Promise<boolean> => {
      setIsLoading(true);
      setVaultError(null);
      try {
        const removed = await deleteVaultItem(itemId);
        if (removed) {
          recordAuditEvent(createAuditEvent('VAULT_DOCUMENT_DELETED'));
          await refreshVault();
        }
        return removed;
      } catch {
        setVaultError('Gagal menghapus berkas dari Document Vault.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshVault]
  );

  useEffect(() => {
    let isMounted = true;
    void loadVaultItems()
      .then((items) => {
        if (isMounted) {
          setVaultItems(items);
        }
      })
      .catch(() => {
        if (isMounted) {
          setVaultError('Gagal memuat berkas dari Scoped Storage.');
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const totalSizeFormatted = useMemo(
    () => calculateTotalVaultSize(vaultItems),
    [vaultItems]
  );

  return {
    vaultItems,
    totalSizeFormatted,
    isLoading,
    vaultError,
    refreshVault,
    saveDraftToVault,
    removeVaultItem,
  };
}