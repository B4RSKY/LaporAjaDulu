# Panduan Anggota 2 — Lead Frontend & Performance Specialist
## Proyek SDG 11: LaporAjaDulu — Community Disaster Management
### Milestone 1 — Inisialisasi LBS & Interactive Mapping Engine

> Dokumen kerja untuk memandu pengembangan menggunakan Antigravity IDE. Panduan ini disusun berdasarkan *Spesifikasi Proyek Pemrograman Mobile* yang diberikan. Fokusnya adalah tanggung jawab Anggota 2, bukan mengambil alih pekerjaan Anggota 1 atau Anggota 3.

---


## Keputusan proyek yang sudah dikonfirmasi

Keputusan berikut menjadi acuan kerja saat ini:

| Aspek | Keputusan |
|---|---|
| Nama aplikasi | **LaporAjaDulu** |
| Platform target | **Android saja** |
| Repository | Repository GitHub sudah dibuat, tetapi belum berisi kode |
| Tagline | **Ada masalah? Laporin!** |
| Gaya UI | Modern, clean, profesional dengan pendekatan **soft neumorphism** |

### Identitas merek LaporAjaDulu

- **Nama:** LaporAjaDulu
- **Tagline:** Ada masalah? Laporin!
- Gunakan ejaan **LaporAjaDulu** secara konsisten (huruf S dan W kapital).
- Nama dan tagline boleh digunakan pada header, splash/intro, README, dan dokumentasi UI.
- Package name / Android application ID bukan tagline; sepakati format identifier teknis bersama Anggota 1 sebelum konfigurasi final.
- Jangan mengklaim nama atau merek sudah tersedia secara hukum; pemeriksaan merek dagang dan ketersediaan nama aplikasi masih perlu dilakukan bila diperlukan.

### Arahan visual: soft neumorphism

Gunakan neumorphism sebagai aksen visual, bukan efek pada setiap elemen. Rekomendasi awal:
- Latar netral lembut dengan permukaan kartu sedikit terangkat.
- Bayangan halus dan terbatas; jangan membuat tombol, teks, atau panel sulit dibaca.
- Pertahankan kontras teks dan indikator status yang jelas.
- Jangan mengandalkan bayangan atau warna saja untuk menunjukkan tombol aktif, pilihan marker, error, atau status izin.
- Gunakan bentuk dan radius yang konsisten.
- Untuk kontrol penting, utamakan affordance dan aksesibilitas daripada efek dekoratif.
- Periksa tampilan pada perangkat Android nyata karena rendering shadow/elevation dapat berbeda antarperangkat.

Palet warna final belum ditentukan. Antigravity boleh mengusulkan token warna awal, tetapi harus menampilkannya untuk ditinjau sebelum menerapkan ke seluruh aplikasi.

### Konsekuensi untuk setup

Karena repository GitHub sudah dibuat tetapi kosong:
1. Clone repository ke komputer atau buka folder hasil clone di Antigravity IDE.
2. Pastikan folder yang dibuka adalah root repository yang benar.
3. Lakukan audit apakah repository benar-benar kosong, termasuk file tersembunyi seperti `.gitignore`, `README.md`, dan konfigurasi Git.
4. Baru setelah audit disetujui, inisialisasi proyek Expo dengan konfigurasi Android yang sesuai.
5. Jangan membuat repository baru atau menginisialisasi Git kedua di dalam folder tersebut.
6. Jangan menetapkan nama aplikasi final, package identifier, atau branding permanen sebelum disepakati kelompok.

## 1. Konteks proyek

Kelompok memilih **SDG 11 — Sustainable Cities**, dengan topik **LaporAjaDulu — Community Disaster Management**.

Deskripsi pada panduan tugas: platform pelaporan infrastruktur kota rusak dan sistem peringatan dini bencana berbasis komunitas (*crowdsourced disaster mitigation*).

Fitur utama yang disebutkan dalam dokumen tugas:
- Pengambilan foto laporan dengan watermark koordinat dan waktu.
- Scoped Storage Document Vault.
- Geofencing area rawan bencana.
- Peta interaktif laporan warga.
- Penapisan laporan reaktif menggunakan RxJS Debounce.

