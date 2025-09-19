import {ChangeDetectionStrategy, Component, WritableSignal} from '@angular/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { ThemePreference, ThemeService } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  public selectedTheme: WritableSignal<ThemePreference>;

  constructor(private themeService: ThemeService) {
    this.selectedTheme = themeService.preference;
  }

  onThemeChange(theme: ThemePreference): void {
    this.themeService.setPreference(theme);
  }
}
