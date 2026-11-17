/** Domain types shared across features. Keep these independent from presentation components. */
export type ReportCategory = 'infrastructure' | 'flood' | 'landslide' | 'fire' | 'other';
export type ReportUrgency = 'low' | 'medium' | 'high' | 'critical';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  urgency: ReportUrgency;
  location: GeoPoint;
  createdAt: string;
  status: 'submitted' | 'verified' | 'resolved';
}

export interface UserLocation extends GeoPoint {
  accuracy: number | null;
  timestamp: number;
}