**Catatan ruang lingkup:** fitur-fitur tersebut merupakan gambaran proyek keseluruhan. Milestone 1 hanya menargetkan:
1. Konfigurasi `react-native-maps` dan `expo-location`.
2. Custom hook `useLocationTracking` dengan `distanceInterval` adaptif.
3. Custom markers dan kalkulasi jarak lurus menggunakan formulasi Haversine.

Jangan mengimplementasikan seluruh fitur proyek sekaligus pada Milestone 1.

## 2. Peran dan batas tanggung jawab

### Anggota 2 — Lead Frontend & Performance Specialist (pemilik dokumen ini)

Bertanggung jawab atas:
- UI deklaratif React Native dan komposisi komponen.
- Layout Flexbox yang responsif.
- Tampilan layar peta, marker, informasi lokasi, status izin, loading, error, dan empty state.
- Safe Area dan aksesibilitas.
- Micro-interactions yang relevan dan tidak berlebihan.
- Optimasi render secara terukur dengan `React.memo`, `useMemo`, dan `useCallback`.
- Menjaga agar komponen UI tidak mengambil alih logika lokasi, komputasi spasial, atau state global.

### Batas kolaborasi

| Area | Pemilik utama | Kontribusi Anggota 2 |
|---|---|---|
| Zustand store, tipe global, arsitektur, security | Anggota 1 | Mengonsumsi kontrak store/props yang disepakati |
| Permission lokasi, `expo-location`, tracking, adaptive interval | Anggota 3 | Menampilkan status permission dan tracking |
| `react-native-maps`, koordinat, Haversine, marker data spasial | Anggota 3 | Membangun presentasi peta dan marker |
| Screen, reusable UI, layout, accessibility | Anggota 2 | Pemilik utama |
| Profiling dan audit performa UI | Anggota 2, kolaborasi semua anggota | Menyiapkan dan mendokumentasikan pemeriksaan UI |

Jangan membuat implementasi kedua untuk `useLocationTracking`, permission lokasi, Haversine, atau sumber data peta jika Anggota 3 sudah memilikinya. Sepakati kontrak data terlebih dahulu.

## 3. Hasil akhir Milestone 1 yang perlu terlihat

Dari sisi frontend, target minimal yang disarankan:

- Satu layar utama peta LaporAjaDulu.
- Peta tampil dengan area awal yang masuk akal; jangan mengarang koordinat pengguna.
- Indikator lokasi pengguna hanya tampil jika izin dan data lokasi tersedia.
- Marker laporan menggunakan data contoh yang jelas ditandai sebagai mock/demo.
- Marker dapat dipilih dan menampilkan ringkasan laporan.
- Panel informasi tidak menutupi seluruh area peta dan tetap nyaman di layar kecil.
- Ada tampilan loading, permission belum diberikan, permission ditolak, lokasi belum tersedia, dan error.
- Jarak ke marker dapat ditampilkan jika nilai Haversine tersedia dari modul spasial Anggota 3.
- UI tetap usable ketika data laporan kosong atau lokasi tidak tersedia.
- Tidak ada subscription/listener yang dibuat oleh komponen UI tanpa cleanup yang sesuai.

Ini adalah kriteria kerja frontend yang disarankan, bukan tambahan deliverables resmi yang tertulis dalam PDF.

## 4. Prinsip teknis

