import {
  DOCUMENT,
  Inject,
  Injectable,
  signal,
  WritableSignal
} from '@angular/core';

export interface Palette {
  translationKey: string;
  className: string;
}

export const palettePreferences: Palette[] = [
  { translationKey: 'SETTINGS_PALETTE_RED', className: 'red' },
  { translationKey: 'SETTINGS_PALETTE_GREEN', className: 'green' },
  { translationKey: 'SETTINGS_PALETTE_BLUE', className: 'blue' },
  { translationKey: 'SETTINGS_PALETTE_YELLOW', className: 'yellow' },
  { translationKey: 'SETTINGS_PALETTE_CYAN', className: 'cyan' },
  { translationKey: 'SETTINGS_PALETTE_MAGENTA', className: 'magenta' },
  { translationKey: 'SETTINGS_PALETTE_ORANGE', className: 'orange' },
  { translationKey: 'SETTINGS_PALETTE_CHARTREUSE', className: 'chartreuse' },
  { translationKey: 'SETTINGS_PALETTE_SPRING_GREEN', className: 'spring-green' },
  { translationKey: 'SETTINGS_PALETTE_AZURE', className: 'azure' },
  { translationKey: 'SETTINGS_PALETTE_VIOLET', className: 'violet' },
  { translationKey: 'SETTINGS_PALETTE_ROSE', className: 'rose' },
];

@Injectable({
  providedIn: 'root'
})
export class PaletteService {
  public palettePreference: WritableSignal<string>;

  private readonly palettePreferenceLocalStorageKey = 'linkloom-palette-preference';
  private currentPaletteClass: string | null = null;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.palettePreference = signal(this.getInitialPreference());
    this.applyPalette(this.palettePreference());
  }

  public setPreference(preference: string): void {
    this.palettePreference.set(preference);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.palettePreferenceLocalStorageKey, preference);
    }
    this.applyPalette(preference);
  }

  private getInitialPreference(): string {
    const defaultPalette = 'azure';

    if (typeof localStorage === 'undefined') {
      return defaultPalette;
    }

    const storedPreference = localStorage.getItem(this.palettePreferenceLocalStorageKey) || defaultPalette;
    if (!palettePreferences.some(
      (palette) => palette.className === storedPreference
    )) {
      return defaultPalette;
    }

    return storedPreference;
  }

  private applyPalette(palettePreference: string): void {
    const newPaletteClass = `${palettePreference}-palette`;

    if (this.currentPaletteClass) {
      this.document.body.classList.remove(this.currentPaletteClass);
    }

    this.document.body.classList.add(newPaletteClass);
    this.currentPaletteClass = newPaletteClass;
  }
}
