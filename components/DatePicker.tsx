import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Calendar, X } from 'lucide-react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Theme } from '@/constants/Theme';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minimumDate?: Date;
}

const screenWidth = Dimensions.get('window').width;

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

  // <-- FIX: The 'date' parameter is already a Date object. No need for .toDate()
  const handleDateChange = (date: Date) => {
    if (date) {
      onDateChange(new Date(date)); // Use new Date() to ensure it's a fresh instance
      setIsModalVisible(false);
    }
  };

  return (
    <>
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
      </Pressable>

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
              colors={Theme.colors.cosmicGradient as any}
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

              <CalendarPicker
                onDateChange={handleDateChange}
                selectedStartDate={selectedDate}
                minDate={minimumDate || new Date()}
                scaleFactor={375}
                width={screenWidth - Theme.spacing.lg * 4} // Make it responsive
                height={400}
                // --- Styling Props for a cohesive look ---
                selectedDayColor={Theme.colors.primary}
                selectedDayTextColor={Theme.colors.background}
                todayBackgroundColor={Theme.colors.primary + '30'}
                todayTextStyle={{ color: Theme.colors.primary }}
                textStyle={{
                  color: Theme.colors.onSurface,
                  fontFamily: 'Inter-Regular',
                }}
                monthTitleStyle={{
                  color: Theme.colors.onSurface,
                  fontFamily: 'Inter-Bold',
                }}
                yearTitleStyle={{
                  color: Theme.colors.onSurface,
                  fontFamily: 'Inter-Bold',
                }}
                previousTitle="<"
                nextTitle=">"
                previousTitleStyle={{
                  color: Theme.colors.primary,
                  fontSize: 20,
                }}
                nextTitleStyle={{ color: Theme.colors.primary, fontSize: 20 }}
                dayLabelsWrapper={{
                  borderTopColor: Theme.colors.surfaceVariant,
                  borderBottomColor: Theme.colors.surfaceVariant,
                }}
                customDayHeaderStyles={() => ({
                  textStyle: {
                    color: Theme.colors.onSurfaceVariant,
                    fontFamily: 'Inter-SemiBold',
                  },
                })}
              />
            </LinearGradient>
          </MotiView>
        </View>
      </Modal>
    </>
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
});
