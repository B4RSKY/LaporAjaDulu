import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { useAppStore } from '../store/useAppStore';
import { recordAuditEvent, createAuditEvent } from '../services/audit/activityAudit';

export type PermissionStateStatus = 'undetermined' | 'granted' | 'denied' | 'disabled';
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

/** Foreground GPS hook. distanceInterval adapts to reported GPS accuracy. */
export function useLocationTracking() {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStateStatus>('undetermined');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [distanceInterval, setDistanceInterval] = useState(10);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const setGlobalLocation = useAppStore((state) => state.setUserLocation);

  const publishLocation = useCallback((coords: Location.LocationObjectCoords, timestamp: number) => {
    const next = { latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy };
    setLocation(next);
    setGlobalLocation({ ...next, timestamp });
  }, [setGlobalLocation]);

  const checkPermission = useCallback(async (): Promise<PermissionStateStatus> => {
    try {
      if (!(await Location.hasServicesEnabledAsync())) {
        setPermissionStatus('disabled');
        setErrorMsg('Layanan GPS/Lokasi pada perangkat tidak aktif.');
        return 'disabled';
      }
      const { status } = await Location.getForegroundPermissionsAsync();
      const next: PermissionStateStatus = status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'undetermined';
      setPermissionStatus(next);
      return next;
    } catch {
      setErrorMsg('Gagal memeriksa izin lokasi.');
      return 'undetermined';
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!(await Location.hasServicesEnabledAsync())) {
        setPermissionStatus('disabled');
        setErrorMsg('Aktifkan GPS perangkat Anda terlebih dahulu.');
        return false;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setPermissionStatus(granted ? 'granted' : 'denied');
      setErrorMsg(granted ? null : 'Akses lokasi ditolak.');
      recordAuditEvent(createAuditEvent(granted ? 'LOCATION_PERMISSION_GRANTED' : 'LOCATION_PERMISSION_DENIED'));
      return granted;
    } catch {
      setErrorMsg('Gagal meminta izin lokasi.');
      return false;
    }
  }, []);

  const stopTracking = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    setIsTracking(false);
    setGlobalLocation(null);
    recordAuditEvent(createAuditEvent('LOCATION_TRACKING_STOPPED'));
  }, [setGlobalLocation]);

  const startTracking = useCallback(async () => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    try {
      const status = await checkPermission();
      if (status !== 'granted' && !(await requestPermission())) return;

      const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: 60_000, requiredAccuracy: 150 });
      if (lastKnown) publishLocation(lastKnown.coords, lastKnown.timestamp);

      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      publishLocation(current.coords, current.timestamp);

      const distanceInterval = current.coords.accuracy != null && current.coords.accuracy <= 10
        ? 5
        : current.coords.accuracy != null && current.coords.accuracy <= 30 ? 10 : 25;
      setDistanceInterval(distanceInterval);
      subscriptionRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval },
        (next) => publishLocation(next.coords, next.timestamp)
      );
      setIsTracking(true);
      setErrorMsg(null);
      recordAuditEvent(createAuditEvent('LOCATION_TRACKING_STARTED', { distanceIntervalMeters: distanceInterval }));
    } catch {
      setErrorMsg('Gagal mengambil data posisi GPS. Pastikan GPS aktif dan coba lagi.');
      setIsTracking(false);
    }
  }, [checkPermission, publishLocation, requestPermission]);

  useEffect(() => {
    void Promise.resolve().then(checkPermission);
    return () => {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
    };
  }, [checkPermission]);

  return { location, permissionStatus, errorMsg, isTracking, distanceInterval, requestPermission, startTracking, stopTracking, checkPermission };
}
