/** The app's icon vocabulary - rounded, heavy stroke, generous curves. */
export type IconName =
  | 'drop'
  | 'moon'
  | 'sprout'
  | 'sun'
  | 'heart'
  | 'shield'
  | 'chart'
  | 'calendar'
  | 'note'
  | 'bell'
  | 'lock'
  | 'share'
  | 'people'
  | 'book';

export const ICON_PATHS: Record<IconName, string> = {
  drop: '<path d="M12 3.2c3.1 3.3 5.4 6.2 5.4 9A5.4 5.4 0 0 1 12 17.6 5.4 5.4 0 0 1 6.6 12.2c0-2.8 2.3-5.7 5.4-9Z"/><path d="M14.2 13.1a2.3 2.3 0 0 1-2.4 2"/>',
  moon: '<path d="M19.3 14.6A7.6 7.6 0 0 1 9.4 4.7a7.9 7.9 0 1 0 9.9 9.9Z"/><path d="M17.5 3.2l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z"/>',
  sprout: '<path d="M12 20v-7"/><path d="M12 13c0-3-2-5-5-5 0 3 2 5 5 5Z"/><path d="M12 13c0-3 2-5 5-5 0 3-2 5-5 5Z"/><path d="M8.5 20h7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.6v2M12 19.4v2M21.4 12h-2M4.6 12h-2M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4M18.6 18.6l-1.4-1.4M6.8 6.8 5.4 5.4"/>',
  heart: '<path d="M12 20s-7.2-4.5-7.2-9.4A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.2 2.4C19.2 15.5 12 20 12 20Z"/>',
  shield: '<path d="M12 3.2 19.4 6v6.1c0 4.6-3.2 7.5-7.4 8.7-4.2-1.2-7.4-4.1-7.4-8.7V6Z"/><path d="M9.2 12.3 11.3 14.4 15 10.2"/>',
  chart: '<path d="M4 19.6V11M10 19.6V5M16 19.6v-6M21.4 19.6H2.6"/>',
  calendar: '<rect x="3.4" y="5.4" width="17.2" height="15.2" rx="4"/><path d="M8 3.2v4M16 3.2v4M3.4 10.6h17.2"/>',
  note: '<path d="M14.4 3.4H7a3 3 0 0 0-3 3v11.2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9Z"/><path d="M14.4 3.4V9H20M8.6 13.4h6.8M8.6 17h4.4"/>',
  bell: '<path d="M18.4 16.4V11a6.4 6.4 0 1 0-12.8 0v5.4L3.4 19.6h17.2Z"/><path d="M9.8 19.6a2.2 2.2 0 0 0 4.4 0"/>',
  lock: '<rect x="4.4" y="10.4" width="15.2" height="10.2" rx="4"/><path d="M8.2 10.4V7.8a3.8 3.8 0 1 1 7.6 0v2.6"/>',
  share: '<path d="M12 3.4v12"/><path d="M8 7.4 12 3.4l4 4"/><path d="M5 13.4v4.2a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4.2"/>',
  people: '<circle cx="9" cy="8.4" r="3.4"/><path d="M3.4 20.6c0-3.1 2.5-5.6 5.6-5.6s5.6 2.5 5.6 5.6"/><path d="M16 5.4a3.4 3.4 0 0 1 0 6.6M17.4 15.4c1.9.7 3.2 2.5 3.2 4.6"/>',
  book: '<path d="M4 5.4A2.4 2.4 0 0 1 6.4 3H20v15.6H6.4A2.4 2.4 0 0 0 4 21Z"/><path d="M4 18.6A2.4 2.4 0 0 1 6.4 16.2H20"/>',
};
