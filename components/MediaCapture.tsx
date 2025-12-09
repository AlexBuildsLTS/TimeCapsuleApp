import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import {
  Camera,
  Image as ImageIcon,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import * as Location from 'expo-location';
import { Theme } from '@/constants/Theme';
import { MediaItem } from '../types';
import { uploadMediaToStorage } from '@/services/storageService'; // New import for upload helper

interface MediaCaptureProps {
  onMediaAdded: (media: MediaItem) => void;
  onMediaRemoved: (id: string) => void;
  media: MediaItem[];
}

export function MediaCapture({
  onMediaAdded,
  onMediaRemoved,
  media,
}: MediaCaptureProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<{
    sound: Audio.Sound;
    id: string;
  } | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Camera and photo library access is required.'
        );
        return false;
      }
      if (audioStatus !== 'granted') {
        Alert.alert('Permission needed', 'Microphone access is required.');
        return false;
      }
      if (locationStatus !== 'granted') {
        console.log(
          'Location permission not granted. Proceeding without location tagging.'
        );
      }
    }
    return true;
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') return undefined;
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') return undefined;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.log('Error getting location:', error);
      return undefined;
    }
  };

  const handleMediaUpload = async (
    uri: string,
    type: 'photo' | 'video' | 'audio'
  ) => {
    try {
      const location = await getCurrentLocation();
      const newMedia: MediaItem = {
        id: Date.now().toString(), // Ensure ID is unique
        type,
        content: uri, // Store local URI
        timestamp: Date.now(),
        location,
      };
      onMediaAdded(newMedia);
    } catch (error) {
      console.error('Failed to add media:', error);
      Alert.alert('Error', 'Failed to add media. Please try again.');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (Platform.OS === 'web') {
      await pickImage();
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await handleMediaUpload(result.assets[0].uri, 'photo');
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const type: 'photo' | 'video' =
        result.assets[0].type === 'video' ? 'video' : 'photo';
      await handleMediaUpload(result.assets[0].uri, type);
    }
  };

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Unsupported',
        'Audio recording is not available on the web version.'
      );
      return;
    }
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      if (uri) {
        await handleMediaUpload(uri, 'audio');
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
    setRecording(null);
  };

  const playAudio = async (uri: string, id: string) => {
    try {
      if (playingAudio?.id === id) {
        await playingAudio.sound.stopAsync();
        setPlayingAudio(null);
        return;
      }
      if (playingAudio) {
        await playingAudio.sound.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync({ uri });
      setPlayingAudio({ sound, id });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingAudio(null);
          sound.unloadAsync();
        }
      });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAudio(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Capture Your Memories</Text>
      <View style={styles.actionButtons}>
        <Pressable style={styles.actionButton} onPress={takePhoto}>
          <LinearGradient
            colors={[Theme.colors.surface, Theme.colors.surfaceVariant]}
            style={styles.actionButtonGradient}
          >
            <Camera size={28} color={Theme.colors.primary} />
            <Text style={styles.actionButtonText}>
              {Platform.OS === 'web' ? 'Upload' : 'Camera'}
            </Text>
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={pickImage}>
          <LinearGradient
            colors={[Theme.colors.surface, Theme.colors.surfaceVariant]}
            style={styles.actionButtonGradient}
          >
            <ImageIcon size={28} color={Theme.colors.primary} />
            <Text style={styles.actionButtonText}>Gallery</Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <LinearGradient
            colors={
              isRecording
                ? [Theme.colors.error, '#FF525280']
                : [Theme.colors.surface, Theme.colors.surfaceVariant]
            }
            style={styles.actionButtonGradient}
          >
            {isRecording ? (
              <Square
                size={28}
                color={Theme.colors.onSurface}
                fill={Theme.colors.onSurface}
              />
            ) : (
              <Mic size={28} color={Theme.colors.primary} />
            )}
            <Text style={styles.actionButtonText}>
              {isRecording ? 'Stop' : 'Record'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
      {isRecording && (
        <MotiView
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 1000, loop: true }}
          style={styles.recordingIndicator}
        >
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Recording...</Text>
        </MotiView>
      )}
      {media.length > 0 && (
        <View style={styles.mediaPreview}>
          <Text style={styles.previewTitle}>Added Media ({media.length})</Text>
          <View style={styles.mediaGrid}>
            {media.map((item, index) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 100 }}
                style={styles.mediaItem}
              >
                <View style={styles.mediaContainer}>
                  {item.type === 'photo' && (
                    <Image
                      source={{ uri: item.content }}
                      style={styles.mediaImage}
                    />
                  )}
                  {item.type === 'video' && (
                    <View style={styles.videoPlaceholder}>
                      <Play size={32} color={Theme.colors.primary} />
                    </View>
                  )}
                  {item.type === 'audio' && (
                    <Pressable
                      style={styles.audioContainer}
                      onPress={() => playAudio(item.content, item.id)}
                    >
                      {playingAudio?.id === item.id ? (
                        <Pause size={24} color={Theme.colors.primary} />
                      ) : (
                        <Play size={24} color={Theme.colors.primary} />
                      )}
                    </Pressable>
                  )}
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => onMediaRemoved(item.id)}
                  >
                    <Trash2 size={16} color={Theme.colors.error} />
                  </Pressable>
                </View>
              </MotiView>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  actionButton: {
    flex: 1,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  actionButtonGradient: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    alignItems: 'center',
    gap: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
    height: 90,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: Theme.colors.onSurface,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.error,
  },
  recordingText: { color: Theme.colors.error, fontFamily: 'Inter-SemiBold' },
  mediaPreview: { marginTop: Theme.spacing.lg },
  previewTitle: {
    ...Theme.typography.body,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-SemiBold',
    marginBottom: Theme.spacing.md,
  },
  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Theme.spacing.md },
  mediaItem: { width: '30%', aspectRatio: 1 },
  mediaContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  videoPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  audioContainer: { justifyContent: 'center', alignItems: 'center' },
  removeButton: {
    position: 'absolute',
    top: Theme.spacing.xs,
    right: Theme.spacing.xs,
    backgroundColor: Theme.colors.background + 'A0',
    borderRadius: Theme.borderRadius.full,
    padding: Theme.spacing.xs,
  },
});
