/**
 * LaporAjaDulu — Document Vault & Photo Evidence Types (Milestone 2)
 *
 * Mendefinisikan tipe data untuk foto laporan dengan watermark koordinat & waktu,
 * serta representasi berkas yang tersimpan di dalam Scoped Storage (expo-file-system).
 */

import { ReportCategory, ReportUrgency } from './ui';

export interface PhotoWatermark {
  latitude: number;
  longitude: number;
  timestampFormatted: string; // Contoh: "23 Nov 2026, 21:30:00 WIB"
  locationLabel?: string;     // Contoh: "Klojen, Kota Malang"
}

export interface ReportDraft {
  title: string;
  category: ReportCategory;
  urgency: ReportUrgency;
  description: string;
  photoUri: string | null;
  watermark: PhotoWatermark | null;
}

export interface VaultItem {
  id: string;
  fileName: string;
  filePath: string;          // Path di dalam documentDirectory
  fileSizeBytes: number;
  formattedSize: string;     // Contoh: "1.4 MB"
  createdAtFormatted: string;
  reportTitle: string;
  category: ReportCategory;
  thumbnailUri: string;
  watermark: PhotoWatermark;
}
