/**
 * LaporAjaDulu — Presentation View Model & UI Types
 *
 * PERHATIAN:
 * Definisi tipe di bawah ini merupakan VIEW MODEL PRESENTASI SEMENTARA untuk keperluan
 * komponen UI frontend (Anggota 2). Tipe ini BUKAN merupakan domain model permanen proyek.
 * Domain entity resmi (Report, User, dsb.) akan didefinisikan oleh Anggota 1 (Lead System Architect).
 * Nantinya, layer adapter akan memetakan domain entity Anggota 1 ke tipe UIReport ini.
 */

export type ReportCategory =
  | 'infrastructure'
  | 'flood'
  | 'landslide'
  | 'fire'
  | 'other';

export type ReportUrgency =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

/**
 * UIReport — Model presentasi laporan untuk komponen peta dan kartu detail.
 */
export interface UIReport {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  urgency: ReportUrgency;
  latitude: number;
  longitude: number;
  createdAtFormatted: string;
  distanceFormatted?: string;
}
