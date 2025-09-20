import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    TranslocoPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss'
})
export class RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    const shortCode = this.route.snapshot.paramMap.get('shortCode');

    if (!shortCode) {
      this.router.navigate(['/']);
      return;
    }

    this.apiService.getLinkByShortCode(shortCode).subscribe({
      next: link => {
        window.location.replace(link.longUrl);
      },
      error: err => {
        console.error('Error fetching link:', err);
        this.router.navigate(['/not-found'], { queryParams: { shortCode: shortCode } });
      }
    })
  }
}
