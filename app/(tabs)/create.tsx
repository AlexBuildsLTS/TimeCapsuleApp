import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock as Seal,
  Plus,
  FileText,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { Theme } from '@/constants/Theme';
import { MediaItem } from '@/types';
import { MediaCapture } from '@/components/MediaCapture';
import { DatePicker } from '@/components/DatePicker';
import { auth } from '@/config/firebaseConfig';

type CreationStep = 'details' | 'media' | 'review' | 'sealing';

export default function CreateScreen() {
  const router = useRouter();
  const { addCapsule } = useStore();

  const [currentStep, setCurrentStep] = useState<CreationStep>('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unlockDate, setUnlockDate] = useState<Date>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [sealingSuccess, setSealingSuccess] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const stepProgress = { details: 0.25, media: 0.5, review: 0.75, sealing: 1 };

  const handleNextStep = () => {
    if (buttonLoading) return;

    switch (currentStep) {
      case 'details':
        if (!title.trim()) {
          Alert.alert('Title Required', 'Please give your capsule a title');
          return;
        }
        setCurrentStep('media');
        break;
      case 'media':
        setCurrentStep('review');
        break;
      case 'review':
        handleSealCapsule();
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'media':
        setCurrentStep('details');
        break;
      case 'review':
        setCurrentStep('media');
        break;
    }
  };

  const handleSealCapsule = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert(
        'Authentication Error',
        'You must be signed in to create a capsule.'
      );
      return;
    }

    setButtonLoading(true);

    try {
      setCurrentStep('sealing');

      // Create capsule with encryption handled by the service
      await addCapsule({
        title,
        description,
        unlockDate: unlockDate.getTime(),
        isSealed: true,
        isUnlocked: false,
        media: media,
        location: {
          latitude: 40.7128,
          longitude: -74.006,
          address: 'New York, NY',
        },
      });

      setSealingSuccess(true);
      setTimeout(() => {
        router.push('/(tabs)');
      }, 1500);
    } catch (error: any) {
      console.error('Full sealing error:', error);
      Alert.alert(
        'Failed to Seal',
        `An error occurred while sealing your capsule. Please check your connection and try again. \n\nError: ${error.message}`
      );
      setButtonLoading(false);
      setCurrentStep('review');
    }
  };

  const addTextNote = () => {
    const newNote: MediaItem = {
      id: Date.now().toString(),
      type: 'text',
      content: '',
      timestamp: Date.now(),
    };
    setMedia([...media, newNote]);
  };

  const updateTextNote = (id: string, content: string) => {
    setMedia(
      media.map((item) => (item.id === id ? { ...item, content } : item))
    );
  };

  const removeMediaItem = (id: string) => {
    setMedia(media.filter((item) => item.id !== id));
  };

  const addMediaItem = (newMedia: MediaItem) => {
    setMedia([...media, newMedia]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (currentStep === 'sealing') {
    return (
      <LinearGradient
        colors={Theme.colors.cosmicGradient}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.sealingContainer}>
            <MotiView
              from={{ scale: 0, rotate: '0deg' }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: ['0deg', '360deg', '0deg'],
              }}
              transition={{
                type: 'timing',
                duration: 2000,
                loop: !sealingSuccess,
                repeatReverse: false,
              }}
            >
              <Sparkles size={120} color={Theme.colors.primary} />
            </MotiView>
            <MotiText
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 500 }}
              style={styles.sealingTitle}
            >
              {sealingSuccess ? 'Sealed Successfully!' : 'Sealing Your Capsule'}
            </MotiText>
            <MotiText
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1000 }}
              style={styles.sealingSubtitle}
            >
              {!sealingSuccess
                ? 'Uploading memories to the cloud...'
                : 'Returning to your vault.'}
            </MotiText>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={Theme.colors.cosmicGradient}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.header}
        >
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <MotiView
                animate={{ width: `${stepProgress[currentStep] * 100}%` }}
                transition={{ type: 'timing', duration: 500 }}
                style={styles.progressFill}
              />
            </View>
          </View>
          <Text style={styles.stepTitle}>
            {currentStep === 'details' && 'Capsule Details'}
            {currentStep === 'media' && 'Add Memories'}
            {currentStep === 'review' && 'Review & Seal'}
          </Text>
        </MotiView>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 'details' && (
            <MotiView
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              style={styles.stepContainer}
            >
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Capsule Title</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="A message to my future self..."
                  placeholderTextColor={Theme.colors.onSurfaceVariant}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  placeholder="What memories are you preserving?"
                  placeholderTextColor={Theme.colors.onSurfaceVariant}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Unlock Date</Text>
                <DatePicker
                  selectedDate={unlockDate}
                  onDateChange={setUnlockDate}
                  minimumDate={new Date()}
                />
                <Text style={styles.dateHint}>
                  Choose when this capsule should unlock in the future
                </Text>
              </View>
            </MotiView>
          )}
          {currentStep === 'media' && (
            <MotiView
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              style={styles.stepContainer}
            >
              <MediaCapture
                media={media}
                onMediaAdded={addMediaItem}
                onMediaRemoved={removeMediaItem}
              />
              <View style={styles.textNoteSection}>
                <Pressable style={styles.addTextButton} onPress={addTextNote}>
                  <LinearGradient
                    colors={Theme.colors.accentGradient}
                    style={styles.addTextButtonGradient}
                  >
                    <Plus size={20} color={Theme.colors.background} />
                    <Text style={styles.addTextButtonText}>Add Text Note</Text>
                  </LinearGradient>
                </Pressable>
              </View>
              <View style={styles.textNotesList}>
                {media.map(
                  (item, index) =>
                    item.type === 'text' && (
                      <MotiView
                        key={item.id}
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 100 }}
                        style={styles.textNoteItem}
                      >
                        <View style={styles.textNoteContainer}>
                          <FileText size={20} color={Theme.colors.primary} />
                          <TextInput
                            style={styles.noteInput}
                            placeholder="Write your note..."
                            placeholderTextColor={Theme.colors.onSurfaceVariant}
                            value={item.content}
                            onChangeText={(text) =>
                              updateTextNote(item.id, text)
                            }
                            multiline
                          />
                          <Pressable
                            onPress={() => removeMediaItem(item.id)}
                            style={styles.removeButton}
                          >
                            <Text style={styles.removeText}>×</Text>
                          </Pressable>
                        </View>
                      </MotiView>
                    )
                )}
              </View>
            </MotiView>
          )}
          {currentStep === 'review' && (
            <MotiView
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              style={styles.stepContainer}
            >
              <Text style={styles.sectionTitle}>Review Your Capsule</Text>
              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>{title}</Text>
                {description && (
                  <Text style={styles.reviewDescription}>{description}</Text>
                )}
                <View style={styles.reviewDetail}>
                  <Calendar size={16} color={Theme.colors.primary} />
                  <Text style={styles.reviewDetailText}>
                    Unlocks on {formatDate(unlockDate)}
                  </Text>
                </View>
                <View style={styles.reviewDetail}>
                  <FileText size={16} color={Theme.colors.primary} />
                  <Text style={styles.reviewDetailText}>
                    {media.length} {media.length === 1 ? 'item' : 'items'} added
                  </Text>
                </View>
              </View>
              <View style={styles.warningCard}>
                <Seal size={24} color={Theme.colors.warning} />
                <Text style={styles.warningText}>
                  Once sealed, this capsule cannot be opened or modified until
                  the unlock date.
                </Text>
              </View>
            </MotiView>
          )}
        </ScrollView>
        <View style={styles.navigation}>
          {currentStep !== 'details' && (
            <Pressable onPress={handlePreviousStep} style={styles.navButton}>
              <ArrowLeft size={20} color={Theme.colors.onSurface} />
              <Text style={styles.navButtonText}>Back</Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleNextStep}
            style={[styles.navButton, styles.primaryButton]}
            disabled={buttonLoading}
          >
            <LinearGradient
              colors={Theme.colors.accentGradient}
              style={styles.navButtonGradient}
            >
              {buttonLoading ? (
                <ActivityIndicator color={Theme.colors.background} />
              ) : (
                <>
                  <Text
                    style={[
                      styles.navButtonText,
                      { color: Theme.colors.background },
                    ]}
                  >
                    {currentStep === 'review' ? 'Seal Capsule' : 'Continue'}
                  </Text>
                  {currentStep !== 'review' && (
                    <ArrowRight size={20} color={Theme.colors.background} />
                  )}
                  {currentStep === 'review' && (
                    <Seal size={20} color={Theme.colors.background} />
                  )}
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { padding: Theme.spacing.lg, paddingBottom: Theme.spacing.md },
  progressContainer: { marginBottom: Theme.spacing.lg },
  progressBar: {
    height: 4,
    backgroundColor: Theme.colors.surfaceVariant,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  stepTitle: {
    ...Theme.typography.h2,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginTop: Theme.spacing.md,
  },
  content: { flex: 1, paddingHorizontal: Theme.spacing.lg },
  stepContainer: { flex: 1 },
  inputContainer: { marginBottom: Theme.spacing.xl },
  label: {
    ...Theme.typography.body,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-SemiBold',
    marginBottom: Theme.spacing.sm,
  },
  textInput: {
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    color: Theme.colors.onSurface,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
  },
  multilineInput: { height: 100, textAlignVertical: 'top' },
  dateHint: {
    ...Theme.typography.caption,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    marginTop: Theme.spacing.xs,
  },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  textNoteSection: { marginVertical: Theme.spacing.lg },
  addTextButton: { borderRadius: Theme.borderRadius.md, overflow: 'hidden' },
  addTextButtonGradient: {
    padding: Theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  addTextButtonText: {
    color: Theme.colors.background,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  textNotesList: { gap: Theme.spacing.md },
  textNoteItem: {
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
  },
  textNoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  noteInput: {
    flex: 1,
    color: Theme.colors.onSurface,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  removeButton: { padding: Theme.spacing.xs },
  removeText: { color: Theme.colors.error, fontSize: 20, fontWeight: 'bold' },
  reviewCard: {
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
  },
  reviewTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    marginBottom: Theme.spacing.sm,
  },
  reviewDescription: {
    ...Theme.typography.body,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    marginBottom: Theme.spacing.md,
  },
  reviewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  reviewDetailText: {
    ...Theme.typography.body,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Regular',
  },
  warningCard: {
    backgroundColor: Theme.colors.warning + '20',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.warning + '50',
  },
  warningText: {
    ...Theme.typography.body,
    color: Theme.colors.warning,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  navButton: {
    flex: 1,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
  },
  navButtonGradient: {
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    ...StyleSheet.absoluteFillObject,
  },
  primaryButton: { flex: 2, backgroundColor: 'transparent' },
  navButtonText: {
    ...Theme.typography.body,
    fontFamily: 'Inter-SemiBold',
    color: Theme.colors.onSurface,
  },
  sealingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  sealingTitle: {
    ...Theme.typography.h1,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginTop: Theme.spacing.xl,
  },
  sealingSubtitle: {
    ...Theme.typography.body,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: Theme.spacing.md,
  },
});
