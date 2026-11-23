import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../components/ui';
import { VaultItemCard } from '../components/vault/VaultItemCard';
import { colors, radius, shadows, spacing, touchTarget, typography } from '../theme';
import { VaultItem } from '../types/vault';

export interface DocumentVaultModalProps {
  visible: boolean;
  onClose: () => void;
  vaultItems?: VaultItem[];
  totalSizeFormatted?: string;
}

export const DocumentVaultModal: React.FC<DocumentVaultModalProps> = ({
  visible,
  onClose,
  vaultItems = [],
  totalSizeFormatted = '0 KB',
}) => {
  const insets = useSafeAreaInsets();

  const handleItemPress = (_item: VaultItem) => {};

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Document Vault</Text>
            <Text style={styles.headerSubtitle}>Scoped Storage Sandbox • Offline First</Text>
          </View>
          <Pressable
            onPress={onClose}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tutup Document Vault"
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.storageSummaryBanner}>
          <Text style={styles.storageIcon}>🛡️</Text>
          <View style={styles.storageTextGroup}>
            <Text style={styles.storageTitle}>Penyimpanan Berkas Terisolasi</Text>
            <Text style={styles.storageSubtitle}>
              {vaultItems.length} berkas bukti tersimpan di documentDirectory (Total {totalSizeFormatted})
            </Text>
          </View>
        </View>

        {vaultItems.length === 0 ? (
          <EmptyState
            title="Vault Masih Kosong"
            message="Foto bukti laporan yang Anda ambil akan otomatis tersimpan aman di Scoped Storage perangkat."
          />
        ) : (
          <FlatList
            data={vaultItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VaultItemCard item={item} onPress={handleItemPress} />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
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
  },
  headerTitle: {
    ...typography.sectionTitle,
    color: colors.primaryDark,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  closeButton: {
    width: touchTarget.minWidth,
    height: touchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  storageSummaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  storageIcon: {
    fontSize: 22,
    marginRight: spacing.sm,
  },
  storageTextGroup: {
    flex: 1,
  },
  storageTitle: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  storageSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  listContent: {
    padding: spacing.lg,
  },
});