export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export function calculateHaversineDistance(start: GeoPoint, end: GeoPoint): number {
  const R = 6371e3;
  const lat1Rad = (start.latitude * Math.PI) / 180;
  const lat2Rad = (end.latitude * Math.PI) / 180;
  const deltaLatRad = ((end.latitude - start.latitude) * Math.PI) / 180;
  const deltaLonRad = ((end.longitude - start.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLonRad / 2) *
      Math.sin(deltaLonRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function formatDistance(meters: number): string {
  if (meters < 1) {
    return 'Di lokasi Anda';
  }
  if (meters < 1000) {
    return `${Math.round(meters)} m dari Anda`;
  }
  const kilometers = meters / 1000;
  return `${kilometers.toFixed(1)} km dari Anda`;
}