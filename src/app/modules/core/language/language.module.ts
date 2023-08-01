import { APP_INITIALIZER, LOCALE_ID, ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";
import { LanguageService } from "./services/language.service";
import { MAT_DATE_LOCALE } from "@angular/material/core";


@NgModule({
    imports: [
        CommonModule,
    ],
})
export class LanguageModule {

    public static forRoot(): ModuleWithProviders<LanguageModule> {
        return {
            ngModule: LanguageModule,
            providers: [
                LanguageService,
                {
                    provide: APP_INITIALIZER,
                    multi: true,
                    useFactory: (languageService: LanguageService) => {
                        return () => Promise.all(
                            languageService.getLanguageConfigs().map((cfg) => {
                                return cfg.ngLocaleImport.then(({default: localeData}) => {
                                    registerLocaleData(localeData)
                                })
                            })
                        );
                    },
                    deps: [LanguageService],
                },
                {
                    provide: LOCALE_ID,
                    useFactory: (languageService: LanguageService) => {
                        return languageService.getActiveLanguageConfig().ngLocaleId;
                    },
                    deps: [LanguageService],
                },
                {
                    provide: APP_INITIALIZER,
                    multi: true,
                    useFactory: (languageService: LanguageService) => {
                        return async () => {
                            const activeLanguageConfig = languageService.getActiveLanguageConfig();
                            const matDateLocaleModule = await languageService.getActiveLanguageConfig().matDateLocaleImport;

                            // Modifying the object by reference
                            activeLanguageConfig.matDateLocale = matDateLocaleModule.default;
                        }
                    },
                    deps: [LanguageService],
                },
                {
                    provide: MAT_DATE_LOCALE,
                    useFactory: (languageService: LanguageService) => {
                        return languageService.getActiveLanguageConfig().matDateLocale;
                    },
                    deps: [LanguageService, APP_INITIALIZER],
                },
            ],
        };
    };
}
