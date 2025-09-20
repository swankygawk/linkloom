import { computed, DOCUMENT, Inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

export interface Language {
  tag: string;
  displayName: string;
}

export const supportedLanguages: string[] = [
  'en-US',
  'fr-FR',
  'es-ES',
  'it-IT',
  'de-DE',
  'pt-PT',
  'pt-BR',
  'ru-RU',
  'tr-TR',
  'zh-CN',
  'zh-TW',
  'ja-JP',
  'ko-KR',
  'th-TH',
  'id-ID',
  'ar-AE',
  'he-IL',
  'hi-IN',
  'bn-BD',
  'ur-PK'
]

const rtlLanguages: string[] = [
  'ar-AE',
  'he-IL',
  'ur-PK'
]

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public languagePreference: WritableSignal<string>;
  public languagePreferences: Signal<Language[]>;

  public readonly dir: Signal<'ltr' | 'rtl'>;

  private readonly langPreferenceLocalStorageKey = 'linkloom-lang-preference';

  constructor(
    private translocoService: TranslocoService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.languagePreference = signal(this.getInitialPreference());
    this.languagePreferences = computed(() => {
      const displayNames = new Intl.DisplayNames([this.languagePreference()], { type: 'language' });

      return supportedLanguages.map(lang => {
        const displayName = displayNames.of(lang) || lang;

        return {
          tag: lang,
          displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1)
        }
      })
    });

    this.dir = computed(() => {
      return rtlLanguages.includes(this.languagePreference()) ? 'rtl' : 'ltr';
    })

    this.applyLanguage(this.languagePreference());
  }

  public setPreference(preference: string): void {
    this.languagePreference.set(preference);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.langPreferenceLocalStorageKey, preference);
    }
    this.applyLanguage(preference);
  }

  private getInitialPreference(): string {
    const supportedLangs = this.translocoService.getAvailableLangs() as string[];
    const defaultLang = 'en-US';

    if (typeof localStorage === undefined) {
      return defaultLang;
    }

    const storedPreference = localStorage.getItem(this.langPreferenceLocalStorageKey);
    if (storedPreference && supportedLangs.includes(storedPreference)) {
      return storedPreference;
    }

    const browserLang = navigator.language;
    if (supportedLangs.includes(browserLang)) {
      return browserLang;
    }

    const browserLangSubtag = browserLang.split('-')[0];
    const matchingLang = supportedLangs.find(lang => lang.startsWith(browserLangSubtag));
    if (matchingLang) {
      return matchingLang;
    }

    return defaultLang;
  }

  private applyLanguage(lang: string): void {
    this.translocoService.setActiveLang(lang);
    this.document.documentElement.setAttribute('lang', lang);
  }
}
