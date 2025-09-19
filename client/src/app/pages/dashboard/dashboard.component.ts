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
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from '../../components/confirmation-dialog/confirmation-dialog.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-dashboard',
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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
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

  onDeleteForever(linkToDelete: Link): void {
    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogData>(
      ConfirmationDialogComponent,
      {
        data: {
          title: 'Delete link',
          message: 'Are you sure? This action cannot be undone!',
          action: 'Delete',
        },
      }
    );

    dialogRef.afterClosed()
      .pipe(filter(result => result === true))
      .subscribe(() => {
        this.apiService.deleteLink(linkToDelete.id).subscribe({
          next: () => {
            this.snackBar.open('Link deleted successfully!', 'Close', {duration: 3000});
            this.totalLinks.update(currentTotal => currentTotal - 1);

            const wasLastLinkOnPage = this.links().length === 1;
            const isNotFirstPage = this.pageIndex() > 0;
            if (wasLastLinkOnPage && isNotFirstPage) {
              this.pageIndex.update(currentIndex => currentIndex - 1);
              this.fetchLinks();
            } else {
              this.links.update(currentLinks => currentLinks
                .filter(link => link.id !== linkToDelete.id)
              );
            }
          },
          error: (error) => {
            console.error('Error deleting link:', error);
            this.snackBar.open('Failed to delete link. Please try again', 'Close', { duration: 5000 });
          },
        });
      });
  }
}