1. **Ikuti proyek yang benar-benar ada.** Periksa `package.json`, struktur folder, Expo SDK, TypeScript, dan konfigurasi sebelum mengubah apa pun.
2. **Jangan upgrade dependency secara otomatis.** Pastikan kompatibilitas dengan Expo SDK proyek.
3. **Pisahkan UI dan logika.** Screen mengatur komposisi; komponen reusable menangani presentasi; hook/service khusus menangani logika sesuai kepemilikan anggota.
4. **Jangan mengarang API.** Jika kontrak store, hook, atau data belum tersedia, catat sebagai kebutuhan integrasi dan tanyakan/ajukan kontrak sebelum implementasi.
5. **Jangan menambahkan dependency tanpa alasan.** Jelaskan manfaat, kompatibilitas, dan dampaknya terlebih dahulu.
6. **Hindari premature optimization.** Gunakan memoization ketika ada alasan yang terukur atau props/komputasi memang stabil dan relevan.
7. **Jaga aksesibilitas.** Kontrol interaktif memiliki label yang bermakna, ukuran sentuh memadai, kontras baik, dan tidak hanya mengandalkan warna.
8. **Jangan menaruh secret/API key di source code.** Konfigurasi sensitif harus mengikuti arahan Anggota 1.
9. **Gunakan data demo secara eksplisit.** Jangan menyajikan marker contoh seolah-olah laporan warga sungguhan.
10. **Jelaskan perubahan.** Setiap tahap harus menghasilkan ringkasan file yang dibuat/diubah, alasan, cara uji, dan risiko.

## 5. Struktur folder frontend yang disarankan

Struktur final harus disepakati dengan Anggota 1. Ini usulan awal, bukan instruksi untuk memindahkan seluruh proyek secara membabi buta.

```text
src/
  components/
    map/
      ReportMarker.tsx
      SelectedReportCard.tsx
      MapControls.tsx
    ui/
      LoadingState.tsx
      ErrorState.tsx
      PermissionState.tsx
  screens/
    MapScreen.tsx
  features/
    map/
      components/
      types.ts
  hooks/
  theme/
    colors.ts
    spacing.ts
    typography.ts
  types/
```

Batas penting:
- `MapScreen.tsx`: menyusun layout dan menghubungkan komponen dengan data/hook yang telah disepakati.
- `ReportMarker.tsx`: presentasi marker; tidak menghitung Haversine atau meminta permission.
- `SelectedReportCard.tsx`: menampilkan ringkasan laporan terpilih.
- `MapControls.tsx`: kontrol UI seperti tombol kembali ke lokasi pengguna; aksi aktual diteruskan melalui callback.
- `PermissionState.tsx`, `LoadingState.tsx`, `ErrorState.tsx`: state UI yang konsisten.
- `hooks/`: hanya hook yang memang menjadi tanggung jawab frontend atau hasil kesepakatan. Jangan menduplikasi hook Anggota 3.

Jika proyek memakai Expo Router, ikuti struktur `app/` yang sudah ada. Jangan membuat sistem navigasi baru jika belum diperlukan.

## 6. Urutan kerja Milestone 1

### Tahap 0 — Audit awal repository

Sebelum menulis kode:
- Periksa apakah repository sudah dibuat dan apakah ada perubahan lokal.
- Periksa `package.json`, `app.json`/`app.config.*`, entry point, router, TypeScript, dan struktur folder.
- Identifikasi versi Expo SDK dan package yang sudah terpasang.
- Jalankan aplikasi dalam kondisi awal jika memungkinkan.
- Catat temuan dan jangan menghapus atau menimpa file yang sudah ada.

**Output:** laporan audit singkat dan rencana perubahan.

### Tahap 1 — Sepakati kontrak integrasi

Koordinasikan dengan Anggota 1 dan 3:
- Bentuk objek laporan: `id`, `title`, `category`, `latitude`, `longitude`, dan field ringkasan lain yang disepakati.
- Bentuk status lokasi: loading, granted/denied, error, dan koordinat yang tersedia/tidak tersedia.
- Siapa yang menyediakan `useLocationTracking`.
- Siapa yang menghitung jarak Haversine.
- Bagaimana screen menerima data lokasi dan daftar laporan.
- Bagaimana pemilihan marker disampaikan ke UI.

Jangan mengunci nama field atau tipe final sebelum kontrak tim disepakati.

### Tahap 2 — Bangun kerangka UI

Implementasikan secara bertahap:
1. `MapScreen` dengan Safe Area.
2. Area peta yang mengisi ruang secara proporsional.
3. Header atau identitas halaman yang ringkas.
4. Kontrol peta yang mudah dijangkau.
5. Panel ringkasan marker terpilih.
6. State loading, permission, error, dan empty state.

Gunakan data mock terpisah dari data produksi. Jangan membuat screen bergantung pada data mock secara permanen.

