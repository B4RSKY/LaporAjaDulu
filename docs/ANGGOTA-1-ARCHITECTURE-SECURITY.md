# Anggota 1 — System Architecture & Security

## Arsitektur UDF

- UI/screens hanya membaca state dan memanggil action dari `src/store/useAppStore.ts`.
- Store Zustand menjadi sumber state global untuk lokasi pengguna dan laporan terpilih.
- Domain types berada di `src/types/domain.ts`; tipe UI lama tetap dipakai oleh komponen presentasi sampai adapter API disepakati.
- Services (security, audit, location) tidak boleh diimpor oleh komponen presentasi secara langsung.

## Secure storage

`src/services/security/secureStorage.ts` membungkus `expo-secure-store` untuk nilai rahasia kecil seperti access token. Jangan simpan seluruh laporan, koordinat GPS, password plaintext, atau data besar di SecureStore. Jangan mencatat isi token ke log.

## Activity & Audit Protocol

`src/services/audit/activityAudit.ts` mendefinisikan event terstruktur, waktu ISO, aktor, dan metadata non-sensitif. Lokasi presisi, token, password, dan data pribadi tidak boleh masuk metadata. Sink saat ini hanya console pada mode development; integrasi backend menunggu endpoint resmi.

## CI/CD dan EAS

`eas.json` menyediakan profile development, preview (APK internal), dan production (AAB). Jalankan `eas build:configure` / `eas init` setelah project dibuat di akun Expo kelompok; jangan mengarang `projectId` atau credential signing. Build membutuhkan akun Expo dan koneksi internet.

## Batas milestone

Milestone 1 tetap fokus pada LBS, peta interaktif, tracking foreground, custom marker, dan Haversine. Background tracking, autentikasi biometrik, API audit server, dan distribusi produksi memerlukan keputusan/izin tambahan.

## Dependency setup

After pulling these changes, run `npm install` once. This resolves the new `zustand` and SDK-57-compatible `expo-secure-store` dependencies and updates `package-lock.json` on the developer machine. Commit the resulting lockfile with the source changes.
