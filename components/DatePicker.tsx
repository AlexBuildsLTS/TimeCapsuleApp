import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Calendar, X } from 'lucide-react-native';
import { Theme } from '@/constants/Theme';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
}

export function DatePicker({
  selectedDate,
  onDateChange,
  minimumDate,
}: DatePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getMinDateString = () => {
    const minDate = minimumDate || new Date();
    return formatDateForInput(minDate);
  };

  const handleDateChange = (dateString: string) => {
    if (dateString) {
      const newDate = new Date(dateString);
      if (!isNaN(newDate.getTime())) {
        onDateChange(newDate);
        setIsModalVisible(false);
      }
    }
  };

  // For web, we can use a native date input
  if (Platform.OS === 'web') {
    return (
      <Pressable
        style={styles.dateSelector}
        onPress={() => setIsModalVisible(true)}
      >
        <LinearGradient
          colors={[Theme.colors.surface, Theme.colors.surfaceVariant]}
          style={styles.dateSelectorGradient}
        >
          <Calendar size={20} color={Theme.colors.primary} />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </LinearGradient>

        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.modalContent}
            >
              <LinearGradient
                colors={Theme.colors.cosmicGradient}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Choose Unlock Date</Text>
                  <Pressable
                    onPress={() => setIsModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <X size={24} color={Theme.colors.onSurface} />
                  </Pressable>
                </View>

                <View style={styles.dateInputContainer}>
                  <TextInput
                    style={styles.dateInput}
                    value={formatDateForInput(selectedDate)}
                    onChangeText={handleDateChange}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={Theme.colors.onSurfaceVariant}
                    // @ts-ignore - Web-specific props
                    type="date"
                    min={getMinDateString()}
                  />
                </View>
              </LinearGradient>
            </MotiView>
          </View>
        </Modal>
      </Pressable>
    );
  }

  // For mobile, use a simple date input
  return (
    <Pressable
      style={styles.dateSelector}
      onPress={() => setIsModalVisible(true)}
    >
      <LinearGradient
        colors={[Theme.colors.surface, Theme.colors.surfaceVariant]}
        style={styles.dateSelectorGradient}
      >
        <Calendar size={20} color={Theme.colors.primary} />
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </LinearGradient>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.modalContent}
          >
            <LinearGradient
              colors={Theme.colors.cosmicGradient}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Unlock Date</Text>
                <Pressable
                  onPress={() => setIsModalVisible(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color={Theme.colors.onSurface} />
                </Pressable>
              </View>

              <View style={styles.dateInputContainer}>
                <Text style={styles.dateInputLabel}>Select Date:</Text>
                <TextInput
                  style={styles.dateInput}
                  value={formatDateForInput(selectedDate)}
                  onChangeText={handleDateChange}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Theme.colors.onSurfaceVariant}
                />
                <Text style={styles.dateInputHint}>
                  Enter date in YYYY-MM-DD format (e.g., 2024-12-25)
                </Text>
              </View>
            </LinearGradient>
          </MotiView>
        </View>
      </Modal>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dateSelector: {
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
  },
  dateSelectorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
    borderRadius: Theme.borderRadius.md,
  },
  dateText: {
    color: Theme.colors.onSurface,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  modalContent: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 380,
  },
  modalGradient: {
    padding: Theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  modalTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  dateInputContainer: {
    gap: Theme.spacing.md,
  },
  dateInputLabel: {
    ...Theme.typography.body,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-SemiBold',
  },
  dateInput: {
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    color: Theme.colors.onSurface,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
  },
  dateInputHint: {
    ...Theme.typography.caption,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
});
