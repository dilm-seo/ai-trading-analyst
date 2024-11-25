import create from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  apiKey: string;
  model: string;
  language: string;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      apiKey: '',
      model: 'gpt-4-turbo-preview',
      language: 'en',
      setApiKey: (key) => set({ apiKey: key }),
      setModel: (model) => set({ model }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'trading-analyst-settings',
    }
  )
);