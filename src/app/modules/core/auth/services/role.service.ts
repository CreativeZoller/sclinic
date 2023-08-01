import { inject, Injectable } from "@angular/core";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { ROLE_STATE_STORAGE_KEY } from "../../../../app.config";
import { CoreModelsDTOsAuthenticationMainTablesRoleDTO } from "../../../../../api/models";
import { UserDataService } from "./user-data.service";
import { RoleState } from "../models/role-state.model";
import { AuthService } from "./auth.service";
import { UserLoginDataService } from "./user-login-data.service";
import { UserDataState } from "../models/user-data-state.model";
import { UserLoginDataState } from "../models/user-login-data-state.model";


@UntilDestroy()
@Injectable()
export class RoleService {

    private authService = inject(AuthService);
    private userDataService = inject(UserDataService);
    private userLoginDataService = inject(UserLoginDataService);

    private state$ = new BehaviorSubject<RoleState | null>(null);

    constructor() {
        // Init state from storage
        const stateJson = localStorage.getItem(ROLE_STATE_STORAGE_KEY);
        if (stateJson != null) {
            const parsedState = JSON.parse(stateJson);
            this.state$.next(parsedState);
        }

        // Persist changes to storage
        this.state$.pipe(untilDestroyed(this)).subscribe((state) => {
            if (state == null) {
                localStorage.removeItem(ROLE_STATE_STORAGE_KEY);
            } else {
                localStorage.setItem(ROLE_STATE_STORAGE_KEY, JSON.stringify(state));
            }
        });

        this.authService.isLoggedIn$().pipe(untilDestroyed(this)).subscribe((isLoggedIn) => {
            if (!isLoggedIn) this.state$.next({
                ...this.state$.value,
                activeRole: null,
            })
        });

        this.getRoles$(true).pipe(untilDestroyed(this)).subscribe((roles) => {
            const activeRoleId = this.state$.value?.activeRole?.roleId
            if (activeRoleId != null) {
                if (!roles.some((role) => role.roleId === activeRoleId)) {
                    this.state$.next({
                        ...this.state$.value,
                        activeRole: roles.length === 1 ? roles[0] : null,
                    })
                }
            } else {
                if (roles.length === 1) {
                    this.state$.next({
                        ...this.state$.value,
                        activeRole: roles[0],
                    })
                }
            }
        })
    }

    public activateRoleById(roleId: CoreModelsDTOsAuthenticationMainTablesRoleDTO['roleId']): void {
        if (!this.authService.isLoggedIn()) throw new Error("Cannot activate role before logging in!");

        const state = this.state$.value;

        this.state$.next({
            ...state!,
            activeRole: this.getRoles().find((r => r.roleId === roleId)) ?? null,
        });
    }

    private _getRoles(
        userData: UserDataState["userData"],
        selectedClinicId: UserLoginDataState["selectedClinicId"],
        selectedPraxisId: UserLoginDataState["selectedPraxisId"],
    ): CoreModelsDTOsAuthenticationMainTablesRoleDTO[] {
        // Note: jelenleg a praxis és a clinic u.a csak más clinicType-pal rendelkeznek, a kettő közül csak az egyik lehet megadva!
        const clinicId = selectedClinicId ?? selectedPraxisId;

        return userData?.swissUserXRole
            ?.filter(swissUserXRole => {
                return swissUserXRole
                    ?.swissUserXRoleXClinic
                    ?.some(swissUserXRoleXClinic => swissUserXRoleXClinic?.clinicId === clinicId)
                    ?? false;
            })
            ?.map(swissUserXRole => swissUserXRole.role!)
            ?.filter(role => role != null)
            ?? [];
    }

    public getRoles(): CoreModelsDTOsAuthenticationMainTablesRoleDTO[] {
        return this._getRoles(
            this.userDataService.getUserData(),
            this.userLoginDataService.getActiveClinicId(),
            this.userLoginDataService.getActivePraxisId(),
        );
    }

    public getRoles$(onlyNonTechnicals: boolean = true): Observable<CoreModelsDTOsAuthenticationMainTablesRoleDTO[]> {
        return combineLatest([
            this.userDataService.getUserData$(),
            this.userLoginDataService.getActiveClinicId$(),
            this.userLoginDataService.getActivePraxisId$(),
        ]).pipe(
            map((args) => this._getRoles(...args)),
            map((roles) => (roles ?? []).filter(r => !onlyNonTechnicals || !r.technical)),
            shareReplay(1),
        )
    }

    private _getActiveRole(state: RoleState | null): CoreModelsDTOsAuthenticationMainTablesRoleDTO | null {
        return this.authService.isLoggedIn() ? state?.activeRole ?? null : null;
    }

    public getActiveRole(): CoreModelsDTOsAuthenticationMainTablesRoleDTO | null {
        return this._getActiveRole(this.state$.value);
    }

    public getActiveRole$(): Observable<CoreModelsDTOsAuthenticationMainTablesRoleDTO | null> {
        return this.state$.pipe(
            map((state) => this._getActiveRole(state)),
            shareReplay(1),
        );
    }
}
