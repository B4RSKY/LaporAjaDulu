# MATERI PRESENTASI MILESTONE 1 — LAPORAJADULU
## Community Disaster Management & Civic Infrastructure (SDG 11)

Dokumen ini adalah sumber materi lengkap (Source Document) untuk menyusun slide presentasi PowerPoint proyek LaporAjaDulu pada Milestone 1. Materi mencakup seluruh kontribusi dari Anggota 1, Anggota 2, dan Anggota 3.

---

## 1. IDENTITAS & KONTEKS PROYEK

- **Nama Aplikasi:** LaporAjaDulu
- **Tagline:** Ada masalah? Laporin!
- **Tema:** SDG 11 — Sustainable Cities & Communities (Civic Infrastructure & Community Disaster Management)
- **Fokus Aplikasi:** Platform pelaporan infrastruktur kota yang rusak (jalan berlubang, lampu PJU padam, pohon tumbang) dan sistem peringatan dini bencana berbasis komunitas (crowdsourced disaster mitigation seperti banjir dan kebakaran).
- **Target Platform:** Android (Expo SDK 57, React Native 0.86.3, TypeScript Strict Mode).
- **Identitas Visual:** Modern, clean, profesional dengan gaya **Soft Neumorphism Realistis** dan warna branding utama **Biru**.

---

## 2. DELIVERABLES RESMI MILESTONE 1

Berdasarkan capaian Milestone 1 (Inisialisasi LBS & Interactive Mapping Engine):
1. **Konfigurasi Peta & Lokasi:** Setup `react-native-maps` dan `expo-location` pada ekosistem Expo SDK 57.
2. **LBS Tracking Adaptif:** Desain custom hook `useLocationTracking` dengan `distanceInterval` adaptif (efisiensi baterai & akurasi pergerakan).
3. **Komputasi Spasial:** Custom Markers dan kalkulasi jarak lurus presisi menggunakan formulasi matematis Haversine.
4. **Fondasi UI/UX & Arsitektur:** Struktur folder modular, Design System terpusat berbasis WCAG 2.1, Safe Area Android modern, serta optimasi render 60 FPS.

---

## 3. PEMBAGIAN PERAN & KONTRIBUSI 3 ANGGOTA

### ANGGOTA 1 — Lead System Architect & Security Engineer
**Fokus:** Arsitektur Global, Type Safety, State Management, dan Security Boundary.
- **Arsitektur State Global:** Merancang pola Unidirectional Data Flow (UDF) menggunakan Zustand Store terpusat (`src/store/`) untuk mengelola feed laporan bencana secara reaktif tanpa re-render berlebih.
- **Domain Modeling & Type Safety:** Mendefinisikan entity domain global (`Report`, `User`, `Coordinate`, status penanganan) yang menjamin integritas data di seluruh layer aplikasi.
- **Security & Storage Boundaries:** Menyiapkan protokol keamanan data, pencegahan hardcoded secret/API key, serta audit kesiapan Scoped Storage untuk dokumen laporan.
- **Architect's Audit Protocol & CI/CD:** Menyusun checklist audit arsitektur kode dan workflow deployment EAS Build.

### ANGGOTA 2 — Lead Frontend & Performance Specialist
**Fokus:** UI Deklaratif, Design System, Aksesibilitas, dan Optimasi Render 60 FPS.
- **Blue Design System:** Menyusun token desain terpusat (`src/theme/`) dengan evaluasi matematis kontras warna **WCAG 2.1 AA/AAA** (Text Primary 13.43:1, Text Secondary 5.99:1, Text Muted 5.03:1).
- **Soft Neumorphism Realistis Android:** Presets elevasi halus (`neuFlat`, `neuRaised`, `neuPressed`) dengan border highlight specular (`#FFFFFF`) dan bayangan lembut (`#D0DFEE`) yang ringan dirender di Android.
- **Atomic Reusable UI Components:** Membangun komponen base `NeuCard` serta empat status UI esensial: `LoadingState`, `ErrorState`, `EmptyState`, dan `PermissionState` (dengan touch target minimal 48dp).
- **Presentational Map Components:**
  - `ReportMarker`: Pin visual dua tingkat (badge kategori + pointer lancip) dengan visual selected state terangkat (scale 1.15, elevation 6).
  - `SelectedReportCard`: Floating bottom card ringkasan laporan proporsional (maxHeight 280dp agar tidak menutupi peta).
  - `MapControls`: Floating buttons (Re-center & Refresh) murni presentasional.
  - `MapPlaceholder`: Sandbox peta simulasi Kota Malang untuk validasi layout Flexbox.
- **Safe Area Android Modern:** Mengintegrasikan `react-native-safe-area-context` dan mengeliminasi `SafeAreaView` bawaan React Native yang sudah deprecated oleh Meta.
- **Optimasi Performa 60 FPS (Frame Budget 16.6ms):**
  - Isolasi re-render menggunakan `React.memo` pada seluruh marker dan kontrol.
  - Stabilitas fungsi menggunakan `useCallback` dan identitas list menggunakan stable key berbasis ID unik.
  - Pembersihan memory leak timer menggunakan `useRef` dan unmount cleanup.

