import { create } from 'zustand';
import { getClient } from '@/graphql/client';
import { GET_STARRED_REPOSITORIES } from '@/graphql/queries';

export interface Repository {
  id: string;
  name: string;
  url: string;
  pushedAt: string;
  updatedAt: string;
  stargazerCount: number;
  description: string;
  owner: {
    login: string;
  };
}

interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface UnstarProgress {
  total: number;
  completed: number;
  currentRepo: string;
}

interface StarsState {
  stars: Repository[];
  pageInfo: PageInfo;
  isLoading: boolean;
  isFetchingMore: boolean;
  totalFetched: number;
  totalStars: number | null;
  error: string | null;
  pendingUnstars: string[];
  unstarProgress: UnstarProgress | null;

  fetchInitialStars: () => Promise<void>;
  fetchMoreStars: () => Promise<void>;
  reset: () => void;
  removeStar: (id: string) => void;
  unstarRepo: (id: string) => Promise<boolean>;
  batchUnstar: (repos: { id: string; name: string }[]) => Promise<void>;
}

export const useStarsStore = create<StarsState>((set, get) => ({
  stars: [],
  pageInfo: { endCursor: null, hasNextPage: true },
  isLoading: false,
  isFetchingMore: false,
  totalFetched: 0,
  totalStars: null,
  error: null,
  pendingUnstars: [],
  unstarProgress: null,

  fetchInitialStars: async () => {
    set({ isLoading: true, error: null });
    try {
      const client = getClient();
      const data: any = await client.request(GET_STARRED_REPOSITORIES, { cursor: null });
      const starredData = data.viewer.starredRepositories;
      
      set({
        stars: starredData.nodes,
        pageInfo: starredData.pageInfo,
        totalFetched: starredData.nodes.length,
        totalStars: starredData.totalCount,
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch stars', isLoading: false });
    }
  },

  fetchMoreStars: async () => {
    const { pageInfo, isFetchingMore } = get();
    if (!pageInfo.hasNextPage || isFetchingMore) return;

    set({ isFetchingMore: true, error: null });
    try {
      const client = getClient();
      const data: any = await client.request(GET_STARRED_REPOSITORIES, { cursor: pageInfo.endCursor });
      const starredData = data.viewer.starredRepositories;
      
      set((state) => ({
        stars: [...state.stars, ...starredData.nodes],
        pageInfo: starredData.pageInfo,
        totalFetched: state.totalFetched + starredData.nodes.length,
        isFetchingMore: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch more stars', isFetchingMore: false });
    }
  },

  reset: () => {
    set({
      stars: [],
      pageInfo: { endCursor: null, hasNextPage: true },
      totalFetched: 0,
      totalStars: null,
      isLoading: false,
      isFetchingMore: false,
      error: null,
      pendingUnstars: []
    });
  },

  removeStar: (id: string) => {
    set((state) => ({
      stars: state.stars.filter(star => star.id !== id),
      totalFetched: Math.max(0, state.totalFetched - 1),
      totalStars: state.totalStars !== null ? Math.max(0, state.totalStars - 1) : null
    }));
  },

  unstarRepo: async (id: string) => {
    const { removeStar } = get();
    set(state => ({ pendingUnstars: [...state.pendingUnstars, id] }));

    try {
      const { unstarQueue } = await import('@/utils/async-queue');
      const { REMOVE_STAR_MUTATION } = await import('@/graphql/mutations');
      const client = getClient();

      await unstarQueue.enqueue(async () => {
        await client.request(REMOVE_STAR_MUTATION, { starrableId: id });
      });

      removeStar(id);
      return true;
    } catch (e: any) {
      console.error("Failed to unstar:", e);
      let errorMsg = e.message || JSON.stringify(e);
      if (typeof e.response?.errors !== 'undefined') {
        errorMsg = e.response.errors.map((err: any) => err.message).join(', ');
      }
      alert(`[Debug] Unstar Failed:\n${errorMsg}\n\nMake sure your PAT has "repo" or "public_repo" scope. Classic PAT is strictly recommended.`);
      return false;
    } finally {
      set(state => ({
        pendingUnstars: state.pendingUnstars.filter(pendingId => pendingId !== id)
      }));
    }
  },

  batchUnstar: async (repos) => {
    if (repos.length === 0) return;
    set({ unstarProgress: { total: repos.length, completed: 0, currentRepo: '' } });

    const promises = repos.map(async (repo) => {
      set(state => ({
        unstarProgress: state.unstarProgress ? { ...state.unstarProgress, currentRepo: repo.name } : null
      }));
      await get().unstarRepo(repo.id);
      set(state => ({
        unstarProgress: state.unstarProgress ? { ...state.unstarProgress, completed: state.unstarProgress.completed + 1 } : null
      }));
    });

    await Promise.all(promises);

    setTimeout(() => {
      set({ unstarProgress: null });
    }, 1500);
  }
}));
