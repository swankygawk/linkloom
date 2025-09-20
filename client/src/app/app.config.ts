import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntl } from './intl/paginator-intl';
import { supportedLanguages } from './services/language.service'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(),
    provideTransloco({
        config: {
          availableLangs: supportedLanguages,
          defaultLang: 'en-US',
          fallbackLang: 'en-US',
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
    }),
    { provide: MatPaginatorIntl, useClass: PaginatorIntl },
  ]
};
