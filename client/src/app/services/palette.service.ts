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

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.palettePreference = signal(this.getInitialPreference());
    this.applyPalette(this.palettePreference());
  }

  public setPreference(preference: string): void {
    this.palettePreference.set(preference);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.palettePreferenceLocalStorageKey, this.palettePreference());
    }
    this.applyPalette(this.palettePreference());
  }

  private getInitialPreference(): string {
    if (typeof localStorage === 'undefined') {
      return 'azure';
    }

    const storedPreference = localStorage.getItem(this.palettePreferenceLocalStorageKey) || 'azure';
    if (!palettePreferences.some(
      (palette) => palette.className === storedPreference
    )) {
      return 'azure';
    }

    return storedPreference;
  }

  private applyPalette(palettePreference: string): void {
    palettePreferences.forEach(palette => {
      this.document.body.classList.remove(`${palette.className}-palette`);
    });
    this.document.body.classList.add(`${palettePreference}-palette`);
  }
}
