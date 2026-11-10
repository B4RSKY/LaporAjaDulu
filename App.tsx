import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MapScreen } from './src/screens/MapScreen';
import { colors } from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider style={styles.root}>
      <StatusBar style="dark" />
      <MapScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