### Tahap 3 — Integrasikan peta dan marker

- Gunakan `react-native-maps` sesuai konfigurasi Expo dan arahan Anggota 3.
- Render marker dari daftar laporan yang diterima melalui props/hook/store yang disepakati.
- Gunakan key stabil berbasis ID laporan.
- Pisahkan komponen marker agar mudah diuji dan dioptimalkan.
- Saat marker dipilih, tampilkan ringkasan laporan.
- Jangan menaruh perhitungan jarak berat atau permission flow di dalam render marker.

### Tahap 4 — Integrasi lokasi dan Haversine

- Konsumsi status dan koordinat dari implementasi Anggota 3.
- Tampilkan lokasi pengguna hanya ketika data valid tersedia.
- Konsumsi hasil jarak Haversine dari modul spasial yang disepakati.
- Pastikan UI punya fallback ketika lokasi tidak tersedia.
- Jangan mengasumsikan permission selalu diberikan.
- Jangan membuat subscription lokasi tambahan dari screen.

### Tahap 5 — Responsiveness, accessibility, dan performance

- Gunakan Flexbox dan dimensi layar secara adaptif.
- Periksa layar kecil dan besar serta orientasi yang relevan.
- Pastikan tombol memiliki label aksesibilitas dan area sentuh memadai.
- Pastikan informasi penting tidak hanya dibedakan melalui warna.
- Gunakan `React.memo`, `useMemo`, dan `useCallback` hanya ketika sesuai.
- Hindari membuat object/function baru tanpa kebutuhan pada jalur render yang sensitif.
- Periksa marker list dan panel terpilih agar perubahan state tidak memicu render seluruh screen secara tidak perlu.
- Jangan mengklaim 60 FPS tanpa pengujian/profiling yang mendukung.

### Tahap 6 — Verifikasi dan serah terima

- Jalankan pemeriksaan TypeScript/lint yang tersedia.
- Jalankan aplikasi pada emulator/perangkat.
- Uji permission diberikan, ditolak, dan lokasi tidak tersedia.
- Uji marker kosong, satu marker, beberapa marker, dan pemilihan marker.
- Uji rotasi/dimensi layar jika didukung.
- Periksa log error dan warning.
- Catat hasil uji, masalah yang belum selesai, dan kebutuhan anggota lain.

## 7. Master Prompt untuk Antigravity IDE

Salin prompt berikut ke Antigravity setelah membuka folder repository proyek.

---

### MASTER PROMPT — FRONTEND MILESTONE 1

Kamu bertindak sebagai **Senior React Native Frontend Engineer dan Performance Reviewer** yang membantu saya sebagai **Anggota 2: Lead Frontend & Performance Specialist** pada proyek tugas besar Pemrograman Mobile.

#### Konteks
Kelompok memilih SDG 11 — Sustainable Cities, topik LaporAjaDulu — Community Disaster Management. Aplikasi merupakan platform pelaporan infrastruktur kota rusak dan mitigasi bencana berbasis komunitas. Identitas aplikasi: **LaporAjaDulu** — *Ada masalah? Laporin!* Nama aplikasi final telah ditetapkan. Target platform saat ini Android saja. Repository GitHub sudah dibuat tetapi belum berisi kode. Tagline aplikasi: **Ada masalah? Laporin!** Arah desain adalah modern, clean, profesional dengan soft neumorphism yang tetap menjaga kontras, aksesibilitas, dan keterbacaan.

Saat ini fokus hanya **Milestone 1 — Inisialisasi LBS & Interactive Mapping Engine**. Deliverables resmi:
1. Konfigurasi `react-native-maps` dan `expo-location`.
2. Custom hook `useLocationTracking` dengan `distanceInterval` adaptif.
3. Custom markers dan kalkulasi jarak lurus menggunakan Haversine.

Saya adalah Anggota 2. Tanggung jawab utama saya adalah UI deklaratif, Flexbox, komponen, aksesibilitas, Safe Area, micro-interactions, dan performa UI. Anggota 1 memimpin arsitektur Zustand/types/security/audit/CI-CD. Anggota 3 memimpin integrasi maps/LBS/location, Haversine/geofencing, runtime permissions, scoped storage, dan RxJS.

