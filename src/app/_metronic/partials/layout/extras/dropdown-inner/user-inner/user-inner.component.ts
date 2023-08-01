import { Component, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from 'src/app/modules/core/auth/services/auth.service';
import { InitPageDataProviderService } from "../../../../../../modules/app-common/init-page-data-provider/services/init-page-data-provider.service";
import { UserDataService } from "../../../../../../modules/core/auth/services/user-data.service";
import { LaguageConfig } from "../../../../../../modules/core/language/models/language-config.model";
import { LanguageService } from "../../../../../../modules/core/language/services/language.service";

@Component({
    selector: 'app-user-inner',
    templateUrl: './user-inner.component.html',
})
export class UserInnerComponent {

    private authService = inject(AuthService);
    private userDataService = inject(UserDataService);
    private languageService = inject(LanguageService);
    private activatedRoute = inject(ActivatedRoute);
    private initPageDataProviderService = inject(InitPageDataProviderService);

    @HostBinding('class')
    class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
    @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

    userData$ = this.userDataService.getUserData$();
    activeLanguageConfig$ = this.languageService.getActiveLanguageConfig$();
    languageConfigs = this.languageService.getLanguageConfigs();

    protected initData = this.initPageDataProviderService.getInitData(this.activatedRoute.snapshot);

    userFormattedName$ = this.userData$.pipe(
        map((userData) => {
            const nameParts = [
                this.initData.dC_TitleTypeList.find((item) => item.value === userData?.dC_TitleTypeId)?.name,
                userData?.familyName,
                userData?.firstName,
            ]

            return nameParts.filter(v => v != null).join(" ");
        }),
    )

    logout() {
        this.authService.logout();
    }

    selectLanguageConfig(languageConfig: LaguageConfig) {
        this.languageService.setActiveLanguage(languageConfig.code)
    }
}
