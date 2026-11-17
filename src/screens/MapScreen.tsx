import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapControls, MapViewContainer, MapViewContainerRef, SelectedReportCard } from '../components/map';
import { EmptyState, PermissionState } from '../components/ui';
import { mockReports } from '../mocks/mockReports';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { UIReport } from '../types/ui';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { calculateHaversineDistance, formatDistance } from '../utils/distance';
import { useAppStore } from '../store/useAppStore';
import { createAuditEvent, recordAuditEvent } from '../services/audit/activityAudit';

export interface MapScreenProps { reportsOverride?: UIReport[] }

export const MapScreen: React.FC<MapScreenProps> = ({ reportsOverride }) => {
  const insets = useSafeAreaInsets();
  const [reports, setReports] = useState<UIReport[]>(reportsOverride ?? mockReports);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef<MapViewContainerRef>(null);
  const selectedReportId = useAppStore((state) => state.selectedReportId);
  const selectReport = useAppStore((state) => state.selectReport);
  const { location, permissionStatus, errorMsg, isTracking, requestPermission, startTracking, stopTracking } = useLocationTracking();

  useEffect(() => () => { if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current); }, []);
  const reportsWithDistance = useMemo(() => reports.map((report) => ({
    ...report,
    distanceFormatted: location
      ? formatDistance(calculateHaversineDistance(location, { latitude: report.latitude, longitude: report.longitude }))
      : undefined,
  })), [reports, location]);
  const selectedReportWithDistance = useMemo(
    () => reportsWithDistance.find((item) => item.id === selectedReportId) ?? null,
    [reportsWithDistance, selectedReportId]
  );

  const handleSelectReport = useCallback((report: { id: string }) => {
    const nextId = selectedReportId === report.id ? null : report.id;
    selectReport(nextId);
    if (nextId) recordAuditEvent(createAuditEvent('REPORT_MARKER_SELECTED', { reportId: nextId }));
  }, [selectedReportId, selectReport]);

  const handleRefreshReports = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    setIsRefreshing(true);
    setReports(reportsOverride ?? mockReports);
    refreshTimerRef.current = setTimeout(() => { setIsRefreshing(false); refreshTimerRef.current = null; }, 500);
  }, [reportsOverride]);

  const handleRecenter = useCallback(() => {
    if (location) mapRef.current?.animateToCoordinate(location.latitude, location.longitude);
    else void startTracking();
  }, [location, startTracking]);

  const mapReports = useMemo(() => reports.map((report) => ({
    id: report.id,
    title: report.title,
    latitude: report.latitude,
    longitude: report.longitude,
    category: report.category,
    urgency: report.urgency,
  })), [reports]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.appName}>LaporAjaDulu</Text>
          <Text style={styles.appTagline}>Ada masalah? Laporin!</Text>
        </View>
        <View style={styles.badgeSDG}><Text style={styles.badgeSDGText}>SDG 11</Text></View>
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState title="Tidak Ada Laporan Aktif" message="Saat ini belum ada laporan kejadian di area pantauan Anda." onActionPress={handleRefreshReports} actionLabel="Muat Ulang Demo" />
        </View>
      ) : (
        <View style={styles.mapArea}>
          <MapViewContainer
            ref={mapRef}
            userLocation={location}
            reports={mapReports}
            selectedReportId={selectedReportId}
            onSelectReport={handleSelectReport}
          />
          <View style={styles.controlsOverlay}>
            <MapControls isTrackingActive={isTracking && !!location} isLoadingLocation={isRefreshing} onRecenterPress={handleRecenter} onRefreshPress={handleRefreshReports} />
          </View>
          {selectedReportWithDistance && (
            <View style={styles.selectedCardOverlay}>
              <SelectedReportCard report={selectedReportWithDistance} onClose={() => selectReport(null)} />
            </View>
          )}
          {permissionStatus !== 'granted' && (
            <View style={styles.permissionOverlay}>
              <PermissionState permissionStatus={permissionStatus === 'denied' ? 'denied' : 'undetermined'} onRequestPermission={() => void startTracking()} />
            </View>
          )}
          {!!errorMsg && <View style={styles.errorBanner}><Text style={styles.errorText}>{errorMsg}</Text></View>}
          {permissionStatus === 'granted' && !isTracking && (
            <View style={styles.startTracking}><Text onPress={() => void startTracking()} style={styles.startTrackingText}>Aktifkan pelacakan lokasi</Text></View>
          )}
          {isTracking && <View style={styles.locationBadge}><Text style={styles.locationBadgeText}>GPS aktif · {location?.accuracy ? `akurasi ±${Math.round(location.accuracy)} m` : 'mencari lokasi'}</Text><Text onPress={stopTracking} style={styles.stopText}>Matikan</Text></View>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { ...shadows.neuFlat, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surfaceElevated, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, zIndex: 10 },
  headerTextGroup: { flex: 1 },
  appName: { ...typography.screenTitle, color: colors.primaryDark, letterSpacing: 0.3 },
  appTagline: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  badgeSDG: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.borderSubtle },
  badgeSDGText: { ...typography.badge, color: colors.primary, fontSize: 10 },
  mapArea: { flex: 1, position: 'relative' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  controlsOverlay: { position: 'absolute', top: spacing.md, right: spacing.md, zIndex: 5 },
  selectedCardOverlay: { position: 'absolute', bottom: spacing.md, left: spacing.md, right: spacing.md, zIndex: 6 },
  permissionOverlay: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.xl, zIndex: 7 },
  errorBanner: { position: 'absolute', top: spacing.md, left: spacing.md, right: 76, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.warningBackground, zIndex: 8 },
  errorText: { ...typography.caption, color: colors.warningText },
  startTracking: { position: 'absolute', bottom: spacing.md, alignSelf: 'center', padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceElevated, zIndex: 6 },
  startTrackingText: { ...typography.body, color: colors.primary, fontWeight: '600' },
  locationBadge: { position: 'absolute', top: spacing.md, left: spacing.md, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surfaceElevated, zIndex: 5 },
  locationBadgeText: { ...typography.caption, color: colors.textPrimary },
  stopText: { ...typography.caption, color: colors.danger, marginTop: 3, fontWeight: '600' },
});
