import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';

// Helper to convert Uint8Array to WordArray for CryptoJS
function uint8ArrayToWordArray(u8a: Uint8Array) {
  const words = [];
  for (let i = 0; i < u8a.length; i += 4) {
    words.push(
      (u8a[i] << 24) | (u8a[i + 1] << 16) | (u8a[i + 2] << 8) | u8a[i + 3]
    );
  }
  return CryptoJS.lib.WordArray.create(words, u8a.length);
}

// Helper to convert WordArray to Uint8Array
function wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray) {
  const words = wordArray.hasOwnProperty('words') ? wordArray.words : [];
  const sigBytes = wordArray.hasOwnProperty('sigBytes') ? wordArray.sigBytes : words.length * 4;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    const byte = (words[i] >>> (24 - (i % 4) * 8)) & 0xff;
    u8[i] = byte;
  }
  return u8;
}

export class EncryptionService {
  /**
   * Generates a cryptographically secure 256-bit (32-byte) random key.
   * @returns {Promise<string>} A hex-encoded representation of the key.
   */
  static async generateEncryptionKey(): Promise<string> {
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    return uint8ArrayToWordArray(randomBytes).toString(CryptoJS.enc.Hex);
  }

  /**
   * Encrypts data using AES-256-CBC.
   * @param {string} data The plaintext data to encrypt.
   * @param {string} keyHex The hex-encoded encryption key.
   * @returns {string} The base64-encoded encrypted data.
   */
  static encryptData(data: string, keyHex: string): string {
    try {
      const key = CryptoJS.enc.Hex.parse(keyHex);
      // For robust security, we generate a random Initialization Vector (IV) for each encryption
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      // Prepend the IV to the ciphertext for use during decryption
      return iv.toString(CryptoJS.enc.Hex) + encrypted.toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts data using AES-256-CBC.
   * @param {string} encryptedData The combined IV and base64-encoded ciphertext.
   * @param {string} keyHex The hex-encoded encryption key.
   * @returns {string} The decrypted plaintext data.
   */
  static decryptData(encryptedData: string, keyHex: string): string {
    try {
      const key = CryptoJS.enc.Hex.parse(keyHex);
      // Extract the IV from the beginning of the encrypted data
      const iv = CryptoJS.enc.Hex.parse(encryptedData.substring(0, 32));
      const ciphertext = encryptedData.substring(32);

      const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
        throw new Error('Decryption resulted in empty string. Check the key.');
      }
      return decryptedText;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error(
        'Failed to decrypt data. The key may be incorrect or the data corrupted.'
      );
    }
  }

  /**
   * Encrypts a Blob using AES-256-CBC.
   * @param {Blob} blob The blob to encrypt.
   * @param {string} keyHex The hex-encoded encryption key.
   * @returns {Promise<Blob>} The encrypted blob.
   */
  static async encryptBlob(blob: Blob, keyHex: string): Promise<Blob> {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const wordArray = uint8ArrayToWordArray(uint8Array);

      const key = CryptoJS.enc.Hex.parse(keyHex);
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Prepend IV to encrypted data
      const ivAndEncrypted = iv.toString(CryptoJS.enc.Hex) + encrypted.toString();
      const encryptedWordArray = CryptoJS.enc.Hex.parse(ivAndEncrypted);
      const encryptedUint8Array = wordArrayToUint8Array(encryptedWordArray);

      return new Blob([encryptedUint8Array]);
    } catch (error) {
      console.error('Blob encryption failed:', error);
      throw new Error('Failed to encrypt blob');
    }
  }

  /**
   * Decrypts a Blob using AES-256-CBC.
   * @param {Blob} encryptedBlob The encrypted blob.
   * @param {string} keyHex The hex-encoded encryption key.
   * @returns {Promise<Blob>} The decrypted blob.
   */
  static async decryptBlob(encryptedBlob: Blob, keyHex: string): Promise<Blob> {
    try {
      const arrayBuffer = await encryptedBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const encryptedHex = CryptoJS.enc.Hex.stringify(uint8ArrayToWordArray(uint8Array));

      const key = CryptoJS.enc.Hex.parse(keyHex);
      // Extract the IV from the beginning of the encrypted data
      const iv = CryptoJS.enc.Hex.parse(encryptedHex.substring(0, 32));
      const ciphertext = encryptedHex.substring(32);

      const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedUint8Array = wordArrayToUint8Array(decrypted);
      return new Blob([decryptedUint8Array]);
    } catch (error) {
      console.error('Blob decryption failed:', error);
      throw new Error('Failed to decrypt blob');
    }
  }
}
