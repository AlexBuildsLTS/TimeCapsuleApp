import { create } from 'zustand';
import { AppState, Capsule, MediaItem } from '../types';

interface StoreActions {
  addCapsule: (capsule: Omit<Capsule, 'id' | 'createdAt'>) => void;
  updateCapsule: (id: string, updates: Partial<Capsule>) => void;
  deleteCapsule: (id: string) => void;
  unlockCapsule: (id: string) => void;
  addMediaToCurrentCapsule: (media: MediaItem) => void;
  getCurrentCapsule: () => Capsule | null;
  setCurrentUser: (user: AppState['currentUser']) => void;
}

interface Store extends AppState, StoreActions {
  currentCapsuleId: string | null;
}

export const useStore = create<Store>((set, get) => ({
  capsules: [
    // Sample data for demonstration
    {
      id: '1',
      title: 'My Future Self - 2025',
      description: 'A message to myself one year from now',
      createdAt: Date.now() - 172800000, // 2 days ago
      unlockDate: Date.now() + 86400000, // 1 day from now (for demo)
      isSealed: true,
      isUnlocked: false,
      media: [
        {
          id: 'text1',
          type: 'text',
          content: 'Dear future me, I hope you remember this moment...',
          timestamp: Date.now() - 172800000,
        }
      ],
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'New York, NY'
      }
    },
    {
      id: '2',
      title: 'Birthday Memories',
      description: 'Capturing this special day',
      createdAt: Date.now() - 172800000, // 2 days ago
      unlockDate: Date.now() + 604800000, // 7 days from now
      isSealed: true,
      isUnlocked: false,
      media: [],
    },
    {
      id: '3',
      title: 'Ready to Unlock!',
      description: 'This capsule is ready to be opened',
      createdAt: Date.now() - 259200000, // 3 days ago
      unlockDate: Date.now() - 3600000, // 1 hour ago (ready to unlock)
      isSealed: true,
      isUnlocked: false,
      media: [
        {
          id: 'text2',
          type: 'text',
          content: 'This is a test message from the past!',
          timestamp: Date.now() - 259200000,
        }
      ],
    }
  ],
  currentUser: {
    id: '1',
    name: 'Future Traveler',
    email: 'user@timecapsule.app'
  },
  currentCapsuleId: null,

  addCapsule: (capsule) => {
    const newCapsule: Capsule = {
      ...capsule,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    set((state) => ({
      capsules: [...state.capsules, newCapsule],
    }));
  },

  updateCapsule: (id, updates) => {
    set((state) => ({
      capsules: state.capsules.map((capsule) =>
        capsule.id === id ? { ...capsule, ...updates } : capsule
      ),
    }));
  },

  deleteCapsule: (id) => {
    set((state) => ({
      capsules: state.capsules.filter((capsule) => capsule.id !== id),
    }));
  },

  unlockCapsule: (id) => {
    set((state) => ({
      capsules: state.capsules.map((capsule) =>
        capsule.id === id ? { ...capsule, isUnlocked: true } : capsule
      ),
    }));
  },

  addMediaToCurrentCapsule: (media) => {
    const { currentCapsuleId } = get();
    if (currentCapsuleId) {
      get().updateCapsule(currentCapsuleId, {
        media: [...(get().capsules.find(c => c.id === currentCapsuleId)?.media || []), media]
      });
    }
  },

  getCurrentCapsule: () => {
    const { currentCapsuleId, capsules } = get();
    return currentCapsuleId ? capsules.find(c => c.id === currentCapsuleId) || null : null;
  },

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
}));