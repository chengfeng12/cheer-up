export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO date string YYYY-MM-DD
}

export interface CheckIn {
  date: string; // ISO date string YYYY-MM-DD
  mood?: 'happy' | 'neutral' | 'sad';
  note?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  isGuest: boolean;
}
