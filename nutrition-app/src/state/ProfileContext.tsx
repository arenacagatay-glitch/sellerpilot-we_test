import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Profile } from '../types';
import { store } from '../lib/storage';

interface ProfileContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  loading: boolean;
  reload: () => Promise<void>;
  selectProfile: (id: string) => Promise<void>;
  clearActive: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [list, active] = await Promise.all([store.listProfiles(), store.getActiveProfileId()]);
    setProfiles(list);
    // Aktif profil silinmişse temizle
    const validActive = active && list.some((p) => p.id === active) ? active : null;
    if (validActive !== active) await store.setActiveProfileId(validActive);
    setActiveId(validActive);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const selectProfile = useCallback(async (id: string) => {
    await store.setActiveProfileId(id);
    setActiveId(id);
  }, []);

  const clearActive = useCallback(async () => {
    await store.setActiveProfileId(null);
    setActiveId(null);
  }, []);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeId) ?? null,
    [profiles, activeId],
  );

  const value = useMemo(
    () => ({ profiles, activeProfile, loading, reload, selectProfile, clearActive }),
    [profiles, activeProfile, loading, reload, selectProfile, clearActive],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfiles(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfiles must be used within ProfileProvider');
  return ctx;
}