#### Aturan kerja wajib
1. Mulai dengan mengaudit repository. Jangan langsung membuat atau mengubah file.
2. Karena repository GitHub telah dibuat tetapi belum berisi kode, periksa status repository dan file yang ada terlebih dahulu. Jangan membuat repository baru atau Git repository bersarang. Jika memang belum ada proyek aplikasi, ajukan rencana inisialisasi Expo Android-only untuk ditinjau sebelum menjalankan perintah. Setelah proyek dibuat pada fase yang disetujui, periksa `package.json`, versi Expo SDK, konfigurasi app, router, TypeScript, dan struktur folder.
3. Laporkan kondisi proyek dan usulan langkah berikutnya sebelum melakukan perubahan.
4. Jangan mengarang bahwa dependency, API, hook, store, atau file tertentu sudah ada.
5. Jangan meng-upgrade Expo atau dependency secara otomatis. Gunakan kompatibilitas versi proyek.
6. Jangan menimpa, menghapus, atau merombak file yang sudah ada tanpa alasan dan persetujuan.
7. Implementasikan hanya lingkup frontend Anggota 2. Jangan mengambil alih implementasi permission, tracking GPS, Haversine, geofencing, Zustand global store, atau konfigurasi security milik anggota lain.
8. Jika integrasi membutuhkan kontrak yang belum disepakati, berhenti pada titik tersebut dan ajukan kontrak/interface yang disarankan.
9. Pisahkan screen, reusable components, data, dan logika. Jangan menaruh seluruh aplikasi dalam satu file.
10. Jangan menambahkan package tanpa menjelaskan alasan, kompatibilitas, dan alternatif.
11. Jangan hardcode API key, token, atau credentials.
12. Setiap perubahan harus dijelaskan dengan file yang dibuat/diubah, alasan, dan cara verifikasi.
13. Jangan mengklaim performa 60 FPS atau bebas memory leak tanpa bukti pengujian.
14. Gunakan TypeScript jika repository memang menggunakan TypeScript; ikuti konvensi proyek yang ditemukan.
15. Pertahankan perubahan dalam scope Milestone 1. Jangan membangun fitur milestone berikutnya.

#### Keputusan proyek yang harus diikuti
- Target saat ini Android saja; jangan menyiapkan konfigurasi iOS sebagai deliverable Milestone 1.
- Nama aplikasi final adalah **LaporAjaDulu** dengan tagline **Ada masalah? Laporin!**. Gunakan identitas ini pada dokumentasi dan UI; package identifier tetap perlu disepakati tim sebelum ditetapkan.
- Arah desain modern, clean, profesional dengan soft neumorphism. Gunakan shadow secara hemat dan pastikan kontras, keterbacaan, serta affordance tetap jelas.
- Repository GitHub sudah ada dan kosong. Gunakan repository/folder yang sedang dibuka, jangan membuat repository baru atau Git repository bersarang.

#### Prinsip UI
- Bangun UI deklaratif React Native dengan Flexbox.
- Gunakan Safe Area sesuai setup proyek.
- Sediakan loading, permission denied, location unavailable, error, dan empty states.
- Peta menjadi area utama; kontrol dan panel informasi tidak boleh menutupi peta secara berlebihan.
- Marker laporan harus menggunakan data laporan yang diberikan oleh layer data.
- Marker terpilih menampilkan ringkasan laporan.
- Sediakan accessibility labels/hints yang sesuai, ukuran sentuh memadai, dan kontras yang baik.
- Layout harus adaptif terhadap ukuran layar.
- Gunakan micro-interactions seperlunya dan hindari animasi yang tidak mendukung tugas pengguna.

#### Prinsip performa
- Hindari state yang tidak diperlukan dan render berulang yang tidak perlu.
- Gunakan key stabil untuk daftar marker.
- Pertimbangkan `React.memo`, `useMemo`, dan `useCallback` berdasarkan kebutuhan nyata, bukan sekadar menambahkannya di semua tempat.
- Jangan menghitung Haversine di dalam render marker.
- Jangan membuat subscription lokasi dari komponen presentasi.
- Pastikan setiap listener/subscription yang memang dibuat oleh kode kita memiliki cleanup.
- Jelaskan cara menguji performa; jangan mengarang hasil profiling.

