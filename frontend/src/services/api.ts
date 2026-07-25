import { Recording, SpeechProcessResult, AnalyticsSummary, Language, UserSettings } from '../types';

const API_BASE = '/api';

export const api = {
  // Speech API
  async getLanguages(): Promise<Language[]> {
    try {
      const res = await fetch(`${API_BASE}/speech/languages`);
      if (!res.ok) throw new Error('Failed to fetch languages');
      const data = await res.json();
      return data.languages;
    } catch {
      // Fallback languages list if offline
      return [
        { code: "en-US", name: "English (United States)", flag: "🇺🇸" },
        { code: "en-IN", name: "English (India)", flag: "🇮🇳" },
        { code: "ta-IN", name: "Tamil (India)", flag: "🇮🇳" },
        { code: "hi-IN", name: "Hindi (India)", flag: "🇮🇳" },
        { code: "es-ES", name: "Spanish (Spain)", flag: "🇪🇸" },
        { code: "fr-FR", name: "French (France)", flag: "🇫🇷" },
        { code: "de-DE", name: "German (Germany)", flag: "🇩🇪" },
        { code: "ja-JP", name: "Japanese (Japan)", flag: "🇯🇵" },
        { code: "zh-CN", name: "Chinese (Mandarin)", flag: "🇨🇳" },
        { code: "ar-SA", "name": "Arabic (Saudi Arabia)", flag: "🇸🇦" },
      ];
    }
  },

  async processSpeech(audioBase64: string, language: string, title: string): Promise<SpeechProcessResult> {
    const formData = new FormData();
    formData.append('audio_base64', audioBase64);
    formData.append('language', language);
    formData.append('title', title);

    const res = await fetch(`${API_BASE}/speech/process`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Speech processing failed');
    return res.json();
  },

  // Recordings API
  async getRecordings(search?: string, language?: string, favoriteOnly?: boolean): Promise<Recording[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (language) params.append('language', language);
    if (favoriteOnly) params.append('favorite_only', 'true');

    const res = await fetch(`${API_BASE}/recordings?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch recordings');
    return res.json();
  },

  async deleteRecording(id: number): Promise<void> {
    await fetch(`${API_BASE}/recordings/${id}`, { method: 'DELETE' });
  },

  async toggleFavorite(id: number): Promise<{ is_favorite: boolean }> {
    const res = await fetch(`${API_BASE}/recordings/${id}/favorite`, { method: 'POST' });
    return res.json();
  },

  getExportUrl(id: number, format: string): string {
    return `${API_BASE}/recordings/${id}/export?format=${format}`;
  },

  // Analytics API
  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Admin API
  async getSystemHealth() {
    const res = await fetch(`${API_BASE}/admin/system-health`);
    return res.json();
  },

  async getAdminLogs() {
    const res = await fetch(`${API_BASE}/admin/logs`);
    return res.json();
  }
};
