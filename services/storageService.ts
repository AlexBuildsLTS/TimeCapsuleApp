import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebaseConfig';
import { EncryptionService } from './encryptionService';

/**
 * Uploads a media file to Firebase Storage after encrypting it, and returns the download URL.
 * @param uri Local URI of the media file.
 * @param type Type of media: 'photo', 'video', or 'audio'.
 * @param encryptionKey The encryption key to use.
 * @returns Download URL string.
 */
export async function uploadMediaToStorage(
  uri: string,
  type: 'photo' | 'video' | 'audio',
  encryptionKey: string
): Promise<string> {
  try {
    // Fetch the file as blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Encrypt the blob
    const encryptedBlob = await EncryptionService.encryptBlob(blob, encryptionKey);

    // Generate a unique filename with timestamp and type
    const timestamp = Date.now();
    const extension = 'enc'; // Encrypted files get .enc extension
    const fileName = `${type}s/${timestamp}.${extension}`;

    // Create a storage reference
    const storageRef = ref(storage, fileName);

    // Upload the encrypted blob
    const snapshot = await uploadBytes(storageRef, encryptedBlob);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading media to storage:', error);
    throw error;
  }
}

/**
 * Downloads and decrypts a media file from Firebase Storage.
 * @param downloadURL The download URL of the encrypted file.
 * @param encryptionKey The encryption key to use for decryption.
 * @returns Decrypted blob.
 */
export async function downloadAndDecryptMedia(
  downloadURL: string,
  encryptionKey: string
): Promise<Blob> {
  try {
    const response = await fetch(downloadURL);
    const encryptedBlob = await response.blob();
    const decryptedBlob = await EncryptionService.decryptBlob(encryptedBlob, encryptionKey);
    return decryptedBlob;
  } catch (error) {
    console.error('Error downloading and decrypting media:', error);
    throw error;
  }
}
