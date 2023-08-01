import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { InitPageDataProviderService } from "../../../../../modules/app-common/init-page-data-provider/services/init-page-data-provider.service";
import { RoleService } from "../../../../../modules/core/auth/services/role.service";
import { UserDataService } from "../../../../../modules/core/auth/services/user-data.service";


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

    private userDataService = inject(UserDataService);
    private roleService = inject(RoleService);
    private activatedRoute = inject(ActivatedRoute);
    private initPageDataProviderService = inject(InitPageDataProviderService);

    @Input() appHeaderDefaulMenuDisplay: boolean;
    @Input() isRtl: boolean;

    itemClass: string = 'ms-1 ms-lg-3';
    btnClass: string =
        'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
    userAvatarClass: string = 'symbol-35px symbol-md-40px';
    btnIconClass: string = 'svg-icon-1';

    activeRole$ = this.roleService.getActiveRole$()

    protected initData = this.initPageDataProviderService.getInitData(this.activatedRoute.snapshot);

    userFormattedName$ = this.userDataService.getUserData$().pipe(
        map((userData) => {
            const nameParts = [
                this.initData.dC_TitleTypeList.find((item) => item.value === userData?.dC_TitleTypeId)?.name,
                userData?.familyName,
                userData?.firstName,
            ]

            return nameParts.filter(v => v != null).join(" ");
        }),
    )
}
