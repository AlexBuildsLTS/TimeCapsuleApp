import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Capsule } from '../types';
import { FirestoreService } from '@/services/firestoreService';
import { NotificationService } from '@/services/notificationService';
import { auth } from '@/config/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

interface StoreActions {
  // Capsule actions
  addCapsule: (
    capsule: Omit<Capsule, 'id' | 'createdAt' | 'userId'>
  ) => Promise<void>;
  updateCapsule: (id: string, updates: Partial<Capsule>) => void;
  deleteCapsule: (id: string) => Promise<void>;
  unlockCapsule: (id: string) => Promise<void>;

  // User actions
  setCurrentUser: (user: AppState['currentUser']) => void;

  // Real-time sync actions
  initializeFirestoreSync: () => void;
  stopFirestoreSync: () => void;

  // Notification actions
  initializeNotifications: () => Promise<void>;
}

interface Store extends AppState, StoreActions {
  firestoreUnsubscribe: (() => void) | null;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      capsules: [],
      currentUser: null,
      firestoreUnsubscribe: null,

      // Add capsule with encryption and cloud storage
      addCapsule: async (capsule) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No user is signed in to create a capsule.');
        }

        try {
          // Create capsule in Firestore with encryption
          const capsuleId = await FirestoreService.createCapsule(capsule);
          console.log('Capsule created with ID:', capsuleId);

          // The real-time listener will automatically update the local state
        } catch (error) {
          console.error('Error adding capsule:', error);
          throw new Error('Could not save capsule to the cloud.');
        }
      },

      // Update capsule locally (Firestore updates handled separately)
      updateCapsule: (id, updates) => {
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      // Delete capsule from Firestore
      deleteCapsule: async (id) => {
        try {
          await FirestoreService.deleteCapsule(id);
          // The real-time listener will automatically update the local state
        } catch (error) {
          console.error('Error deleting capsule:', error);
          throw new Error('Could not delete capsule from the cloud.');
        }
      },

      // Unlock capsule in Firestore
      unlockCapsule: async (id) => {
        try {
          await FirestoreService.unlockCapsule(id);
          // The real-time listener will automatically update the local state
        } catch (error) {
          console.error('Error unlocking capsule:', error);
          throw new Error('Could not unlock capsule.');
        }
      },

      // Set current user
      setCurrentUser: (user) => {
        set({ currentUser: user });

        if (user) {
          // Initialize Firestore sync when user logs in
          get().initializeFirestoreSync();
        } else {
          // Stop sync when user logs out
          get().stopFirestoreSync();
          set({ capsules: [] });
        }
      },

      // Initialize real-time Firestore sync
      initializeFirestoreSync: () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        // Stop existing subscription if any
        const existingUnsubscribe = get().firestoreUnsubscribe;
        if (existingUnsubscribe) {
          existingUnsubscribe();
        }

        // Start new subscription
        const unsubscribe = FirestoreService.subscribeToUserCapsules(
          currentUser.uid,
          (capsules) => {
            set({ capsules });
          }
        );

        set({ firestoreUnsubscribe: unsubscribe });
      },

      // Stop Firestore sync
      stopFirestoreSync: () => {
        const unsubscribe = get().firestoreUnsubscribe;
        if (unsubscribe) {
          unsubscribe();
          set({ firestoreUnsubscribe: null });
        }
      },

      // Initialize push notifications
      initializeNotifications: async () => {
        try {
          const hasPermission = await NotificationService.requestPermissions();
          if (hasPermission) {
            const token = await NotificationService.getPushToken();
            console.log('Push token:', token);

            // Initialize notification listeners
            NotificationService.initializeListeners();
          }
        } catch (error) {
          console.error('Error initializing notifications:', error);
        }
      },
    }),
    {
      name: 'time-capsule-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist Firestore subscription
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);

// Initialize auth state listener
onAuthStateChanged(auth, (user: User | null) => {
  const store = useStore.getState();

  if (user) {
    store.setCurrentUser({
      id: user.uid,
      name: user.displayName || 'Future Traveler',
      email: user.email || '',
    });
  } else {
    store.setCurrentUser(null);
  }
});