### ANGGOTA 3 — Lead Hardware & Spatial/Network Engineer
**Fokus:** Hardware Sensor, LBS, Komputasi Spasial Haversine, dan Runtime Permissions.
- **Konfigurasi Hardware & Runtime Permission:** Mengelola izin akses sensor lokasi perangkat (`ACCESS_FINE_LOCATION` & `ACCESS_COARSE_LOCATION`) via `expo-location` dengan penanganan status *undetermined*, *granted*, dan *denied*.
- **Adaptive Location Tracking Hook (`useLocationTracking`):** Merancang tracking posisi pengguna dengan `distanceInterval` adaptif (meningkatkan interval pembaruan saat diam untuk menghemat baterai, dan memperketat interval saat bergerak cepat).
- **Formulasi Matematika Haversine:** Mengimplementasikan kalkulasi jarak lingkaran besar (*great-circle distance*) antara koordinat GPS pengguna ($lat_1, lon_1$) dan titik laporan ($lat_2, lon_2$):
  $$a = \sin^2(\Delta\phi/2) + \cos(\phi_1)\cos(\phi_2)\sin^2(\Delta\lambda/2)$$
  $$c = 2 \cdot \text{atan2}(\sqrt{a}, \sqrt{1-a})$$
  $$d = R \cdot c \quad (\text{dengan } R = 6.371\text{ km})$$
- **Integrasi Peta Native:** Menyiapkan layer koordinat geografis untuk dirender pada Google Maps Android SDK melalui `react-native-maps`.

---

## 4. INTEGRASI ANTARANGGOTA & PEMISAHAN BATAS (SEPARATION OF CONCERNS)

Aplikasi dibangun dengan prinsip isolasi yang sangat rapi:
1. **Frontend (Anggota 2) vs Spasial (Anggota 3):**
   - Komponen UI `MapControls` dan `ReportMarker` **tidak pernah** menjalankan komputasi Haversine atau memanggil fungsi sensor GPS secara langsung.
   - Anggota 3 menyuplai data angka jarak (meter), dan Anggota 2 bertugas memformatnya menjadi teks yang mudah dibaca (`"350 m"`, `"1.2 km"`).
2. **Frontend (Anggota 2) vs State Global (Anggota 1):**
   - Tipe data `UIReport` di frontend berstatus sebagai **View Model Sementara**.
   - Ketika domain entity `Report` dirilis oleh Anggota 1, integrasi dilakukan menggunakan **Adapter Pattern** (`mapDomainToUIReport`) tanpa merombak komponen UI yang sudah stabil.

---

## 5. HASIL PENGUJIAN KUALITAS & AUDIT TEKNIS

Seluruh kode Milestone 1 telah melalui proses validasi ketat:
1. **TypeScript Compiler (`tsc --noEmit`):** Exit Code 0 (Zero Errors / Zero Warnings) pada konfigurasi `strict: true`.
2. **Expo Doctor (`npx expo-doctor`):** **21/21 Checks Passed** (100% kompatibel dengan Expo SDK 57).
3. **Metro Bundler (`expo export --platform android`):** Berhasil membundle 607 modul JavaScript/Hermes Bytecode (`1.5 MB`) tanpa konflik dependensi.
4. **Audit Aksesibilitas (A11y):** Seluruh elemen interaktif memenuhi standar Android minimum touch target **48 x 48 dp** dengan semantic role (`accessibilityRole="button"`) dan label screen reader lengkap.

---

## 6. SIMULASI DATA LAPORAN (MOCK WILAYAH MALANG)

Untuk pengujian tata letak peta Milestone 1, digunakan 5 data simulasi realistis di Kota Malang:
1. `rep-demo-001`: *Jalan Berlubang Parah* (Infrastruktur / Siaga Sedang / Jl. Soekarno-Hatta / 350 m).
2. `rep-demo-002`: *Genangan Banjir Luapan Drainase* (Banjir / Darurat Tinggi / Jl. Bandung, Klojen / 1.2 km).
3. `rep-demo-003`: *Pohon Randu Tumbang Melintang* (Infrastruktur / Darurat Tinggi / Jl. Ijen / 2.5 km).
4. `rep-demo-004`: *Kebakaran Ilalang Dekat Pemukiman* (Kebakaran / Kritis / Sawojajar / 3.8 km).
5. `rep-demo-005`: *Penerangan Jalan Umum Padam Total* (Lainnya / Rendah / Tlogomas / 4.6 km).

---

## 7. KESIMPULAN & KESIAPAN MILESTONE 2

- Seluruh target Milestone 1 berhasil tercapai dengan pembagian kerja yang seimbang dan arsitektur yang solid.
- Fondasi ini siap melanjutkan ke **Milestone 2**:
  - Pengambilan foto laporan warga dengan Watermark koordinat GPS dan waktu otomatis.
  - Implementasi Scoped Storage Document Vault untuk penyimpanan arsip laporan yang aman di Android.
