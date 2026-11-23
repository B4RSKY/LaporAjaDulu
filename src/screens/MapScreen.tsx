import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapControls, MapViewContainer, MapViewContainerRef, SelectedReportCard } from '../components/map';
import { EmptyState, PermissionState } from '../components/ui';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { mockReports } from '../mocks/mockReports';
import { useAppStore } from '../store/useAppStore';
import { colors, radius, shadows, spacing, touchTarget, typography } from '../theme';
import { UIReport } from '../types/ui';
import { ReportDraft } from '../types/vault';
import { calculateHaversineDistance, formatDistance } from '../utils/distance';
import { CreateReportModal } from './CreateReportModal';
import { DocumentVaultModal } from './DocumentVaultModal';

export interface MapScreenProps { reportsOverride?: UIReport[] }

export const MapScreen: React.FC<MapScreenProps> = ({ reportsOverride }) => {
  const insets = useSafeAreaInsets();
  const [reports, setReports] = useState<UIReport[]>(reportsOverride ?? mockReports);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mapRef = useRef<MapViewContainerRef>(null);
  const { location, permissionStatus, errorMsg, isTracking, startTracking, stopTracking } = useLocationTracking();
  const selectedReportId = useAppStore((state) => state.selectedReportId);
  const selectReport = useAppStore((state) => state.selectReport);

  useEffect(() => () => { if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current); }, []);
  const reportsWithDistance = useMemo(() => reports.map((report) => ({
    ...report,
    distanceFormatted: location
      ? formatDistance(calculateHaversineDistance(location, { latitude: report.latitude, longitude: report.longitude }))
      : undefined,
  })), [reports, location]);
  const selectedReport = useMemo(
    () => reportsWithDistance.find((item) => item.id === selectedReportId) ?? null,
    [reportsWithDistance, selectedReportId]
  );

  // Handler pemilihan marker (memoized untuk menjaga kestabilan props ReportMarker)
  const handleSelectReport = useCallback((report: { id: string }) => {
    const nextId = selectedReportId === report.id ? null : report.id;
    selectReport(nextId);
  }, [selectedReportId, selectReport]);

  // Handler penutupan kartu laporan terpilih
  const handleCloseReport = useCallback(() => {
    selectReport(null);
  }, [selectReport]);

  // Handler penerbitan laporan baru (Milestone 2)
  const handleCreateReport = useCallback((draft: ReportDraft) => {
    const newReport: UIReport = {
      id: `rep-user-${Date.now()}`,
      title: draft.title,
      description: draft.description || 'Laporan baru dari warga sekitar lokasi.',
      category: draft.category,
      urgency: draft.urgency,
      latitude: draft.watermark?.latitude ?? -7.9600,
      longitude: draft.watermark?.longitude ?? 112.6300,
      createdAtFormatted: 'Baru Saja',
      distanceFormatted: 'Lokasi Anda',
    };

    setReports((prev) => [newReport, ...prev]);
    selectReport(newReport.id);
  }, [selectReport]);

  // Handler simulasi refresh laporan (demo sandbox dengan timer cleanup)
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

          {/* Floating Action Buttons: Buat Laporan & Buka Vault (Milestone 2) */}
          <View style={styles.fabButtonGroup}>
            <Pressable
              onPress={() => setIsVaultModalOpen(true)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Buka arsip Document Vault"
              style={({ pressed }) => [
                styles.vaultButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.vaultButtonText}>📁 Vault</Text>
            </Pressable>

            <Pressable
              onPress={() => setIsCreateModalOpen(true)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Buat laporan warga baru"
              style={({ pressed }) => [
                styles.reportFab,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.reportFabText}>➕ Lapor</Text>
            </Pressable>
          </View>

          {/* Floating Selected Report Summary Card */}
          {selectedReport && (
            <View style={styles.selectedCardOverlay}>
              <SelectedReportCard report={selectedReport} onClose={handleCloseReport} />
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

      {/* Modal Formulir Laporan Baru */}
      <CreateReportModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitReport={handleCreateReport}
      />

      {/* Modal Galeri Dokumen Scoped Storage */}
      <DocumentVaultModal
        visible={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    ...shadows.neuFlat,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    zIndex: 10,
  },
  headerTextGroup: {
    flex: 1,
  },
  appName: {
    ...typography.screenTitle,
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  appTagline: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeSDG: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  badgeSDGText: {
    ...typography.badge,
    color: colors.primary,
    fontSize: 10,
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  markerPositionWrapper: {
    position: 'absolute',
    transform: [{ translateX: -24 }, { translateY: -40 }], // Offset tengah pin pointer
    zIndex: 2,
  },
  controlsOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 5,
  },
  selectedCardOverlay: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    zIndex: 6,
  },
  permissionOverlay: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.xl,
    zIndex: 7,
  },
  errorBanner: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    top: spacing.md,
    zIndex: 8,
    backgroundColor: colors.dangerBackground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.dangerText,
  },
  startTracking: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
    zIndex: 8,
  },
  startTrackingText: {
    ...typography.caption,
    color: colors.primaryDark,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  locationBadge: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
    zIndex: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  locationBadgeText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  stopText: {
    ...typography.caption,
    color: colors.dangerText,
    fontWeight: '700',
  },
  fabButtonGroup: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    zIndex: 5,
  },
  vaultButton: {
    ...shadows.neuRaised,
    backgroundColor: colors.surfaceElevated,
    minHeight: touchTarget.minHeight,
    paddingHorizontal: spacing.md,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  vaultButtonText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  reportFab: {
    backgroundColor: colors.primary,
    minHeight: touchTarget.minHeight,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  reportFabText: {
    ...typography.sectionTitle,
    color: colors.textInverse,
    fontSize: 14,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
