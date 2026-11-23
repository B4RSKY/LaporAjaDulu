import * as FileSystem from 'expo-file-system/legacy';
import { ReportDraft, VaultItem } from '../types/vault';

const VAULT_DIR_NAME = 'vault';
const MANIFEST_FILE_NAME = 'vault_manifest.json';

function getVaultDirUri(): string {
  if (!FileSystem.documentDirectory) {
    throw new Error('Direktori sandbox perangkat tidak tersedia.');
  }
  return `${FileSystem.documentDirectory}${VAULT_DIR_NAME}/`;
}

function getManifestUri(): string {
  return `${getVaultDirUri()}${MANIFEST_FILE_NAME}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function ensureVaultDirectory(): Promise<string> {
  const dirUri = getVaultDirUri();
  const info = await FileSystem.getInfoAsync(dirUri);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
  }
  return dirUri;
}

async function readManifest(): Promise<VaultItem[]> {
  await ensureVaultDirectory();
  const manifestUri = getManifestUri();
  const info = await FileSystem.getInfoAsync(manifestUri);
  if (!info.exists) {
    return [];
  }
  try {
    const raw = await FileSystem.readAsStringAsync(manifestUri);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as VaultItem[]) : [];
  } catch {
    return [];
  }
}

async function writeManifest(items: VaultItem[]): Promise<void> {
  await ensureVaultDirectory();
  await FileSystem.writeAsStringAsync(getManifestUri(), JSON.stringify(items));
}

export async function loadVaultItems(): Promise<VaultItem[]> {
  const items = await readManifest();
  const validItems: VaultItem[] = [];

  for (const item of items) {
    const fileInfo = await FileSystem.getInfoAsync(item.filePath);
    if (fileInfo.exists && !fileInfo.isDirectory) {
      validItems.push(item);
    }
  }

  if (validItems.length !== items.length) {
    await writeManifest(validItems);
  }

  return validItems;
}

export async function saveReportToVault(draft: ReportDraft): Promise<VaultItem | null> {
  if (!draft.photoUri || !draft.watermark) {
    return null;
  }

  const vaultDir = await ensureVaultDirectory();
  const now = new Date();
  const dateStamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const timeStamp = `${String(now.getHours()).padStart(2, '0')}${String(
    now.getMinutes()
  ).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const catCode = draft.category.toUpperCase();
  const extension = draft.photoUri.split('.').pop()?.split('?')[0] || 'jpg';
  const fileName = `LAPOR_${dateStamp}_${timeStamp}_${catCode}.${extension}`;
  const destinationUri = `${vaultDir}${fileName}`;

  await FileSystem.copyAsync({
    from: draft.photoUri,
    to: destinationUri,
  });

  const fileInfo = await FileSystem.getInfoAsync(destinationUri);
  const fileSizeBytes = fileInfo.exists && !fileInfo.isDirectory ? fileInfo.size : 0;

  const createdAtFormatted = `${now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}, ${now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })} WIB`;

  const newItem: VaultItem = {
    id: `vault-doc-${Date.now()}`,
    fileName,
    filePath: destinationUri,
    fileSizeBytes,
    formattedSize: formatFileSize(fileSizeBytes),
    createdAtFormatted,
    reportTitle: draft.title.trim() || 'Laporan Lapangan',
    category: draft.category,
    thumbnailUri: destinationUri,
    watermark: draft.watermark,
  };

  const existingItems = await loadVaultItems();
  await writeManifest([newItem, ...existingItems]);

  return newItem;
}

export async function deleteVaultItem(itemId: string): Promise<boolean> {
  const items = await loadVaultItems();
  const target = items.find((item) => item.id === itemId);
  if (!target) {
    return false;
  }

  await FileSystem.deleteAsync(target.filePath, { idempotent: true });
  const remaining = items.filter((item) => item.id !== itemId);
  await writeManifest(remaining);

  return true;
}

export function calculateTotalVaultSize(items: VaultItem[]): string {
  const totalBytes = items.reduce((sum, item) => sum + item.fileSizeBytes, 0);
  return formatFileSize(totalBytes);
}