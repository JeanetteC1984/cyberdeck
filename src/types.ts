export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  stickers: string[];
  cardColor: string;
}

export type Theme = 'bubblegum' | 'rose-gold' | 'lavender' | 'peach' | 'midnight';

export interface ThemeOption {
  id: Theme;
  name: string;
  emoji: string;
  primaryColor: string;
  bgColor: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'bubblegum', name: 'Bubblegum', emoji: '🩷', primaryColor: '#ff69b4', bgColor: '#fff0f8' },
  { id: 'rose-gold', name: 'Rose Gold', emoji: '🌹', primaryColor: '#c0756e', bgColor: '#fff9f7' },
  { id: 'lavender', name: 'Lavender', emoji: '💜', primaryColor: '#9b59b6', bgColor: '#f9f0ff' },
  { id: 'peach', name: 'Peach', emoji: '🍑', primaryColor: '#e8824a', bgColor: '#fff7f2' },
  { id: 'midnight', name: 'Midnight', emoji: '🌙', primaryColor: '#ff69b4', bgColor: '#1a0828' },
];

export const MOODS = [
  { emoji: '🥰', label: 'Loved' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😴', label: 'Tired' },
];

export const CARD_COLORS = [
  '#ffe4e6',
  '#fce7f3',
  '#ede9fe',
  '#dbeafe',
  '#d1fae5',
  '#fef3c7',
  '#ffedd5',
  '#f0fdf4',
];

export const STICKER_CATEGORIES: Record<string, string[]> = {
  '🩷 Hearts': ['💗', '💖', '💝', '💘', '💓', '💞', '💕', '❤️', '🤍', '🩶'],
  '⭐ Stars': ['⭐', '🌟', '✨', '💫', '🌠', '⚡', '🌙', '☀️'],
  '🌸 Flowers': ['🌸', '🌺', '🌷', '🌻', '🌼', '💐', '🌹', '🏵️'],
  '🦋 Fun': ['🎀', '👑', '💎', '🦋', '🌈', '🎉', '🎊', '🦄'],
  '🧁 Treats': ['🧁', '🍰', '🍩', '☕', '🍵', '🍓', '🍒', '🍫'],
  '💅 Vibes': ['💅', '💄', '👗', '🛁', '🧸', '📚', '🎨', '💃'],
};
