import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { LeetCodeProfile } from '../types';

export function useLeetCodeProfile() {
  const queryClient = useQueryClient();

  // Query to fetch the synced profile data
  const profileQuery = useQuery({
    queryKey: ['leetcodeProfile'],
    queryFn: async () => {
      const { data } = await api.get('/leetcode/profile');
      if (data.success) {
        return {
          connected: data.connected,
          profile: data.profile as LeetCodeProfile | null
        };
      }
      throw new Error(data.message || 'Failed to fetch LeetCode profile');
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  // Mutation to trigger a sync
  const syncMutation = useMutation({
    mutationFn: async (opts?: { leetcodeUsername?: string; force?: boolean }) => {
      const force = opts?.force ?? false;
      const body = opts?.leetcodeUsername ? { leetcodeUsername: opts.leetcodeUsername } : {};
      const { data } = await api.post(`/leetcode/sync?force=${force}`, body);
      if (data.success) {
        return data.profile as LeetCodeProfile;
      }
      throw new Error(data.message || 'Synchronization failed');
    },
    onSuccess: (newProfile) => {
      // Update cache
      queryClient.setQueryData(['leetcodeProfile'], {
        connected: true,
        profile: newProfile
      });
    }
  });

  return {
    profile: profileQuery.data?.profile || null,
    connected: profileQuery.data?.connected ?? false,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    
    sync: syncMutation.mutateAsync,
    isSyncing: syncMutation.isPending,
    syncError: syncMutation.error
  };
}
