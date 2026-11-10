import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapControls, MapPlaceholder, ReportMarker, SelectedReportCard } from '../components/map';
import { EmptyState } from '../components/ui';
import { mockReports } from '../mocks/mockReports';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { UIReport } from '../types/ui';

export interface MapScreenProps {
  reportsOverride?: UIReport[];
}

/**
 * Koordinat batas wilayah simulasi Kota Malang untuk memposisikan
 * marker demo secara proporsional di atas MapPlaceholder canvas.
 */
const MALANG_BOUNDS = {
  minLat: -7.9900,
  maxLat: -7.9350,
  minLng: 112.5900,
  maxLng: 112.6600,
};

function calculateMarkerOffset(latitude: number, longitude: number) {
  const latSpan = MALANG_BOUNDS.maxLat - MALANG_BOUNDS.minLat;
  const lngSpan = MALANG_BOUNDS.maxLng - MALANG_BOUNDS.minLng;

  // Normalisasi koordinat ke persentase kanvas (15% - 75% agar tidak keluar layar)
  const topPercent = Math.min(Math.max(((MALANG_BOUNDS.maxLat - latitude) / latSpan) * 60 + 15, 10), 75);
  const leftPercent = Math.min(Math.max(((longitude - MALANG_BOUNDS.minLng) / lngSpan) * 70 + 10, 8), 82);

  return { topPercent, leftPercent };
}

/**
 * MapScreen — Layar Utama Peta LaporAjaDulu
 * Mengomposisikan Header, Kanvas Peta Interaktif, Marker Laporan,
 * Kartu Ringkasan Terpilih, dan Floating Map Controls.
 */
export const MapScreen: React.FC<MapScreenProps> = ({ reportsOverride }) => {
  const insets = useSafeAreaInsets();
  const [reports, setReports] = useState<UIReport[]>(reportsOverride ?? mockReports);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pembersihan timer saat unmount untuk mencegah memory leak
  React.useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Laporan yang saat ini aktif dipilih
  const selectedReport = useMemo(() => {
    return reports.find((rep) => rep.id === selectedReportId) ?? null;
  }, [reports, selectedReportId]);

  // Handler pemilihan marker (memoized untuk menjaga kestabilan props ReportMarker)
  const handleSelectReport = useCallback((id: string) => {
    setSelectedReportId((prev) => (prev === id ? null : id));
  }, []);

  // Handler penutupan kartu laporan terpilih
  const handleCloseReport = useCallback(() => {
    setSelectedReportId(null);
  }, []);

  // Handler simulasi refresh laporan (demo sandbox dengan timer cleanup)
  const handleRefreshReports = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    setIsRefreshing(true);
    refreshTimerRef.current = setTimeout(() => {
      setReports(reportsOverride ?? mockReports);
      setIsRefreshing(false);
      refreshTimerRef.current = null;
    }, 700);
  }, [reportsOverride]);

  // Handler dummy re-center (GPS belum terintegrasi di tahap frontend)
  const handleRecenterPress = useCallback(() => {
    // No-op pada Fase C (belum ada modul GPS dari Anggota 3)
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header Aplikasi LaporAjaDulu (menyatu mulus dengan Status Bar) */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.appName}>LaporAjaDulu</Text>
          <Text style={styles.appTagline}>Ada masalah? Laporin!</Text>
        </View>

        <View style={styles.badgeSDG}>
          <Text style={styles.badgeSDGText}>SDG 11</Text>
        </View>
      </View>

      {/* Konten Utama: Area Peta */}
      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            title="Tidak Ada Laporan Aktif"
            message="Saat ini belum ada laporan kejadian di area pantauan Anda."
            onActionPress={handleRefreshReports}
            actionLabel="Muat Ulang Demo"
          />
        </View>
      ) : (
        <View style={styles.mapArea}>
          <MapPlaceholder>
            {/* Render Presentational Report Markers */}
            {reports.map((report) => {
              const { topPercent, leftPercent } = calculateMarkerOffset(report.latitude, report.longitude);
              const isSelected = report.id === selectedReportId;

              return (
                <View
                  key={report.id}
                  style={[
                    styles.markerPositionWrapper,
                    { top: `${topPercent}%`, left: `${leftPercent}%` },
                  ]}
                >
                  <ReportMarker
                    id={report.id}
                    latitude={report.latitude}
                    longitude={report.longitude}
                    category={report.category}
                    urgency={report.urgency}
                    isSelected={isSelected}
                    onSelect={handleSelectReport}
                  />
                </View>
              );
            })}
          </MapPlaceholder>

          {/* Floating Map Controls (Re-center & Refresh) */}
          <View style={styles.controlsOverlay}>
            <MapControls
              isTrackingActive={false} // Disabled: GPS modul Anggota 3 belum terhubung
              isLoadingLocation={isRefreshing}
              onRecenterPress={handleRecenterPress}
              onRefreshPress={handleRefreshReports}
            />
          </View>

          {/* Floating Selected Report Summary Card */}
          {selectedReport && (
            <View style={styles.selectedCardOverlay}>
              <SelectedReportCard
                report={selectedReport}
                onClose={handleCloseReport}
              />
            </View>
          )}
        </View>
      )}
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
});
