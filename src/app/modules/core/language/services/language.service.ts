import { Injectable } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, map, Observable } from "rxjs";
import { DEFAULT_LANGUAGE, LANGUAGE_CONFIGS, LANGUAGE_STORAGE_KEY } from "../../../../app.config";
import { LaguageConfig } from "../models/language-config.model";


@UntilDestroy()
@Injectable()
export class LanguageService {

    private activeLanguage$ = new BehaviorSubject<string>(DEFAULT_LANGUAGE);

    constructor() {
        // Init state from storage
        let languageKey = localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
        if (!this.getLanguageConfigs().some((cfg) => cfg.code === languageKey)) {
            languageKey = DEFAULT_LANGUAGE;
        }

        this.activeLanguage$.next(languageKey);

        // Persist changes to storage
        this.activeLanguage$.pipe(untilDestroyed(this)).subscribe((languageKey) => {
            if (languageKey == null) {
                localStorage.removeItem(LANGUAGE_STORAGE_KEY);
            } else {
                localStorage.setItem(LANGUAGE_STORAGE_KEY, languageKey);
            }
        });
    }

    public getActiveLanguage(): string {
        return this.activeLanguage$.value;
    }

    public getActiveLanguage$(): Observable<string> {
        return this.activeLanguage$.asObservable()
    }

    public setActiveLanguage(language: string): void {
        this.activeLanguage$.next(language);
        // Reload page to apply changes
        location.reload();
    }

    public getActiveLanguageConfig(): LaguageConfig {
        const activeLanguage = this.getActiveLanguage();
        const activeLanguageConfig = this.getLanguageConfigs().find((cfg) => cfg.code === activeLanguage);
        if (activeLanguageConfig == null) throw new Error("Null active language config! Check configuration")

        return activeLanguageConfig;
    }

    public getActiveLanguageConfig$(): Observable<LaguageConfig> {
        return this.getActiveLanguage$().pipe(
            map((activeLanguage) => {
                const activeLanguageConfig = this.getLanguageConfigs().find((cfg) => cfg.code === activeLanguage);
                if (activeLanguageConfig == null) throw new Error("Null active language config! Check configuration")

                return activeLanguageConfig;
            }),
        );
    }

    public setActiveLanguageConfig(languageConfig: LaguageConfig): void {
        this.activeLanguage$.next(languageConfig.code);
        // Reload page to apply changes
        location.reload();
    }

    public getLanguageConfigs(): LaguageConfig[] {
        return LANGUAGE_CONFIGS.filter(x => x.code == "hu"); // TODO törlés késöbb EK-1034
    }
}
