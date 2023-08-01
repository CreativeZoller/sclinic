import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, distinctUntilChanged } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { UserLoginDataState } from "../models/user-login-data-state.model";
import { USER_LOGIN_DATA_STATE_STORAGE_KEY } from "../../../../app.config";


@UntilDestroy()
@Injectable()
export class UserLoginDataService {

    private state$ = new BehaviorSubject<UserLoginDataState>({});

    constructor() {
        // Init state from storage
        const stateJson = localStorage.getItem(USER_LOGIN_DATA_STATE_STORAGE_KEY);
        if (stateJson != null) {
            const parsedState = JSON.parse(stateJson);
            this.state$.next(parsedState);
        }

        // Persist changes to storage
        this.state$.pipe(untilDestroyed(this)).subscribe((state) => {
            if (state == null) {
                localStorage.removeItem(USER_LOGIN_DATA_STATE_STORAGE_KEY);
            } else {
                localStorage.setItem(USER_LOGIN_DATA_STATE_STORAGE_KEY, JSON.stringify(state));
            }
        });
    }

    public reset() {
        this.state$.next({});
    }

    public setActivePraxisId(value: UserLoginDataState["selectedPraxisId"]) {
        this.state$.next({
            ...this.state$.value,
            selectedPraxisId: value,
        });
    }

    public getActivePraxisId(): UserLoginDataState["selectedPraxisId"] {
        return this.state$.value.selectedPraxisId
    }

    public getActivePraxisId$(): Observable<UserLoginDataState["selectedPraxisId"]> {
        return this.state$.pipe(
            map((state) => state.selectedPraxisId),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }

    public setActiveClinicId(value: UserLoginDataState["selectedClinicId"]) {
        this.state$.next({
            ...this.state$.value,
            selectedClinicId: value,
        });
    }

    public getActiveClinicId(): UserLoginDataState["selectedClinicId"] {
        return this.state$.value.selectedClinicId
    }

    public getActiveClinicId$(): Observable<UserLoginDataState["selectedClinicId"]> {
        return this.state$.pipe(
            map((state) => state.selectedClinicId),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }
}
