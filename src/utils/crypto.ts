// src/utils/crypto.ts

/**
 * Derives a cryptographic key from a given password and salt using PBKDF2.
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Secure Context Required: Web Crypto API is unavailable. You must access this site via localhost, 127.0.0.1, or HTTPS.");
  }

  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a literal string (e.g. PAT) using AES-GCM and a user-provided password.
 * Returns a base64 encoded string containing the salt, iv, and the encrypted data.
 */
export async function encryptToken(token: string, password: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  
  const enc = new TextEncoder();
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(token)
  );

  // Combine salt, iv, and encryptedContent into a single Uint8Array
  const encryptedBytes = new Uint8Array(encryptedContent);
  const combined = new Uint8Array(salt.length + iv.length + encryptedBytes.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(encryptedBytes, salt.length + iv.length);

  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts the token using the stored base64 combined data and the user-provided password.
 * Throws an error if decryption fails (e.g. invalid password).
 */
export async function decryptToken(encryptedCombinedB64: string, password: string): Promise<string> {
  const combinedStr = atob(encryptedCombinedB64);
  const combined = new Uint8Array(combinedStr.length);
  for (let i = 0; i < combinedStr.length; i++) {
    combined[i] = combinedStr.charCodeAt(i);
  }

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const data = combined.slice(28);

  const key = await deriveKey(password, salt);

  try {
    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );
    const dec = new TextDecoder();
    return dec.decode(decryptedContent);
  } catch (e) {
    throw new Error("Decryption failed. Incorrect password or corrupted token data.");
  }
}
