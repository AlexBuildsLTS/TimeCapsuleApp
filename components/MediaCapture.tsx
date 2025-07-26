import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Camera, Image as ImageIcon, Mic, Square, Play, Pause, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { Theme } from '@/constants/Theme';
import { MediaItem } from '@/types';

interface MediaCaptureProps {
  onMediaAdded: (media: MediaItem) => void;
  onMediaRemoved: (id: string) => void;
  media: MediaItem[];
}

export function MediaCapture({ onMediaAdded, onMediaRemoved, media }: MediaCaptureProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
      Alert.alert('Permission needed', 'Camera and photo library access is required to add photos and videos.');
      return false;
    }

    if (audioStatus !== 'granted') {
      Alert.alert('Permission needed', 'Microphone access is required to record voice memos.');
      return false;
    }

    if (locationStatus !== 'granted') {
      Alert.alert('Permission needed', 'Location access is required to tag your memories with location.');
      return false;
    }

    return true;
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.log('Error getting location:', error);
      return undefined;
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const location = await getCurrentLocation();
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        type: 'photo',
        content: result.assets[0].uri,
        timestamp: Date.now(),
        location,
      };
      onMediaAdded(newMedia);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const location = await getCurrentLocation();
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        type: result.assets[0].type === 'video' ? 'video' : 'photo',
        content: result.assets[0].uri,
        timestamp: Date.now(),
        location,
      };
      onMediaAdded(newMedia);
    }
  };

  const startRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
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
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    if (uri) {
      const location = await getCurrentLocation();
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        type: 'audio',
        content: uri,
        timestamp: Date.now(),
        location,
      };
      onMediaAdded(newMedia);
    }
    setRecording(null);
  };

  const playAudio = async (uri: string, id: string) => {
    try {
      if (playingAudio === id) {
        setPlayingAudio(null);
        return;
      }

      const { sound } = await Audio.Sound.createAsync({ uri });
      setPlayingAudio(id);
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingAudio(null);
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
      
      {/* Media Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable style={styles.actionButton} onPress={takePhoto}>
          <LinearGradient colors={[Theme.colors.surface, Theme.colors.surfaceVariant]} style={styles.actionButtonGradient}>
            <Camera size={28} color={Theme.colors.primary} />
            <Text style={styles.actionButtonText}>Camera</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={pickImage}>
          <LinearGradient colors={[Theme.colors.surface, Theme.colors.surfaceVariant]} style={styles.actionButtonGradient}>
            <ImageIcon size={28} color={Theme.colors.primary} />
            <Text style={styles.actionButtonText}>Gallery</Text>
          </LinearGradient>
        </Pressable>

        <Pressable 
          style={styles.actionButton} 
          onPress={isRecording ? stopRecording : startRecording}
        >
          <LinearGradient 
            colors={isRecording ? [Theme.colors.error, Theme.colors.error + '80'] : [Theme.colors.surface, Theme.colors.surfaceVariant]} 
            style={styles.actionButtonGradient}
          >
            {isRecording ? (
              <Square size={28} color={Theme.colors.onSurface} fill={Theme.colors.onSurface} />
            ) : (
              <Mic size={28} color={Theme.colors.primary} />
            )}
            <Text style={[styles.actionButtonText, { color: isRecording ? Theme.colors.onSurface : Theme.colors.onSurface }]}>
              {isRecording ? 'Stop' : 'Record'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Recording Indicator */}
      {isRecording && (
        <MotiView
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 1000,
            loop: true,
          }}
          style={styles.recordingIndicator}
        >
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Recording...</Text>
        </MotiView>
      )}

      {/* Media Preview */}
      {media.length > 0 && (
        <View style={styles.mediaPreview}>
          <Text style={styles.previewTitle}>Added Memories ({media.length})</Text>
          <View style={styles.mediaGrid}>
            {media.map((item, index) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 100 }}
                style={styles.mediaItem}
              >
                {item.type === 'photo' && (
                  <View style={styles.mediaContainer}>
                    <Image source={{ uri: item.content }} style={styles.mediaImage} />
                    <Pressable 
                      style={styles.removeButton}
                      onPress={() => onMediaRemoved(item.id)}
                    >
                      <Trash2 size={16} color={Theme.colors.error} />
                    </Pressable>
                  </View>
                )}

                {item.type === 'video' && (
                  <View style={styles.mediaContainer}>
                    <View style={styles.videoPlaceholder}>
                      <Play size={32} color={Theme.colors.primary} />
                      <Text style={styles.videoText}>Video</Text>
                    </View>
                    <Pressable 
                      style={styles.removeButton}
                      onPress={() => onMediaRemoved(item.id)}
                    >
                      <Trash2 size={16} color={Theme.colors.error} />
                    </Pressable>
                  </View>
                )}

                {item.type === 'audio' && (
                  <View style={styles.mediaContainer}>
                    <Pressable 
                      style={styles.audioContainer}
                      onPress={() => playAudio(item.content, item.id)}
                    >
                      {playingAudio === item.id ? (
                        <Pause size={24} color={Theme.colors.primary} />
                      ) : (
                        <Play size={24} color={Theme.colors.primary} />
                      )}
                      <Text style={styles.audioText}>Voice Memo</Text>
                    </Pressable>
                    <Pressable 
                      style={styles.removeButton}
                      onPress={() => onMediaRemoved(item.id)}
                    >
                      <Trash2 size={16} color={Theme.colors.error} />
                    </Pressable>
                  </View>
                )}
              </MotiView>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  },
  actionButtonGradient: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
    gap: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
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
  recordingText: {
    color: Theme.colors.error,
    fontFamily: 'Inter-SemiBold',
  },
  mediaPreview: {
    marginTop: Theme.spacing.lg,
  },
  previewTitle: {
    ...Theme.typography.body,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-SemiBold',
    marginBottom: Theme.spacing.md,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  mediaItem: {
    width: '48%',
  },
  mediaContainer: {
    position: 'relative',
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
  },
  mediaImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  videoPlaceholder: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceVariant,
  },
  videoText: {
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Regular',
    marginTop: Theme.spacing.xs,
  },
  audioContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.surfaceVariant,
  },
  audioText: {
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Regular',
    marginTop: Theme.spacing.xs,
  },
  removeButton: {
    position: 'absolute',
    top: Theme.spacing.xs,
    right: Theme.spacing.xs,
    backgroundColor: Theme.colors.background + '90',
    borderRadius: Theme.borderRadius.sm,
    padding: Theme.spacing.xs,
  },
});