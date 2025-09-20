import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { filter } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class PaginatorIntl extends MatPaginatorIntl {
  constructor(private translocoService: TranslocoService) {
    super();

    this.translocoService.events$
      .pipe(
        filter((event) => event.type === 'translationLoadSuccess' || event.type === 'langChanged'),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.loadTranslations();
      })

    this.loadTranslations();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return this.translocoService.translate('PAGINATOR_RANGE_LABEL', { start: 0, end: 0, length: length });
    }

    const total = Math.max(length, 0);
    const start = page * pageSize;
    const end = start + pageSize < total ? start + pageSize : total;
    return this.translocoService.translate('PAGINATOR_RANGE_LABEL', { start: start + 1, end, length });
  };

  private loadTranslations(): void {
    this.itemsPerPageLabel = this.translocoService.translate('PAGINATOR_ITEMS_PER_PAGE');
    this.nextPageLabel = this.translocoService.translate('PAGINATOR_NEXT_PAGE');
    this.previousPageLabel = this.translocoService.translate('PAGINATOR_PREVIOUS_PAGE');
    this.firstPageLabel = this.translocoService.translate('PAGINATOR_FIRST_PAGE');
    this.lastPageLabel = this.translocoService.translate('PAGINATOR_LAST_PAGE');

    this.changes.next();
  }
}
