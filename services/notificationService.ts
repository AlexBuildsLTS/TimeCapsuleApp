import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { auth } from '@/config/firebaseConfig';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert is deprecated, use shouldShowBanner and shouldShowList instead
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('Push notifications not supported on web');
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  // Get push notification token
  static async getPushToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
      });
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Schedule a local notification for capsule unlock
  static async scheduleUnlockNotification(
    capsuleId: string,
    capsuleTitle: string,
    unlockDate: Date
  ): Promise<string | null> {
    if (Platform.OS === 'web') {
      console.log('Local notifications not supported on web');
      return null;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 Time Capsule Ready!',
          body: `Your capsule "${capsuleTitle}" is ready to be opened!`,
          data: { capsuleId, type: 'unlock' },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: unlockDate,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  // Cancel a scheduled notification
  static async cancelNotification(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Initialize notification listeners
  static initializeListeners() {
    if (Platform.OS === 'web') return;

    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    // Handle notification tapped
    Notifications.addNotificationResponseReceivedListener((response) => {
      const { capsuleId, type } = response.notification.request.content.data;

      if (type === 'unlock' && capsuleId) {
        // Navigate to unlock ceremony or vault
        console.log('User tapped unlock notification for capsule:', capsuleId);
      }
    });
  }
}
