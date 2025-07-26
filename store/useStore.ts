import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Capsule, MediaItem } from '../types';
import { auth } from '@/config/firebaseConfig';

interface StoreActions {
  addCapsule: (capsule: Omit<Capsule, 'id' | 'createdAt' | 'userId'>) => void;
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

      addCapsule: (capsule) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error('No user is signed in to create a capsule.');
          return;
        }

        const newCapsule: Capsule = {
          ...capsule,
          id: Date.now().toString(),
          createdAt: Date.now(),
          userId: currentUser.uid,
        };

        set((state) => ({
          capsules: [...state.capsules, newCapsule],
        }));
      },

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
