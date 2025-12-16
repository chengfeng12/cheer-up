export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO date string YYYY-MM-DD
}

export interface CheckIn {
  id?: string; // Optional id from server
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

export interface UserInfo {
  profile: UserProfile;
  settings: UserSettings;
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    totalCheckIns: number;
  };
}

export interface UserInfo {
  profile: UserProfile;
  settings: UserSettings;
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    totalCheckIns: number;
  };
}
