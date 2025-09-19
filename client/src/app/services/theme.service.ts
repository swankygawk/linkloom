import {
  DOCUMENT,
  Inject,
  Injectable,
  signal,
  WritableSignal
} from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public preference: WritableSignal<ThemePreference>;
  private readonly themePreferenceLocalStorageKey = 'linkloom-theme-preference';

  constructor(@Inject(DOCUMENT) private document: Document) {
    const storedPreference = this.getInitialPreference();
    this.preference = signal(storedPreference);
    this.applyTheme(this.preference());
  }

  public setPreference(preference: ThemePreference): void {
    this.preference.set(preference);
    localStorage.setItem('linkloom-theme-preference', this.preference());
    this.applyTheme(this.preference());
  }

  private getInitialPreference(): ThemePreference {
    return (localStorage.getItem(this.themePreferenceLocalStorageKey) as ThemePreference) || 'system';
  }

  private applyTheme(theme: ThemePreference): void {
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
