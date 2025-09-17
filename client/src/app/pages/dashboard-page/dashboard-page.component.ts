import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ApiService, Link } from '../../services/api.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatPaginatorModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    ClipboardModule,
    MatIcon,
    MatTooltip
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  public links = signal<Link[]>([]);
  public totalLinks = signal(0);
  public pageIndex = signal(0);
  public pageSize = signal(10);
  public isLoading = signal(true);
  public baseUrl = window.location.origin + '/links';

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.fetchLinks();
  }

  fetchLinks(): void {
    this.isLoading.set(true);
    this.apiService
      .getAllLinks(this.pageIndex() + 1, this.pageSize())
      .subscribe({
        next: (response) => {
          this.links.set(response.items);
          this.totalLinks.set(response.total);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error fetching links:', error);
          this.snackBar.open('Could not fetch links. Please try again', 'Close', {duration: 5000});
          this.isLoading.set(false);
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.fetchLinks();
  }

  onCopy(): void {
    this.snackBar.open('Copied!', 'Close', {duration: 2000});
  }

  onDeleteForever(id: number): void {
    return;
  }
}
