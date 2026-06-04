export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  stickers: string[];
  cardColor: string;
}

export type Theme = 'grimoire' | 'moonlit' | 'forest' | 'ember' | 'amber';

export interface ThemeOption {
  id: Theme;
  name: string;
  emoji: string;
  primaryColor: string;
  bgColor: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'grimoire',  name: 'Grimoire',     emoji: '🔮', primaryColor: '#c9a227', bgColor: '#0f0a1a' },
  { id: 'moonlit',   name: 'Moonlit',      emoji: '🌙', primaryColor: '#8ab4d4', bgColor: '#06090f' },
  { id: 'forest',    name: 'Forest Witch', emoji: '🌿', primaryColor: '#6aab6a', bgColor: '#060e06' },
  { id: 'ember',     name: 'Ember',        emoji: '🕯️', primaryColor: '#d4622a', bgColor: '#0e0505' },
  { id: 'amber',     name: 'Amber Witch',  emoji: '✨', primaryColor: '#d4922a', bgColor: '#0c0a04' },
];

export const MOODS = [
  { emoji: '🌙', label: 'Mystical' },
  { emoji: '✨', label: 'Enchanted' },
  { emoji: '🔮', label: 'Prophetic' },
  { emoji: '🌿', label: 'Grounded' },
  { emoji: '🦉', label: 'Wise' },
  { emoji: '🕯️', label: 'Reflective' },
  { emoji: '🌑', label: 'Dark Moon' },
  { emoji: '🌀', label: 'Turbulent' },
];

export const CARD_COLORS = [
  '#1e1530', // deep plum
  '#14182e', // midnight indigo
  '#0f2018', // witch green
  '#221010', // ember crimson
  '#1e1808', // dark amber
  '#0a1e20', // dark teal
  '#1a1625', // shadow galaxy
  '#1e1420', // witch mauve
];

export const STICKER_CATEGORIES: Record<string, string[]> = {
  '🌙 Moon':      ['🌙', '🌛', '🌜', '🌚', '🌕', '✨', '💫', '⭐', '🌟', '🌠', '🌌', '🌃'],
  '🔮 Magic':     ['🔮', '🪄', '🧿', '🪬', '🗝️', '📜', '📿', '🏺', '⚗️', '🧪', '🃏', '🎴'],
  '🌿 Botanica':  ['🌿', '🍃', '🍄', '🌾', '🌱', '🌺', '🪷', '🥀', '🌻', '🌸', '🍀', '🌲'],
  '🦉 Familiars': ['🦉', '🐈‍⬛', '🦇', '🐍', '🕷️', '🦋', '🐺', '🐉', '🐸', '🦂', '🦔', '🦅'],
  '🕯️ Ritual':   ['🕯️', '💎', '🌀', '🌊', '🔥', '💨', '🪨', '🪶', '🌹', '🎭', '🔔', '🧲'],
  '🖤 Shadow':    ['🖤', '🌑', '🕸️', '🥀', '💔', '🩶', '🌫️', '⛈️', '🌪️', '💀', '🪦', '👁️'],
};
