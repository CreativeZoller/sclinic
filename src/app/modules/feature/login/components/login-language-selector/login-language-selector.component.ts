import { Component, inject } from "@angular/core";
import { LaguageConfig } from "../../../../core/language/models/language-config.model";
import { LanguageService } from "../../../../core/language/services/language.service";
import { UntilDestroy } from "@ngneat/until-destroy";


@UntilDestroy()
@Component({
    selector: "app-login-language-selector",
    templateUrl: "./login-language-selector.component.html",
    styleUrls: ["./login-language-selector.component.scss"],
})
export class LoginLanguageSelectorComponent {

    private languageService = inject(LanguageService);

    activeLanguageConfig$ = this.languageService.getActiveLanguageConfig$();
    languageConfigs = this.languageService.getLanguageConfigs();
    selectLanguageConfig(languageConfig: LaguageConfig) {
        this.languageService.setActiveLanguage(languageConfig.code)
    }
}
