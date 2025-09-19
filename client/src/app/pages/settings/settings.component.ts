import {
  ChangeDetectionStrategy,
  WritableSignal,
  Component
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
import { ThemeService } from '../../services/theme.service';
import {
  Palette,
  palettePreferences,
  PaletteService
} from '../../services/palette.service';

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
    MatSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  public selectedTheme: WritableSignal<string>;
  public selectedPalette: WritableSignal<string>;
  public availablePalettes: Palette[] = palettePreferences;

  constructor(
    private themeService: ThemeService,
    private paletteService: PaletteService,
  ) {
    this.selectedTheme = themeService.themePreference;
    this.selectedPalette = paletteService.palettePreference;
  }

  onThemeChange(theme: string): void {
    this.themeService.setPreference(theme);
  }

  onPaletteChange(palette: string): void {
    this.paletteService.setPreference(palette);
  }
}
