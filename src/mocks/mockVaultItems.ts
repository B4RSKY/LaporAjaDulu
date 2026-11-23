import { VaultItem } from '../types/vault';

/**
 * LaporAjaDulu — Mock Data Scoped Storage Document Vault (DEMO ONLY)
 *
 * Simulasi berkas arsip foto laporan warga yang tersimpan di dalam sandbox
 * Scoped Storage lokal (documentDirectory) pada Milestone 2.
 */
export const mockVaultItems: VaultItem[] = [
  {
    id: 'vault-doc-001',
    fileName: 'LAPOR_20261123_081522_INFRA.jpg',
    filePath: 'file:///data/user/0/host.exp.exponent/files/vault/LAPOR_20261123_081522_INFRA.jpg',
    fileSizeBytes: 1420500,
    formattedSize: '1.4 MB',
    createdAtFormatted: '23 Nov 2026, 08:15 WIB',
    reportTitle: 'Jalan Berlubang Parah di Jalur Utama',
    category: 'infrastructure',
    thumbnailUri: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300&auto=format&fit=crop&q=60',
    watermark: {
      latitude: -7.9568,
      longitude: 112.6145,
      timestampFormatted: '23 Nov 2026, 08:15:22 WIB',
      locationLabel: 'Jl. Soekarno-Hatta, Malang',
    },
  },
  {
    id: 'vault-doc-002',
    fileName: 'LAPOR_20261123_093010_FLOOD.jpg',
    filePath: 'file:///data/user/0/host.exp.exponent/files/vault/LAPOR_20261123_093010_FLOOD.jpg',
    fileSizeBytes: 2150000,
    formattedSize: '2.1 MB',
    createdAtFormatted: '23 Nov 2026, 09:30 WIB',
    reportTitle: 'Genangan Banjir Luapan Drainase',
    category: 'flood',
    thumbnailUri: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=300&auto=format&fit=crop&q=60',
    watermark: {
      latitude: -7.9622,
      longitude: 112.6288,
      timestampFormatted: '23 Nov 2026, 09:30:10 WIB',
      locationLabel: 'Jl. Bandung / Klojen, Malang',
    },
  },
  {
    id: 'vault-doc-003',
    fileName: 'LAPOR_20261123_114500_TREE.jpg',
    filePath: 'file:///data/user/0/host.exp.exponent/files/vault/LAPOR_20261123_114500_TREE.jpg',
    fileSizeBytes: 1890000,
    formattedSize: '1.8 MB',
    createdAtFormatted: '23 Nov 2026, 11:45 WIB',
    reportTitle: 'Pohon Randu Tumbang Melintang',
    category: 'infrastructure',
    thumbnailUri: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=60',
    watermark: {
      latitude: -7.9734,
      longitude: 112.6321,
      timestampFormatted: '23 Nov 2026, 11:45:00 WIB',
      locationLabel: 'Jl. Ijen, Malang',
    },
  },
];
