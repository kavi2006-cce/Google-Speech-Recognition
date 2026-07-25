export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface Recording {
  id: number;
  user_id: number;
  title: string;
  transcript: string;
  language: string;
  language_name: string;
  confidence: number;
  duration_seconds: number;
  word_count: number;
  wpm: number;
  filler_words_count: number;
  emotion: string;
  is_favorite: boolean;
  audio_path?: string;
  created_at: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface SpeechProcessResult {
  transcript: string;
  confidence: number;
  duration_seconds: number;
  word_count: number;
  wpm: number;
  filler_words_count: number;
  detected_fillers: string[];
  emotion: string;
  language: string;
}

export interface AnalyticsSummary {
  total_recordings: number;
  today_recordings: number;
  total_words: number;
  avg_accuracy: number;
  languages_used_count: number;
  total_recording_time_minutes: number;
  avg_wpm: number;
  top_filler_words: { word: string; count: number }[];
  language_distribution: { language: string; count: number }[];
  daily_usage: { day: string; recordings: number; words: number }[];
}

export interface UserSettings {
  theme: 'dark' | 'light';
  default_language: string;
  auto_save: boolean;
  auto_download: boolean;
  noise_reduction: boolean;
  voice_commands_enabled: boolean;
  recognition_speed: 'slow' | 'normal' | 'fast';
}

export type ExportFormat = 'txt' | 'pdf' | 'docx' | 'csv' | 'json' | 'srt' | 'vtt';
