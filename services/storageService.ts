import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebaseConfig';

/**
 * Uploads a media file to Firebase Storage and returns the download URL.
 * @param uri Local URI of the media file.
 * @param type Type of media: 'photo', 'video', or 'audio'.
 * @returns Download URL string.
 */
export async function uploadMediaToStorage(
  uri: string,
  type: 'photo' | 'video' | 'audio'
): Promise<string> {
  try {
    // Fetch the file as blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Generate a unique filename with timestamp and type
    const timestamp = Date.now();
    const extension = uri.split('.').pop()?.split('?')[0] || 'dat';
    const fileName = `${type}s/${timestamp}.${extension}`;

    // Create a storage reference
    const storageRef = ref(storage, fileName);

    // Upload the blob
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading media to storage:', error);
    throw error;
  }
}
