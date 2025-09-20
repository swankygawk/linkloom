import {
  ChangeDetectionStrategy,
  WritableSignal,
  Component,
  Signal
} from '@angular/core';
import {
  MatRadioButton,
  MatRadioGroup
} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import {
  ThemeService,
  Theme,
  themePreferences
} from '../../services/theme.service';
import {
  Palette,
  PaletteService,
  palettePreferences
} from '../../services/palette.service';
import { TranslocoPipe } from '@ngneat/transloco';
import { Language, LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatAccordion,
    MatRadioGroup,
    MatRadioButton,
    FormsModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatSelectModule,
    TranslocoPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  public selectedTheme: WritableSignal<string>;
  public selectedPalette: WritableSignal<string>;
  public selectedLanguage: WritableSignal<string>;

  public availableThemes: Theme[] = themePreferences;
  public availablePalettes: Palette[] = palettePreferences;
  public availableLanguages: Signal<Language[]>;

  constructor(
    private themeService: ThemeService,
    private paletteService: PaletteService,
    private languageService: LanguageService,
  ) {
    this.selectedTheme = themeService.themePreference;
    this.selectedPalette = paletteService.palettePreference;
    this.selectedLanguage = languageService.languagePreference;

    this.availableLanguages = languageService.languagePreferences;
  }

  onThemeChange(theme: string): void {
    this.themeService.setPreference(theme);
  }

  onPaletteChange(palette: string): void {
    this.paletteService.setPreference(palette);
  }

  onLanguageChange(language: string): void {
    this.languageService.setPreference(language);
  }
}
