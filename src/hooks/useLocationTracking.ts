import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';

export type PermissionStateStatus = 'undetermined' | 'granted' | 'denied' | 'disabled';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export function useLocationTracking() {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStateStatus>('undetermined');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  const checkPermission = useCallback(async () => {
    try {
      const isServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!isServicesEnabled) {
        setPermissionStatus('disabled');
        setErrorMsg('Layanan GPS/Lokasi pada perangkat tidak aktif.');
        return 'disabled';
      }

      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        setPermissionStatus('granted');
      } else if (status === 'denied') {
        setPermissionStatus('denied');
      } else {
        setPermissionStatus('undetermined');
      }
      return status;
    } catch (err) {
      setErrorMsg('Gagal memeriksa izin lokasi.');
      return 'undetermined';
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const isServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!isServicesEnabled) {
        setPermissionStatus('disabled');
        setErrorMsg('Aktifkan GPS perangkat Anda terlebih dahulu.');
        return false;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setPermissionStatus('granted');
        setErrorMsg(null);
        return true;
      } else {
        setPermissionStatus('denied');
        setErrorMsg('Akses lokasi ditolak.');
        return false;
      }
    } catch (err) {
      setErrorMsg('Gagal meminta izin lokasi.');
      return false;
    }
  };

  const stopTracking = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(async () => {
    stopTracking();

    const isServicesEnabled = await Location.hasServicesEnabledAsync();
    if (!isServicesEnabled) {
      setPermissionStatus('disabled');
      setErrorMsg('Layanan lokasi tidak aktif.');
      return;
    }

    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      const initialPos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: initialPos.coords.latitude,
        longitude: initialPos.coords.longitude,
        accuracy: initialPos.coords.accuracy,
      });

      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLoc) => {
          setLocation({
            latitude: newLoc.coords.latitude,
            longitude: newLoc.coords.longitude,
            accuracy: newLoc.coords.accuracy,
          });
        }
      );

      setIsTracking(true);
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg('Gagal mengambil data posisi GPS.');
      setIsTracking(false);
    }
  }, [stopTracking]);

  useEffect(() => {
    checkPermission();
    return () => {
      stopTracking();
    };
  }, [checkPermission, stopTracking]);

  return {
    location,
    permissionStatus,
    errorMsg,
    isTracking,
    requestPermission,
    startTracking,
    stopTracking,
    checkPermission,
  };
}