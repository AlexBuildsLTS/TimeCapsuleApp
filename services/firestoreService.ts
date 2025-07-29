import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '@/config/firebaseConfig';
import { Capsule } from '@/types';
import { EncryptionService } from './encryptionService';

export class FirestoreService {
  private static CAPSULES_COLLECTION = 'capsules';

  // Create a new capsule with encryption
  static async createCapsule(
    capsuleData: Omit<
      Capsule,
      'id' | 'createdAt' | 'userId' | 'isSealed' | 'isUnlocked'
    >
  ): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    try {
      // 1. Generate a unique encryption key for this capsule
      const encryptionKey = await EncryptionService.generateEncryptionKey();

      // 2. Encrypt sensitive text data
      const encryptedTitle = EncryptionService.encryptData(
        capsuleData.title,
        encryptionKey
      );
      const encryptedDescription = capsuleData.description
        ? EncryptionService.encryptData(capsuleData.description, encryptionKey)
        : '';

      // 3. (Future Step) Encrypt media files before upload. For now, we upload them directly.
      const uploadedMedia = await Promise.all(
        capsuleData.media.map(async (item) => {
          if (item.type === 'text') {
            // Encrypt text note content
            return {
              ...item,
              content: EncryptionService.encryptData(
                item.content,
                encryptionKey
              ),
            };
          }
          // Handle file uploads
          const response = await fetch(item.content);
          const blob = await response.blob();
          const fileExtension =
            item.content.split('.').pop()?.split('?')[0] || 'dat';
          const fileName = `${currentUser.uid}/${Date.now()}.${fileExtension}`;
          const storageRef = ref(storage, fileName);
          const snapshot = await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(snapshot.ref);
          return { ...item, content: downloadURL };
        })
      );

      // 4. Create the document to be saved in Firestore
      const capsuleDoc = {
        userId: currentUser.uid,
        title: encryptedTitle,
        description: encryptedDescription,
        createdAt: Timestamp.now(),
        unlockDate: Timestamp.fromMillis(capsuleData.unlockDate),
        isSealed: true,
        isUnlocked: false,
        media: uploadedMedia,
        location: capsuleData.location,
        encryptionKey: encryptionKey, // Store the key with the capsule
      };

      const docRef = await addDoc(
        collection(db, this.CAPSULES_COLLECTION),
        capsuleDoc
      );
      return docRef.id;
    } catch (error) {
      console.error('Error creating capsule:', error);
      throw new Error('Failed to create capsule');
    }
  }

  // Other functions (subscribe, delete, etc.) will be updated later to handle decryption.
  static subscribeToUserCapsules(
    userId: string,
    callback: (capsules: Capsule[]) => void
  ): () => void {
    const q = query(
      collection(db, this.CAPSULES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const capsules = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        const capsule = {
          id: docSnapshot.id,
          ...data,
          createdAt: (data.createdAt as Timestamp).toMillis(),
          unlockDate: (data.unlockDate as Timestamp).toMillis(),
        } as Capsule;

        // Decrypt data if it's ready to unlock
        if (capsule.unlockDate <= Date.now() && capsule.encryptionKey) {
          try {
            capsule.title = EncryptionService.decryptData(
              capsule.title,
              capsule.encryptionKey
            );
            if (capsule.description) {
              capsule.description = EncryptionService.decryptData(
                capsule.description,
                capsule.encryptionKey
              );
            }
            capsule.media = capsule.media.map((item) => {
              if (item.type === 'text') {
                return {
                  ...item,
                  content: EncryptionService.decryptData(
                    item.content,
                    capsule.encryptionKey!
                  ),
                };
              }
              return item;
            });
          } catch (e) {
            console.error(`Failed to decrypt capsule ${capsule.id}:`, e);
            capsule.title = '🔒 Decryption Error';
          }
        } else if (capsule.isSealed && !capsule.isUnlocked) {
          capsule.title = '🔒 Sealed Capsule';
          capsule.description = 'This capsule is sealed until its unlock date.';
        }

        return capsule;
      });
      callback(capsules);
    });
  }

  static async unlockCapsule(capsuleId: string): Promise<void> {
    const capsuleRef = doc(db, this.CAPSULES_COLLECTION, capsuleId);
    await updateDoc(capsuleRef, { isUnlocked: true });
  }

  static async deleteCapsule(capsuleId: string): Promise<void> {
    const capsuleRef = doc(db, this.CAPSULES_COLLECTION, capsuleId);
    await deleteDoc(capsuleRef);
  }
}
