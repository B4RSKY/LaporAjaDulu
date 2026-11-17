# Milestone 1 — Test Plan

## Manual verification (Android device)
1. Open the app and verify the interactive Google map appears centered around Malang (fallback only; not the user's location).
2. Tap the location permission action and grant foreground location permission.
3. Verify the blue user-location indicator appears and the GPS status badge is visible.
4. Move the device / simulate a new location; verify the location watcher updates the user position. The watcher selects a 5 m, 10 m, or 25 m distance threshold based on the initial GPS accuracy.
5. Tap a report marker; verify the selected report card appears.
6. With location available, verify the selected report card displays the Haversine distance.
7. Deny permission or disable device location; verify the app remains usable and displays a permission/error state.
8. Stop tracking; verify the GPS status badge disappears.

## Build checks
- `npm install`
- `npx tsc --noEmit`
- `npx expo-doctor`
- `npx expo start` then test on a physical Android device or compatible development build.

## Notes
- Maps and location are native modules; use a development build if Expo Go does not include a compatible native module in the installed runtime.
- Do not claim a successful device test until it has been run on a device.
