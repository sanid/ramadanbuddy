import React, { createContext, useContext, useState, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  completedDays: string[]; // ISO date strings
}

interface AppState {
  habits: Habit[];
  prayerCompletion: { [date: string]: { [prayer: string]: boolean } };
  quranProgress: {
    lastSurah: number;
    lastAyah: number;
    completedPages: number;
    totalPages: number;
  };
  settings: {
    location: { city: string; country: string; lat?: number; lng?: number };
    theme: 'light' | 'dark';
    language: string;
  };
}

interface AppContextType extends AppState {
  toggleHabit: (habitId: string, date: string) => void;
  addHabit: (habit: Omit<Habit, 'completedDays'>) => void;
  togglePrayer: (date: string, prayerName: string) => void;
  updateQuranProgress: (surah: number, ayah: number, pages: number) => void;
  setSettings: (settings: AppState['settings']) => void;
}

const defaultHabits: Habit[] = [
  { id: 'fasting', name: 'Fasting Today', icon: 'restaurant_menu', color: 'primary', completedDays: [] },
  { id: 'taraweeh', name: 'Taraweeh', icon: 'nights_stay', color: 'accent-gold', completedDays: [] },
  { id: 'dhikr', name: 'Read Dhikr', icon: 'auto_awesome', color: 'orange-500', description: '100x SubhanAllah', completedDays: [] },
  { id: 'sadaqah', name: 'Give Sadaqah', icon: 'volunteer_activism', color: 'blue-500', description: 'Daily small donation', completedDays: [] },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('ramadan_buddy_state');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      habits: defaultHabits,
      prayerCompletion: {},
      quranProgress: {
        lastSurah: 1,
        lastAyah: 1,
        completedPages: 0,
        totalPages: 604,
      },
      settings: {
        location: { city: 'Dubai', country: 'United Arab Emirates' },
        theme: 'dark',
        language: 'en',
      },
    };
  });

  useEffect(() => {
    localStorage.setItem('ramadan_buddy_state', JSON.stringify(state));
    if (state.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const toggleHabit = (habitId: string, date: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id === habitId) {
          const completedDays = h.completedDays.includes(date)
            ? h.completedDays.filter(d => d !== date)
            : [...h.completedDays, date];
          return { ...h, completedDays };
        }
        return h;
      }),
    }));
  };

  const addHabit = (habit: Omit<Habit, 'completedDays'>) => {
    setState(prev => ({
      ...prev,
      habits: [...prev.habits, { ...habit, completedDays: [] }],
    }));
  };

  const togglePrayer = (date: string, prayerName: string) => {
    setState(prev => {
      const dayPrayers = prev.prayerCompletion[date] || {};
      return {
        ...prev,
        prayerCompletion: {
          ...prev.prayerCompletion,
          [date]: {
            ...dayPrayers,
            [prayerName]: !dayPrayers[prayerName],
          },
        },
      };
    });
  };

  const updateQuranProgress = (surah: number, ayah: number, pages: number) => {
    setState(prev => ({
      ...prev,
      quranProgress: {
        ...prev.quranProgress,
        lastSurah: surah,
        lastAyah: ayah,
        completedPages: pages,
      },
    }));
  };

  const setSettings = (settings: AppState['settings']) => {
    setState(prev => ({ ...prev, settings }));
  };

  return (
    <AppContext.Provider value={{ ...state, toggleHabit, addHabit, togglePrayer, updateQuranProgress, setSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
