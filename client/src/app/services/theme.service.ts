import {
  DOCUMENT,
  Inject,
  Injectable,
  signal,
  WritableSignal
} from '@angular/core';

export const themePreferences: string[] = [
  'light',
  'dark',
  'system'
];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public themePreference: WritableSignal<string>;

  private readonly themePreferenceLocalStorageKey = 'linkloom-theme-preference';

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.themePreference = signal(this.getInitialPreference());
    this.applyTheme(this.themePreference());
  }

  public setPreference(preference: string): void {
    this.themePreference.set(preference);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.themePreferenceLocalStorageKey, this.themePreference());
    }
    this.applyTheme(this.themePreference());
  }

  private getInitialPreference(): string {
    if (typeof localStorage === 'undefined') {
      return 'system';
    }

    const storedPreference = localStorage.getItem(this.themePreferenceLocalStorageKey) || 'system';
    if (!themePreferences.includes(storedPreference)) {
      return 'system';
    }

    return storedPreference;
  }

  private applyTheme(theme: string): void {
    switch (theme) {
      case 'light':
        this.document.documentElement.style.setProperty('color-scheme', 'light');
        break;
      case 'dark':
        this.document.documentElement.style.setProperty('color-scheme', 'dark');
        break;
      case 'system':
      default:
        this.document.documentElement.style.setProperty('color-scheme', 'light dark');
        break;
    }
  }
}
