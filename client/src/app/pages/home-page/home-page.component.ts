import {ChangeDetectionStrategy, ChangeDetectorRef, Component, signal} from '@angular/core';
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

@Component({
  selector: 'app-home-page',
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
    MatTooltip
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  public longUrlForm = new FormControl('', [Validators.required, Validators.pattern('(https?://.+)')]);
  public errorMessage = signal('');
  public shortLink = signal<Link | null>(null);
  public baseUrl = window.location.origin;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {
    scheduled([of(this.longUrlForm.statusChanges, this.longUrlForm.valueChanges)], asyncScheduler)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  public onSubmit(): void {
    if (this.longUrlForm.invalid) {
      return;
    }

    const longUrl = this.longUrlForm.value!;

    this.apiService.createLink(longUrl).subscribe({
      next: (response) => {
        this.shortLink.set(response);
        this.snackBar.open('Link shortened successfully!', 'Close', { duration: 5000 });
        this.longUrlForm.reset();
      },
      error: (error) => {
        console.error('Error creating link: ', error);
        this.snackBar.open('An error occurred. Please try again', 'Close', { duration: 5000 });
      }
    })
  }

  public updateErrorMessage() {
    if (this.longUrlForm.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.longUrlForm.hasError('pattern')) {
      this.errorMessage.set('Not a valid URL');
    } else {
      this.errorMessage.set('');
    }
  }

  public onCopy(): void {
    this.snackBar.open('Copied!', 'Close', { duration: 2000 });
  }

  public resetCardContent(): void {
    this.shortLink.set(null);
    this.cdr.detectChanges();
  }
}
