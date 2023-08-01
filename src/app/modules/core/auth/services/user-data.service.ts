import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, switchMap, shareReplay, distinctUntilChanged, tap, finalize, skipUntil, filter } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { AuthService } from "./auth.service";
import { UserDataState } from "../models/user-data-state.model";
import { AuthenticationWebServiceService } from "../../../../../api/services";


@UntilDestroy()
@Injectable()
export class UserDataService {

    private authService = inject(AuthService);
    private authenticationWebServiceService = inject(AuthenticationWebServiceService);

    private stateLoading$ = new BehaviorSubject<boolean>(false);
    private state$ = new BehaviorSubject<UserDataState>({});

    constructor() {
        this.authService.isLoggedIn$().pipe(untilDestroyed(this)).subscribe((isLoggedIn) => {
            if (!isLoggedIn) this.state$.next({})
        });

        this.authService.getUserId$().pipe(
            distinctUntilChanged(),
            tap((userId) => this.stateLoading$.next(userId != null)),
            switchMap((userId) =>
                userId == null
                    ? of(null)
                    : this.authenticationWebServiceService.userGetSwissUserByConditionPost({
                        executingUserId: userId,
                        needAddress: true,
                        needSwissUserXRole: true,
                        swissUserIdList: [userId],
                    }).pipe(
                        map((response) => response?.businessObjectList?.[0]),
                        finalize(() => this.stateLoading$.next(false)),
                    )
            ),
            untilDestroyed(this),
        ).subscribe((userData) => {
            this.state$.next({
                ...this.state$.value,
                userData: userData,
            });
        });
    }

    private getStateButWaitForLoading$() {
        return this.stateLoading$.pipe(
            switchMap((isLoading) => !isLoading
                ? this.state$
                : this.state$.pipe(
                    skipUntil(this.stateLoading$.pipe(filter(isLoading => isLoading === false))),
                )
            ),
            shareReplay(1),
        )
    }

    public getUserData(): UserDataState["userData"] {
        return this.state$.value.userData;
    }

    public getUserData$(): Observable<UserDataState["userData"]> {
        return this.getStateButWaitForLoading$().pipe(
            map((state) => state.userData),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }
}
