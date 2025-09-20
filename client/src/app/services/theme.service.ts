import {
  DOCUMENT,
  Inject,
  Injectable,
  signal,
  WritableSignal
} from '@angular/core';

export interface Theme {
  translationKey: string;
  propertyValue: string;
}

export const themePreferences: Theme[] = [
  { translationKey: 'SETTINGS_THEME_LIGHT', propertyValue: 'light' },
  { translationKey: 'SETTINGS_THEME_DARK', propertyValue: 'dark' },
  { translationKey: 'SETTINGS_THEME_SYSTEM', propertyValue: 'light dark' },
];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public themePreference: WritableSignal<string>;

  private readonly themePreferenceLocalStorageKey = 'linkloom-theme-preference';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.themePreference = signal(this.getInitialPreference());
    this.applyTheme(this.themePreference());
  }

  public setPreference(preference: string): void {
    this.themePreference.set(preference);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.themePreferenceLocalStorageKey, preference);
    }
    this.applyTheme(preference);
  }

  private getInitialPreference(): string {
    const defaultTheme = 'light dark';

    if (typeof localStorage === 'undefined') {
      return defaultTheme;
    }

    const storedPreference = localStorage.getItem(this.themePreferenceLocalStorageKey) || defaultTheme;
    if (!themePreferences.some(
      (theme) => theme.propertyValue === storedPreference
    )) {
      return defaultTheme;
    }

    return storedPreference;
  }

  private applyTheme(theme: string): void {
    this.document.documentElement.style.setProperty('color-scheme', theme);
  }
}
