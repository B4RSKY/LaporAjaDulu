import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { LocationCoordinates } from '../../hooks/useLocationTracking';
import { ReportMarker } from './ReportMarker';
import { ReportCategory, ReportUrgency } from '../../types/ui';

export interface MapReportItem {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  category: ReportCategory;
  urgency: ReportUrgency;
}

export interface MapViewContainerRef {
  reCenter: () => void;
  animateToCoordinate: (lat: number, lng: number) => void;
}

interface MapViewContainerProps {
  userLocation: LocationCoordinates | null;
  reports: MapReportItem[];
  selectedReportId?: string | null;
  onSelectReport: (report: MapReportItem) => void;
}

const FALLBACK_REGION: Region = {
  latitude: -6.200000,
  longitude: 106.816666,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export const MapViewContainer = forwardRef<MapViewContainerRef, MapViewContainerProps>(
  ({ userLocation, reports, selectedReportId, onSelectReport }, ref) => {
    const mapRef = useRef<MapView>(null);

    const initialRegion: Region = userLocation
      ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : FALLBACK_REGION;

    useImperativeHandle(ref, () => ({
      reCenter: () => {
        if (userLocation && mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            },
            1000
          );
        }
      },
      animateToCoordinate: (lat: number, lng: number) => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            800
          );
        }
      },
    }));

    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {reports.map((report) => {
            const isSelected = report.id === selectedReportId;
            return (
              <Marker
                key={report.id}
                coordinate={{
                  latitude: report.latitude,
                  longitude: report.longitude,
                }}
                onPress={() => onSelectReport(report)}
                tracksViewChanges={false}
              >
                <ReportMarker
                  id={report.id}
                  latitude={report.latitude}
                  longitude={report.longitude}
                  category={report.category}
                  urgency={report.urgency}
                  isSelected={isSelected}
                  onSelect={() => onSelectReport(report)}
                />
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
);

MapViewContainer.displayName = 'MapViewContainer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
});