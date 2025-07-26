import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Capsule } from '../types';
import { auth } from '@/config/firebaseConfig';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

interface StoreActions {
  // The function now returns a Promise, as it's an async operation
  addCapsule: (
    capsule: Omit<Capsule, 'id' | 'createdAt' | 'userId'>
  ) => Promise<void>;
  updateCapsule: (id: string, updates: Partial<Capsule>) => void;
  deleteCapsule: (id: string) => void;
  unlockCapsule: (id: string) => void;
  setCurrentUser: (user: AppState['currentUser']) => void;
}

interface Store extends AppState, StoreActions {}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      capsules: [],
      currentUser: null,

      // --- THIS FUNCTION IS NOW ASYNCHRONOUS ---
      addCapsule: async (capsule) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No user is signed in to create a capsule.');
        }

        const db = getFirestore();
        const newCapsuleData = {
          ...capsule,
          createdAt: Date.now(),
          userId: currentUser.uid,
        };

        try {
          // Add a new document with a generated id to the "capsules" collection
          const docRef = await addDoc(
            collection(db, 'capsules'),
            newCapsuleData
          );
          console.log('Capsule written to Firestore with ID: ', docRef.id);

          // For now, we also add it to local state so the UI updates instantly.
          // In a future step, we will read directly from Firestore.
          set((state) => ({
            capsules: [...state.capsules, { ...newCapsuleData, id: docRef.id }],
          }));
        } catch (e) {
          console.error('Error adding capsule to Firestore: ', e);
          throw new Error('Could not save capsule to the cloud.');
        }
      },

      // Other functions remain the same for now
      updateCapsule: (id, updates) => {
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },
      deleteCapsule: (id) => {
        set((state) => ({
          capsules: state.capsules.filter((c) => c.id !== id),
        }));
      },
      unlockCapsule: (id) => {
        set((state) => ({
          capsules: state.capsules.map((c) =>
            c.id === id ? { ...c, isUnlocked: true } : c
          ),
        }));
      },
      setCurrentUser: (user) => {
        set({ currentUser: user });
      },
    }),
    {
      name: 'time-capsule-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
