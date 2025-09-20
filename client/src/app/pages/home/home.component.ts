import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ApiService, Link } from '../../services/api.service';
import { MatIcon } from '@angular/material/icon';
import { asyncScheduler, of, scheduled } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    ClipboardModule,
    MatIcon,
    FormsModule,
    MatTooltip,
    TranslocoPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public longUrlForm = new FormControl('', [Validators.required, Validators.pattern('(https?://.+)')]);
  public errorMessage = signal('');
  public shortLink = signal<Link | null>(null);
  public baseUrl = window.location.origin + '/links';

  constructor(
    private apiService: ApiService,
    private translocoService: TranslocoService,
    private languageService: LanguageService,
    private snackBar: MatSnackBar
  ) {
    scheduled([of(this.longUrlForm.statusChanges, this.longUrlForm.valueChanges)], asyncScheduler)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  onSubmit(): void {
    if (this.longUrlForm.invalid) {
      return;
    }

    const longUrl = this.longUrlForm.value!;

    this.apiService.createLink(longUrl).subscribe({
      next: (response) => {
        const message = this.translocoService.translate('SNACKBAR_LINK_SHORTENED_SUCCESS');
        const closeButton = this.translocoService.translate('SNACKBAR_CLOSE_BUTTON');

        this.shortLink.set(response);
        this.snackBar.open(message, closeButton, {
          duration: 5000,
          direction: this.languageService.dir()
        });
        this.longUrlForm.reset();
      },
      error: (error) => {
        console.error('Error creating link: ', error);

        const message = this.translocoService.translate('SNACKBAR_LINK_SHORTENED_ERROR');
        const closeButton = this.translocoService.translate('SNACKBAR_CLOSE_BUTTON');

        this.snackBar.open(message, closeButton, {
          duration: 5000,
          direction: this.languageService.dir()
        });
      }
    })
  }

  updateErrorMessage(): void {
    const requiredError = this.translocoService.translate('HOME_REQUIRED_ERROR');
    const patternError = this.translocoService.translate('HOME_PATTERN_ERROR');

    if (this.longUrlForm.hasError('required')) {
      this.errorMessage.set(requiredError);
    } else if (this.longUrlForm.hasError('pattern')) {
      this.errorMessage.set(patternError);
    } else {
      this.errorMessage.set('');
    }
  }

  onCopy(): void {
    const message = this.translocoService.translate('SNACKBAR_LINK_COPIED');
    const closeButton = this.translocoService.translate('SNACKBAR_CLOSE_BUTTON');

    this.snackBar.open(message, closeButton, {
      duration: 2000,
      direction: this.languageService.dir()
    });
  }

  resetCardContent(): void {
    this.shortLink.set(null);
  }
}
