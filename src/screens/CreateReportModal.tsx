import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryPicker } from '../components/form/CategoryPicker';
import { FormInput } from '../components/form/FormInput';
import { WatermarkPreview } from '../components/vault/WatermarkPreview';
import { useEvidenceCapture } from '../hooks/useEvidenceCapture';
import { colors, radius, shadows, spacing, touchTarget, typography } from '../theme';
import { ReportCategory } from '../types/ui';
import { PhotoWatermark, ReportDraft } from '../types/vault';

export interface CreateReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitReport: (draft: ReportDraft) => void;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  visible,
  onClose,
  onSubmitReport,
}) => {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('infrastructure');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [watermark, setWatermark] = useState<PhotoWatermark | null>(null);
  const [titleError, setTitleError] = useState('');
  const { captureEvidence, captureError } = useEvidenceCapture();

  const handleCapturePhoto = async () => {
    const result = await captureEvidence();
    if (result) {
      setPhotoUri(result.photoUri);
      setWatermark(result.watermark);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUri(null);
    setWatermark(null);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError('Judul laporan tidak boleh kosong');
      return;
    }
    setTitleError('');

    onSubmitReport({
      title,
      category,
      urgency: 'high',
      description,
      photoUri,
      watermark,
    });

    setTitle('');
    setDescription('');
    setPhotoUri(null);
    setWatermark(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buat Laporan Baru</Text>
          <Pressable
            onPress={onClose}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tutup formulir laporan"
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <FormInput
              label="Judul Laporan / Kejadian *"
              placeholder="Contoh: Jalan Ambles di Simpang Lima"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (titleError) setTitleError('');
              }}
              error={titleError}
            />

            <CategoryPicker selectedCategory={category} onSelectCategory={setCategory} />

            <FormInput
              label="Deskripsi Kejadian"
              placeholder="Jelaskan kondisi di lokasi, tingkat bahaya, dan dampaknya bagi warga sekitar..."
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
              style={styles.textArea}
            />

            <WatermarkPreview
              photoUri={photoUri}
              watermark={watermark}
              onCapturePress={() => void handleCapturePhoto()}
              onRemovePhoto={handleRemovePhoto}
            />

            {captureError ? (
              <View style={styles.captureErrorBanner}>
                <Text style={styles.captureErrorText}>{captureError}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleSubmit}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Kirim laporan warga"
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
              ]}
            >
              <Text style={styles.submitText}>Simpan & Terbitkan Laporan</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  captureErrorBanner: {
    backgroundColor: colors.dangerBackground,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  captureErrorText: {
    ...typography.caption,
    color: colors.dangerText,
  },
  submitButton: {
    backgroundColor: colors.primary,
    minHeight: touchTarget.minHeight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    elevation: 3,
  },
  submitButtonPressed: {
    backgroundColor: colors.primaryDark,
    opacity: 0.9,
  },
  submitText: {
    ...typography.sectionTitle,
    color: colors.textInverse,
  },
});