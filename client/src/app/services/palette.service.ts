import {
  DOCUMENT,
  Inject,
  Injectable,
  signal,
  WritableSignal
} from '@angular/core';

export interface Palette {
  displayName: string;
  className: string;
}

export const palettePreferences: Palette[] = [
  { displayName: 'Red', className: 'red' },
  { displayName: 'Green', className: 'green' },
  { displayName: 'Blue', className: 'blue' },
  { displayName: 'Yellow', className: 'yellow' },
  { displayName: 'Cyan', className: 'cyan' },
  { displayName: 'Magenta', className: 'magenta' },
  { displayName: 'Orange', className: 'orange' },
  { displayName: 'Chartreuse', className: 'chartreuse' },
  { displayName: 'Spring Green', className: 'spring-green' },
  { displayName: 'Azure', className: 'azure' },
  { displayName: 'Violet', className: 'violet' },
  { displayName: 'Rose', className: 'rose' },
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
    const defaultPalette = 'azure'

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
