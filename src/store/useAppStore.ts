import { create } from 'zustand';
import type { UserLocation } from '../types/domain';

/** Global UDF store: actions are the only supported way to mutate shared state. */
interface AppState {
  userLocation: UserLocation | null;
  selectedReportId: string | null;
  setUserLocation: (location: UserLocation | null) => void;
  selectReport: (reportId: string | null) => void;
  resetMapState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  userLocation: null,
  selectedReportId: null,
  setUserLocation: (userLocation) => set({ userLocation }),
  selectReport: (selectedReportId) => set({ selectedReportId }),
  resetMapState: () => set({ userLocation: null, selectedReportId: null }),
}));