#### Rencana pelaksanaan
Kerjakan dalam fase kecil:
A. Audit repository dan laporkan temuan.
B. Usulkan struktur folder yang menyesuaikan struktur aktual.
C. Usulkan kontrak props/types untuk screen, marker, status lokasi, dan data laporan; tandai mana yang perlu disepakati dengan Anggota 1/3.
D. Implementasikan kerangka UI dan state tampilan dengan data mock yang diberi label jelas.
E. Integrasikan peta/marker hanya setelah konfigurasi dan kontrak data tersedia.
F. Integrasikan data lokasi dan jarak melalui interface milik Anggota 3, tanpa menduplikasi implementasinya.
G. Lakukan pemeriksaan responsivitas, aksesibilitas, TypeScript/lint, dan skenario uji.

**Penting:** Pada awal sesi, lakukan hanya fase A. Jangan lanjut ke fase B atau mengubah file sebelum saya meninjau hasil audit dan menyetujuinya.

#### Format laporan setiap fase
Gunakan format:
- Tujuan fase
- Temuan/kondisi saat ini
- File yang akan dibuat/diubah
- Alasan teknis
- Risiko dan dependensi anggota lain
- Cara menjalankan/menguji
- Kriteria selesai
- Pertanyaan/keputusan yang membutuhkan persetujuan saya

Bersikap kritis. Jika permintaan saya berpotensi membuat arsitektur tumpang tindih, performa buruk, atau tidak sesuai Milestone 1, jelaskan sebelum menulis kode.

---

## 8. Prompt lanjutan per fase

Gunakan hanya setelah fase sebelumnya ditinjau dan disetujui.

### Prompt Fase B — Rencana struktur dan kontrak UI

```text
Berdasarkan hasil audit repository yang sudah disetujui, susun rencana struktur folder dan kontrak komponen untuk frontend Milestone 1. Jangan mengubah file dahulu.

Tentukan:
- Screen utama peta.
- Komponen marker laporan.
- Panel detail laporan terpilih.
- Kontrol peta.
- Loading, permission, error, dan empty states.
- Props/types yang dibutuhkan.
- Data yang harus disediakan Anggota 1 atau Anggota 3.

Bedakan dengan tegas data mock dan data aktual. Jangan menduplikasi hook lokasi, Haversine, atau Zustand store. Tampilkan rencana dan tunggu persetujuan.
```

### Prompt Fase C — Implementasi kerangka UI

```text
Implementasikan hanya kerangka UI frontend Milestone 1 sesuai rencana yang telah saya setujui. Ikuti struktur dan konvensi repository. Buat komponen terpisah, layout Flexbox responsif, Safe Area sesuai setup, accessibility labels, serta loading/error/empty/permission states.

Gunakan data mock yang terisolasi dan diberi label demo. Jangan membuat implementasi GPS, permission, Haversine, geofencing, atau global Zustand store. Setelah selesai, laporkan file berubah dan langkah pengujian.
```

### Prompt Fase D — Integrasi peta dan marker

```text
Integrasikan presentasi react-native-maps dan custom report markers ke UI yang sudah ada. Sebelum coding, verifikasi konfigurasi dan kontrak data yang disediakan Anggota 3. Jangan mengubah konfigurasi native/dependency tanpa persetujuan.

Marker harus berasal dari data yang diberikan, memiliki key stabil, dapat dipilih, dan menampilkan ringkasan laporan. Jangan menghitung Haversine di komponen marker. Pastikan fallback ketika daftar laporan kosong. Laporkan pengujian dan risiko.
```

### Prompt Fase E — Integrasi lokasi dan jarak

```text
Hubungkan UI ke interface status lokasi dan hasil jarak yang disepakati dengan Anggota 3. Jangan membuat hook tracking atau kalkulasi Haversine kedua. Tangani status loading, permission denied, lokasi unavailable, dan error. Jangan menganggap koordinat pengguna selalu tersedia.

Tampilkan jarak hanya jika hasil perhitungan valid tersedia. Laporkan kontrak yang digunakan, file berubah, dan skenario uji.
```

