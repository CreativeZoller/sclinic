import { inject, Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { map, switchMap, shareReplay } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { parseISO, isPast } from "date-fns";
import { AUTH_STATE_STORAGE_KEY, LOGIN_ROUTE, ROUTE_RETURN_URL_QUERY_PARAM_KEY } from "../../../../app.config";
import { AuthenticationWebServiceService } from "../../../../../api/services";
import { AuthState } from "../models/auth-state.model";
import { stringToSha256$ } from "../../utility/methods/string-to-sha256";
import { LoginStartResponse } from "../../../feature/login/models/login-start-response.model";
import { LoginSecondFactorFormValue } from "../models/login-second-factor-form-value.model";
import { UserLoginDataService } from "./user-login-data.service";


@UntilDestroy()
@Injectable()
export class AuthService {

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private authenticationWebServiceService = inject(AuthenticationWebServiceService);
    private userLoginDataService = inject(UserLoginDataService);

    private state$ = new BehaviorSubject<AuthState | null>(null);

    constructor() {
        // Init state from storage
        const stateJson = localStorage.getItem(AUTH_STATE_STORAGE_KEY);
        if (stateJson != null) {
            const parsedState = JSON.parse(stateJson);
            if (parsedState.tokenValidity != null) {
                parsedState.tokenValidity = parseISO(parsedState.tokenValidity);
            }

            this.state$.next(parsedState);
        }

        // Persist changes to storage
        this.state$.pipe(untilDestroyed(this)).subscribe((state) => {
            if (state == null) {
                localStorage.removeItem(AUTH_STATE_STORAGE_KEY);
            } else {
                localStorage.setItem(AUTH_STATE_STORAGE_KEY, JSON.stringify(state));
            }
        });
    }

    /**
     * 1st phase of login
     */
    public loginStart(email: string, password: string) {
        return stringToSha256$(password).pipe(
            switchMap((hashedPassword) => {
                return this.authenticationWebServiceService.authenticationAuthenticatePost({
                    email: email,
                    executingUserId: 0,
                    password: hashedPassword,
                })
            }),
            shareReplay(1),
        );
    }

    /**
     * 2nd phase of login
     */
    public loginSecondFactor(formValue: LoginSecondFactorFormValue, loginStartResponse: LoginStartResponse) {
        if(loginStartResponse == null) throw new Error("Missing loginStartResponse parameter!");

        return this.authenticationWebServiceService.authenticationAuthenticateByGoogleAuthenticatorPost({
            executingUserId: loginStartResponse?.swissUserId,
            firstFactorAuthenticationToken: loginStartResponse?.firstFactorAuthenticationToken,
            clientCode: formValue.twoFactorCode,
        }).pipe(
            map((loginSecondFactorResponse) => {
                if (loginSecondFactorResponse.jwtSecurityToken != null) {
                    this.userLoginDataService.setActiveClinicId(formValue.clinicId);
                    this.userLoginDataService.setActivePraxisId(formValue.praxisId);

                    this.state$.next({
                        userId: loginStartResponse?.swissUserId!,
                        token: loginSecondFactorResponse.jwtSecurityToken!,
                        tokenValidity: parseISO(loginSecondFactorResponse.jwtValidity!),
                    });
                } else {
                    throw new Error("Missing JWT token in response!");
                }
            }),
            shareReplay(1),
        );
    }

    public logout(withReturnUrl: boolean = false) {
        this.state$.next(null);

        this.userLoginDataService.reset();

        const isLoginActive = this.router.isActive(
            this.router.createUrlTree([LOGIN_ROUTE]),
            {paths: "exact", queryParams: "ignored", fragment: "ignored", matrixParams: "ignored"}
        );
        if (!isLoginActive) {
            const previousReturnUrl = this.activatedRoute.snapshot.queryParams[ROUTE_RETURN_URL_QUERY_PARAM_KEY]
            const queryParams = !withReturnUrl ? {} : {
                [ROUTE_RETURN_URL_QUERY_PARAM_KEY]: previousReturnUrl || this.router.url,
            };
            this.router.navigate([LOGIN_ROUTE], { queryParams });
        }
    }

    private _isLoggedIn(state: AuthState | null): boolean {
        return state?.token != null
            && state?.tokenValidity != null
            && !isPast(state.tokenValidity);
    }

    public isLoggedIn(): boolean {
        return this._isLoggedIn(this.state$.value);
    }

    public isLoggedIn$(): Observable<boolean> {
        return this.state$.pipe(
            map((state) => this._isLoggedIn(state)),
        );
    }

    private _getToken(state: AuthState | null): string | null {
        return this._isLoggedIn(state) ? state?.token ?? null : null;
    }

    public getToken(): string | null {
        return this._getToken(this.state$.value);
    }

    public getToken$(): Observable<string | null> {
        return this.state$.pipe(
            map((state) => this._getToken(state)),
        );
    }

    private _getUserId(state: AuthState | null): number | null {
        return this._isLoggedIn(state) ? state?.userId ?? null : null;
    }

    public getUserId(): number | null {
        return this._getUserId(this.state$.value);
    }

    public getUserId$(): Observable<number | null> {
        return this.state$.pipe(
            map((state) => this._getUserId(state)),
        );
    }
}
