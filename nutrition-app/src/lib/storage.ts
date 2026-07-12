import type { FoodLogEntry, Profile } from '../types';

/**
 * Veri katmanı soyutlaması.
 * Şu an localStorage ile çalışır; ileride aynı arayüzle Supabase'e geçilebilir
 * (tüm metotlar zaten Promise döndürüyor).
 */
export interface DataStore {
  listProfiles(): Promise<Profile[]>;
  getProfile(id: string): Promise<Profile | null>;
  saveProfile(profile: Profile): Promise<Profile>;
  deleteProfile(id: string): Promise<void>;

  getActiveProfileId(): Promise<string | null>;
  setActiveProfileId(id: string | null): Promise<void>;

  listLogs(profileId: string, date: string): Promise<FoodLogEntry[]>;
  addLog(entry: FoodLogEntry): Promise<FoodLogEntry>;
  deleteLog(id: string): Promise<void>;
}

const KEYS = {
  profiles: 'kk.profiles',
  activeProfile: 'kk.activeProfile',
  logs: 'kk.logs',
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

class LocalStore implements DataStore {
  async listProfiles(): Promise<Profile[]> {
    return readJSON<Profile[]>(KEYS.profiles, []);
  }

  async getProfile(id: string): Promise<Profile | null> {
    const all = await this.listProfiles();
    return all.find((p) => p.id === id) ?? null;
  }

  async saveProfile(profile: Profile): Promise<Profile> {
    const all = await this.listProfiles();
    const idx = all.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      all[idx] = profile;
    } else {
      all.push(profile);
    }
    writeJSON(KEYS.profiles, all);
    return profile;
  }

  async deleteProfile(id: string): Promise<void> {
    const all = (await this.listProfiles()).filter((p) => p.id !== id);
    writeJSON(KEYS.profiles, all);
    // İlgili kayıtları da temizle
    const logs = readJSON<FoodLogEntry[]>(KEYS.logs, []).filter((l) => l.profileId !== id);
    writeJSON(KEYS.logs, logs);
    const active = await this.getActiveProfileId();
    if (active === id) await this.setActiveProfileId(null);
  }

  async getActiveProfileId(): Promise<string | null> {
    return localStorage.getItem(KEYS.activeProfile);
  }

  async setActiveProfileId(id: string | null): Promise<void> {
    if (id) localStorage.setItem(KEYS.activeProfile, id);
    else localStorage.removeItem(KEYS.activeProfile);
  }

  async listLogs(profileId: string, date: string): Promise<FoodLogEntry[]> {
    return readJSON<FoodLogEntry[]>(KEYS.logs, [])
      .filter((l) => l.profileId === profileId && l.date === date)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async addLog(entry: FoodLogEntry): Promise<FoodLogEntry> {
    const all = readJSON<FoodLogEntry[]>(KEYS.logs, []);
    all.push(entry);
    writeJSON(KEYS.logs, all);
    return entry;
  }

  async deleteLog(id: string): Promise<void> {
    const all = readJSON<FoodLogEntry[]>(KEYS.logs, []).filter((l) => l.id !== id);
    writeJSON(KEYS.logs, all);
  }
}

// Tek örnek — ileride Supabase implementasyonuyla değiştirmek yeterli.
export const store: DataStore = new LocalStore();
