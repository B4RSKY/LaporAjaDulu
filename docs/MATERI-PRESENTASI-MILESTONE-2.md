# MATERI PRESENTASI MILESTONE 2 — LAPORAJADULU
## Offline-First Architecture, Secure Storage & Document Vault (SDG 11)

Dokumen ini adalah sumber materi lengkap (Source Document) untuk menyusun slide presentasi PowerPoint proyek LaporAjaDulu pada Milestone 2 (Pertemuan 10). Materi mencakup seluruh kontribusi terintegrasi dari Anggota 1, Anggota 2, dan Anggota 3.

---

## 1. IDENTITAS & KONTEKS MILESTONE 2

- **Nama Aplikasi:** LaporAjaDulu
- **Tagline:** Ada masalah? Laporin!
- **Tema:** SDG 11 — Sustainable Cities & Communities (Civic Infrastructure & Community Disaster Management)
- **Topik Milestone 2:** *Offline-First Architecture & Secure Storage Integration*
- **Sub-CPMK 8:** Mahasiswa mampu mengimplementasikan penyimpanan terenkripsi hardware-backed dan pengelolaan berkas lokal berbasis Scoped Storage.
- **Platform:** Android (Expo SDK 57, React Native 0.86.3, TypeScript Strict Mode).

---

## 2. DELIVERABLES RESMI MILESTONE 2

Berdasarkan silabus tugas besar dan fitur kunci Topik B SDG 11:
1. **Hardware-Backed Encryption:** Integrasi `expo-secure-store` untuk enkripsi data sensitif (Token, Kredensial, dan NIK pelapor).
2. **Scoped Storage Document Vault:** Pengelolaan berkas lokal terisolasi di `documentDirectory` via `expo-file-system` untuk arsip foto dan laporan warga.
3. **Just-In-Time Runtime Permissions:** Penanganan izin kamera, penyimpanan, dan lokasi saat pengguna membutuhkannya, bukan saat aplikasi pertama kali dibuka.
4. **Watermarking Otomatis Bukti Lapangan:** Penyematan metadata koordinat GPS (latitude, longitude) dan waktu akurat (timestamp) pada foto laporan untuk menjamin keaslian bukti mitigasi bencana.
5. **Interactive Report Submission UI:** Formulir pelaporan warga interaktif yang terhubung langsung ke feed peta secara real-time.

---

## 3. PEMBAGIAN PERAN & KONTRIBUSI 3 ANGGOTA

### ANGGOTA 1 — Lead System Architect & Security Engineer
**Fokus:** Enkripsi Kredensial, Arsitektur Zustand Offline-First, dan Keamanan Data.
- **Enkripsi Data Sensitif (`expo-secure-store`):** Mengamankan identitas pelapor dan token autentikasi di Android Keystore / hardware-backed TEE (Trusted Execution Environment) agar tidak dapat dibaca dari luar aplikasi.
- **Zustand Offline-First State Store:** Mengelola draf laporan lokal dan antrean sinkronisasi ketika perangkat berada di area bencana tanpa sinyal internet.
- **Architect's Audit Protocol:** Memastikan kepatuhan aturan keamanan, ketiadaan kebocoran token di log, dan validasi tipe data global untuk dokumen vault.

