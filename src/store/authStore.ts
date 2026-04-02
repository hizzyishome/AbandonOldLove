// src/store/authStore.ts
import { create } from 'zustand';
import { encryptToken, decryptToken } from '@/utils/crypto';
import { initializeClient } from '@/graphql/client';
import { VIEWER_QUERY } from '@/graphql/queries';

export interface UserProfile {
  login: string;
  avatarUrl: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  hasEncryptedToken: boolean;
  
  // Actions
  checkExistingToken: () => void;
  loginWithPassword: (password: string) => Promise<boolean>;
  loginNew: (token: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const STORAGE_KEY = 'abandon_old_love_secure_token';

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  userProfile: null,
  isLoading: false,
  error: null,
  hasEncryptedToken: !!localStorage.getItem(STORAGE_KEY),

  checkExistingToken: () => {
    set({ hasEncryptedToken: !!localStorage.getItem(STORAGE_KEY) });
  },

  loginWithPassword: async (password: string) => {
    set({ isLoading: true, error: null });
    try {
      const encryptedBase64 = localStorage.getItem(STORAGE_KEY);
      if (!encryptedBase64) throw new Error("No token found");

      const rawToken = await decryptToken(encryptedBase64, password);
      
      // Probe GitHub Graphic API to verify token
      const client = initializeClient(rawToken);
      const data: any = await client.request(VIEWER_QUERY);
      
      if (data && data.viewer) {
        set({
          token: rawToken,
          isAuthenticated: true,
          userProfile: data.viewer,
          isLoading: false
        });
        return true;
      }
      throw new Error("Invalid response from GitHub");
    } catch (e: any) {
      set({ isLoading: false, error: e.message || "Failed to decrypt or authenticate" });
      return false;
    }
  },

  loginNew: async (token: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // First verify the token online
      const client = initializeClient(token);
      const data: any = await client.request(VIEWER_QUERY);

      if (data && data.viewer) {
        // Encrpyt and Save token
        const encrypted = await encryptToken(token, password);
        localStorage.setItem(STORAGE_KEY, encrypted);

        set({
          token,
          isAuthenticated: true,
          userProfile: data.viewer,
          isLoading: false,
          hasEncryptedToken: true
        });
        return true;
      }
      throw new Error("Invalid response from GitHub");
    } catch (e: any) {
      set({ isLoading: false, error: e.message || "Failed to verify token via GitHub API" });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      token: null,
      isAuthenticated: false,
      userProfile: null,
      hasEncryptedToken: false,
      error: null
    });
  }
}));