### Prompt Fase F — Audit UI/performance

```text
Lakukan review khusus frontend Milestone 1:
- potensi unnecessary re-render;
- penggunaan React.memo/useMemo/useCallback yang benar-benar diperlukan;
- key daftar marker;
- cleanup listener/subscription yang dibuat oleh frontend;
- layout responsif dan Safe Area;
- accessibility;
- loading/error/empty/permission states;
- potensi UI freeze atau pekerjaan berat di render.

Jangan melakukan refactor besar langsung. Buat daftar temuan berdasarkan prioritas, bukti/file terkait, rekomendasi, dan cara verifikasi. Tunggu persetujuan sebelum mengubah kode.
```

## 9. Checklist penerimaan Anggota 2

### UI dan integrasi
- [ ] Screen peta mengikuti struktur proyek.
- [ ] Komponen marker terpisah dan menggunakan ID stabil.
- [ ] Pemilihan marker menampilkan ringkasan.
- [ ] Status loading, permission, error, dan empty tersedia.
- [ ] UI tidak mengasumsikan lokasi selalu tersedia.
- [ ] Data mock terpisah dari sumber data aktual.
- [ ] Tidak ada duplikasi hook tracking atau Haversine.

### UX, accessibility, dan responsiveness
- [ ] Layout menggunakan Flexbox dan menyesuaikan ukuran layar.
- [ ] Safe Area ditangani.
- [ ] Kontrol memiliki label aksesibilitas.
- [ ] Area sentuh nyaman.
- [ ] Informasi tidak hanya dibedakan melalui warna.
- [ ] Peta tetap menjadi fokus utama dan panel tidak menghalangi penggunaan.

### Performance dan kualitas
- [ ] Tidak ada kalkulasi spasial berat di render marker.
- [ ] Memoization digunakan secara tepat, bukan berlebihan.
- [ ] Tidak ada warning/error baru yang tidak dijelaskan.
- [ ] TypeScript/lint (jika tersedia) lolos.
- [ ] Skenario lokasi ditolak/tidak tersedia sudah diuji.
- [ ] Hasil pengujian dicatat; klaim FPS didukung pengukuran.

## 10. Bukti kerja yang sebaiknya disimpan

Untuk mendukung proses tugas dan audit:
- Catatan audit awal repository.
- Prompt yang digunakan di Antigravity.
- Ringkasan perubahan tiap fase.
- Screenshot UI pada beberapa ukuran layar.
- Hasil pengujian permission dan marker.
- Catatan masalah, keputusan tim, dan penyelesaiannya.
- Bukti review performa yang benar-benar dilakukan.

Dokumen tugas menyebut bukti penggunaan *Master Prompting* terstruktur dan *Architect's Audit Checklist* sebagai bagian penilaian Vibe Coding Workflow. Simpan prompt dan hasil audit, bukan hanya hasil akhir aplikasi.

## 11. Rujukan terhadap dokumen tugas

- **Halaman 1–2:** teknologi utama, pilihan SDG, deskripsi Topic B SDG 11, dan pembagian peran tiga anggota.
- **Halaman 3:** Milestone 1, Sub-CPMK 7, serta tiga deliverables resmi.
- **Halaman 4:** Milestone 2–5; jangan dikerjakan sekarang kecuali ada kebutuhan fondasi yang disetujui tim.
- **Halaman 5–6:** bobot penilaian dan kriteria, termasuk performa 60 FPS/16ms, cleanup subscription, serta bukti Master Prompting dan Architect's Audit Checklist.

### Catatan penting tentang interpretasi
Panduan tugas menetapkan deliverables Milestone 1 pada tingkat kelompok, bukan pembagian detail setiap deliverable ke anggota. Pembagian kontribusi frontend vs. LBS di dokumen ini adalah cara kerja yang disarankan agar sesuai dengan deskripsi peran Anggota 2 dan Anggota 3. Finalisasi interface dan pembagian file tetap perlu disepakati bersama tim.