### ANGGOTA 2 — Lead Frontend & Performance Specialist
**Fokus:** Antarmuka Formulir, Pratinjau Watermark, Document Vault UI, dan Optimasi 60 FPS.
- **Formulir Pelaporan Warga (`CreateReportModal.tsx`):** Antarmuka modern dengan komponen `FormInput` ber-border adaptif, selektor kategori `CategoryPicker` yang ramah sentuhan (>= 48dp), dan penanganan keyboard via `KeyboardAvoidingView`.
- **Komponen Pratinjau Watermark (`WatermarkPreview.tsx`):** Visualisasi foto bukti lapangan yang dilengkapi overlay watermark permanen: koordinat lintang/bujur, tanggal/jam presisi, dan label verifikasi resmi SDG 11.
- **Layar Galeri Document Vault (`DocumentVaultModal.tsx` & `VaultItemCard.tsx`):** Menampilkan arsip foto laporan yang tersimpan di direktori lokal dengan thumbnail, ukuran berkas (MB), dan waktu pengambilan.
- **Integrasi Peta Real-Time:** Menambahkan Floating Action Buttons (*FAB*) **"➕ Lapor"** dan **"📁 Vault"** di `MapScreen.tsx`. Saat laporan baru disimpan, marker baru otomatis muncul di peta dengan animasi seleksi.
- **Optimasi Performa 60 FPS:** Memoization list kartu berkas (`React.memo`), kestabilan handler (`useCallback`), dan alur render tanpa freeze memori saat menangani preview foto resolusi tinggi.

### ANGGOTA 3 — Lead Hardware & Spatial/Network Engineer
**Fokus:** Hardware Camera, File System Sandbox, dan Alur Izin Just-In-Time.
- **Integrasi Hardware Kamera (`expo-camera`):** Pengambilan foto bukti resolusi tinggi langsung dari sensor kamera perangkat.
- **Scoped Storage Sandbox (`expo-file-system`):** Menulis dan membaca berkas foto laporan ke direktori terisolasi aplikasi (`FileSystem.documentDirectory`), memastikan kepatuhan aturan keamanan Android modern (Scoped Storage).
- **Alur Izin Just-In-Time:** Meminta izin kamera dan penyimpanan hanya saat pengguna mengetuk tombol *"Ambil Foto Bukti"*, disertai fallback visual edukatif jika izin ditolak.

---

## 4. INTEGRASI ANTARANGGOTA (SEPARATION OF CONCERNS)

1. **Frontend (Anggota 2) vs Hardware/Storage (Anggota 3):**
   - Komponen UI `WatermarkPreview` dan `VaultItemCard` menerima data path gambar dan metadata koordinat secara modular tanpa mencampurkan kode low-level native I/O.
   - Anggota 3 mengelola operasi baca/tulis berkas fisik di `documentDirectory`, sementara Anggota 2 menyajikannya dalam bentuk kartu visual yang rapi dan cepat di-scroll.
2. **Frontend (Anggota 2) vs Keamanan/State (Anggota 1):**
   - Draf laporan (`ReportDraft`) dipasok ke state store terpusat Anggota 1 untuk dienkripsi sebelum disimpan ke media penyimpanan permanen.

---

## 5. HASIL PENGUJIAN & VALIDASI TEKNIS

- **TypeScript Strict (`tsc --noEmit`):** **Exit Code 0** (Semua kontrak tipe `PhotoWatermark`, `ReportDraft`, dan `VaultItem` tervalidasi 100%).
- **Expo Doctor Check (`expo-doctor`):** Kompatibilitas Expo SDK 57 terjaga penuh.
- **Android Hermes Bundling (`expo export --platform android`):** Berhasil membundle 614 modul JavaScript/TypeScript ke Hermes Bytecode (`1.5 MB`) tanpa error dependensi.
- **Aksesibilitas (WCAG 2.1):** Seluruh tombol form dan item kartu memiliki ukuran target sentuh minimal 48 x 48 dp dengan label screen reader deskriptif.

---

## 6. KESIMPULAN & KESIAPAN MILESTONE 3

- Seluruh sasaran Milestone 2 berhasil diintegrasikan dengan baik: foto laporan ter-watermark, penyimpanan offline Scoped Storage, dan formulir interaktif warga.
- Fondasi ini siap melangkah ke **Milestone 3**:
  - Alur data reaktif tingkat lanjut menggunakan **RxJS Pipeline** (`debounceTime`, `distinctUntilChanged`, `switchMap`) untuk pencarian dan penapisan laporan bencana.
  - Penanganan pembaruan data real-time dan koneksi terputus (*Graceful Offline Fallbacks*).
