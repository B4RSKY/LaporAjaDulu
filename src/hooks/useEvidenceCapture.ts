import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAppStore } from '../store/useAppStore';
import { createAuditEvent, recordAuditEvent } from '../services/audit/activityAudit';
import { PhotoWatermark } from '../types/vault';

export type CapturePermissionStatus = 'undetermined' | 'granted' | 'denied';

export interface EvidenceCaptureResult {
  photoUri: string;
  watermark: PhotoWatermark;
}

export function useEvidenceCapture() {
  const [permissionStatus, setPermissionStatus] =
    useState<CapturePermissionStatus>('undetermined');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const globalUserLocation = useAppStore((state) => state.userLocation);

  const requestHardwarePermissions = useCallback(async (): Promise<boolean> => {
    try {
      const currentCam = await ImagePicker.getCameraPermissionsAsync();
      let camStatus = currentCam.status;

      if (camStatus !== 'granted') {
        const reqCam = await ImagePicker.requestCameraPermissionsAsync();
        camStatus = reqCam.status;
      }

      const camGranted = camStatus === 'granted';
      recordAuditEvent(
        createAuditEvent(
          camGranted ? 'CAMERA_PERMISSION_GRANTED' : 'CAMERA_PERMISSION_DENIED'
        )
      );

      if (!camGranted) {
        setPermissionStatus('denied');
        setCaptureError('Izin kamera ditolak. Aktifkan izin kamera untuk mengambil foto bukti.');
        return false;
      }

      const currentLoc = await Location.getForegroundPermissionsAsync();
      let locStatus = currentLoc.status;

      if (locStatus !== 'granted') {
        const reqLoc = await Location.requestForegroundPermissionsAsync();
        locStatus = reqLoc.status;
      }

      const locGranted = locStatus === 'granted';
      recordAuditEvent(
        createAuditEvent(
          locGranted ? 'LOCATION_PERMISSION_GRANTED' : 'LOCATION_PERMISSION_DENIED'
        )
      );

      if (!locGranted) {
        setPermissionStatus('denied');
        setCaptureError('Izin lokasi ditolak. Koordinat GPS wajib disematkan pada bukti foto.');
        return false;
      }

      setPermissionStatus('granted');
      setCaptureError(null);
      return true;
    } catch {
      setCaptureError('Gagal memverifikasi izin kamera dan lokasi.');
      return false;
    }
  }, []);

  const captureEvidence = useCallback(async (): Promise<EvidenceCaptureResult | null> => {
    setIsCapturing(true);
    setCaptureError(null);

    try {
      const granted = await requestHardwarePermissions();
      if (!granted) {
        setIsCapturing(false);
        return null;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setCaptureError('Layanan GPS tidak aktif. Nyalakan GPS terlebih dahulu.');
        setIsCapturing(false);
        return null;
      }

      let latitude = globalUserLocation?.latitude ?? null;
      let longitude = globalUserLocation?.longitude ?? null;
      let accuracy = globalUserLocation?.accuracy ?? null;

      try {
        const freshPos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        latitude = freshPos.coords.latitude;
        longitude = freshPos.coords.longitude;
        accuracy = freshPos.coords.accuracy;
      } catch {
        const lastKnown = await Location.getLastKnownPositionAsync({
          maxAge: 120_000,
        });
        if (lastKnown) {
          latitude = lastKnown.coords.latitude;
          longitude = lastKnown.coords.longitude;
          accuracy = lastKnown.coords.accuracy;
        }
      }

      if (latitude === null || longitude === null) {
        setCaptureError('Koordinat GPS belum terkunci. Tunggu beberapa saat lalu coba lagi.');
        setIsCapturing(false);
        return null;
      }

      const pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
      });

      if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
        setIsCapturing(false);
        return null;
      }

      let locationLabel = accuracy
        ? `GPS Verified (±${Math.round(accuracy)} m)`
        : 'GPS Verified (Offline)';

      try {
        const placemarks = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (placemarks.length > 0) {
          const place = placemarks[0];
          const areaParts = [place.district || place.subregion, place.city].filter(Boolean);
          if (areaParts.length > 0) {
            locationLabel = `${areaParts.join(', ')} (GPS Verified)`;
          }
        }
      } catch {
        // Tetap gunakan label fallback saat offline
      }

      const now = new Date();
      const timestampFormatted = `${now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}, ${now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })} WIB`;

      const watermark: PhotoWatermark = {
        latitude,
        longitude,
        timestampFormatted,
        locationLabel,
      };

      recordAuditEvent(createAuditEvent('EVIDENCE_PHOTO_CAPTURED'));
      setIsCapturing(false);

      return {
        photoUri: pickerResult.assets[0].uri,
        watermark,
      };
    } catch {
      setCaptureError('Gagal mengambil foto dari kamera perangkat.');
      setIsCapturing(false);
      return null;
    }
  }, [globalUserLocation, requestHardwarePermissions]);

  return {
    permissionStatus,
    isCapturing,
    captureError,
    requestHardwarePermissions,
    captureEvidence,
  };
}