---


## 12. Prompt pertama yang disesuaikan dengan kondisi repository

Karena repository GitHub sudah dibuat tetapi belum ada kode, prompt pertama sebaiknya meminta Antigravity **memeriksa repository dan merencanakan inisialisasi**, bukan langsung membuat screen peta.

Salin prompt ini setelah membuka folder hasil clone repository di Antigravity IDE:

```text
Saya sedang mengerjakan tugas besar Pemrograman Mobile sebagai Anggota 2 — Lead Frontend & Performance Specialist.

Konteks proyek:
- SDG 11 — Sustainable Cities.
- Topik LaporAjaDulu — Community Disaster Management.
- Nama aplikasi final adalah **LaporAjaDulu**.
- Target platform Android saja.
- Repository GitHub sudah dibuat, tetapi belum ada kode aplikasi.
- Arah UI: modern, clean, profesional dengan soft neumorphism yang halus, tetap accessible dan memiliki kontras yang baik.
- Fokus saat ini hanya Milestone 1.

Tugas kamu sekarang hanya melakukan AUDIT AWAL dan menyusun RENCANA INISIALISASI. Jangan membuat atau mengubah file dan jangan menjalankan perintah inisialisasi sebelum saya menyetujui rencana.

Periksa:
1. Apakah folder aktif benar-benar root repository GitHub yang dimaksud.
2. Status Git dan branch aktif; jangan mengubah remote, branch, atau riwayat commit.
3. File yang sudah ada, termasuk file tersembunyi seperti .gitignore dan README.
4. Apakah repository benar-benar kosong atau memiliki starter/configuration files.
5. Rekomendasi versi/jenis template Expo yang kompatibel untuk Android, tetapi jangan memasang dependency atau melakukan upgrade sekarang.
6. Rencana struktur awal yang mendukung pembagian kerja tiga anggota dan fokus frontend Anggota 2.
7. Risiko integrasi react-native-maps dan expo-location yang perlu dikoordinasikan dengan Anggota 3.
8. Informasi yang perlu disepakati dengan Anggota 1 sebelum struktur global, types, dan Zustand dibuat.

Batas tanggung jawab saya:
- Saya mengerjakan UI deklaratif, Flexbox, reusable components, Safe Area, accessibility, micro-interactions, dan optimasi render.
- Anggota 1 memimpin arsitektur Zustand/types/security/audit/CI-CD.
- Anggota 3 memimpin maps/LBS/location, tracking, Haversine/geofencing, permissions, scoped storage, dan RxJS.

Milestone 1 resmi mencakup konfigurasi react-native-maps dan expo-location, custom hook useLocationTracking dengan distanceInterval adaptif, custom markers, dan kalkulasi Haversine. Jangan mengerjakan milestone lain.

Berikan laporan:
- Kondisi repository
- Apakah perlu inisialisasi Expo
- Rekomendasi langkah inisialisasi Android
- Usulan struktur folder awal
- Risiko dan dependency antaranggota
- Langkah berikutnya yang membutuhkan persetujuan saya

Berhenti setelah memberikan laporan. Jangan melakukan perubahan file.
```

### Setelah Antigravity memberikan hasil audit

- Jika repository benar-benar kosong, tinjau rencana inisialisasi Expo dan sepakati versi/konfigurasi dengan tim.
- Jika ada file awal, pastikan file tersebut tidak tertimpa.
- Setelah rencana disetujui, minta Antigravity melakukan inisialisasi proyek saja.
- Jalankan aplikasi Android dalam kondisi awal sebelum mulai membangun UI peta.
- Simpan hasil audit dan prompt sebagai bukti workflow.

## Cara mulai

1. Buat/buka repository proyek kelompok di Antigravity IDE.
2. Simpan dokumen ini sebagai `docs/ANGGOTA-2-MILESTONE-1.md`.
3. Buka folder root proyek di Antigravity.
4. Salin bagian **Master Prompt — Frontend Milestone 1**.
5. Minta Antigravity menjalankan **fase A saja** (audit repository).
6. Tinjau hasil audit bersama tim sebelum meminta AI membuat atau mengubah file.
