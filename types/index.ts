export interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'text';
  content: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface Capsule {
  id: string;
  userId: string; // <-- **THIS FIXES THE ERROR**
  title: string;
  description?: string;
  createdAt: number;
  unlockDate: number;
  isSealed: boolean;
  isUnlocked: boolean;
  media: MediaItem[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  encryptionKey?: string;
}

export interface AppState {
  capsules: Capsule[];
  currentUser: {
    id: string;
    name: string;
    email: string;
  } | null;
}
