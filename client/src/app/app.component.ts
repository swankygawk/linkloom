import { Component, Signal, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from './services/theme.service';
import { PaletteService } from './services/palette.service';
import { TranslocoPipe } from '@ngneat/transloco';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    TranslocoPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public dir: Signal<'ltr' | 'rtl'>;
  protected readonly title = signal('client');

  constructor(
    private themeService: ThemeService,
    private paletteService: PaletteService,
    private languageService: LanguageService,
  ) {
    this.dir = this.languageService.dir;
  }
}
