import { UIReport } from '../types/ui';

/**
 * LaporAjaDulu — Mock Data Laporan Warga (DEMO ONLY)
 *
 * PERINGATAN:
 * Data di bawah ini adalah DATA CONTOH/SIMULASI (MOCK DATA) yang digunakan khusus untuk
 * pengembangan antarmuka (UI sandbox) dan demonstrasi tata letak Milestone 1.
 * Data ini BUKAN laporan riil masyarakat dan BUKAN representasi kejadian nyata.
 * Koordinat mengacu pada area simulasi Kota Malang, Jawa Timur.
 */

export const mockReports: UIReport[] = [
  {
    id: 'rep-demo-001',
    title: 'Jalan Berlubang Parah di Jalur Utama',
    description: 'Terdapat lubang berdiameter sekitar 80 cm dengan kedalaman 15 cm yang membahayakan pengendara roda dua.',
    category: 'infrastructure',
    urgency: 'medium',
    latitude: -7.9568,
    longitude: 112.6145, // Sekitar Jl. Soekarno-Hatta, Malang
    createdAtFormatted: '10 Nov 2026, 07:15 WIB',
    distanceFormatted: '350 m',
  },
  {
    id: 'rep-demo-002',
    title: 'Genangan Banjir Luapan Drainase',
    description: 'Hujan deras mengakibatkan genangan setinggi 40 cm sepanjang 100 meter, kendaraan roda dua tidak dapat melintas.',
    category: 'flood',
    urgency: 'high',
    latitude: -7.9622,
    longitude: 112.6288, // Sekitar Klojen / Jl. Bandung, Malang
    createdAtFormatted: '10 Nov 2026, 08:40 WIB',
    distanceFormatted: '1.2 km',
  },
  {
    id: 'rep-demo-003',
    title: 'Pohon Randu Tumbang Melintang',
    description: 'Pohon tumbang menutup separuh badan jalan dan menimpa kabel penerangan jalan umum setelah angin kencang.',
    category: 'infrastructure',
    urgency: 'high',
    latitude: -7.9734,
    longitude: 112.6321, // Sekitar Jl. Ijen, Malang
    createdAtFormatted: '10 Nov 2026, 09:20 WIB',
    distanceFormatted: '2.5 km',
  },
  {
    id: 'rep-demo-004',
    title: 'Kebakaran Ilalang Dekat Pemukiman',
    description: 'Titik api terpantau merambat di lahan kosong kering dekat dinding perumahan warga, asap tebal mulai mengganggu.',
    category: 'fire',
    urgency: 'critical',
    latitude: -7.9825,
    longitude: 112.6512, // Sekitar Sawojajar, Malang
    createdAtFormatted: '10 Nov 2026, 10:05 WIB',
    distanceFormatted: '3.8 km',
  },
  {
    id: 'rep-demo-005',
    title: 'Penerangan Jalan Umum Padam Total',
    description: 'Lampu PJU sepanjang 300 meter padam selama tiga malam berturut-turut sehingga ruas jalan sangat gelap dan rawan.',
    category: 'other',
    urgency: 'low',
    latitude: -7.9405,
    longitude: 112.5982, // Sekitar Tlogomas, Malang
    createdAtFormatted: '09 Nov 2026, 21:00 WIB',
    distanceFormatted: '4.6 km',
  },
];
