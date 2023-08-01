import { Directive, ViewChild } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, isObservable, Observable, of, shareReplay, skip, switchMap } from "rxjs";
import { FormModalComponent } from "../../form-modal/components/form-modal/form-modal.component";


@UntilDestroy()
@Directive({})
export class BaseFormModalComponent<FormModel = any> {

    @ViewChild(FormModalComponent) public formModalComponent: FormModalComponent<FormModel>;

    protected initFormValue$$ = new BehaviorSubject<Observable<FormModel | undefined> | undefined>(undefined);
    protected initFormValue$ = this.initFormValue$$.pipe(
        switchMap(initFormValue$ => initFormValue$ != null
            ? initFormValue$.pipe(shareReplay(1))
            : of(undefined)
        ),
        shareReplay(1),
    );

    public open(initFormValue?: Observable<FormModel> | FormModel | null | undefined) {
        this.formModalComponent.loading = true;
        this.formModalComponent.open();

        this.initFormValue$$.next(
            isObservable(initFormValue)
                ? initFormValue
                : of(initFormValue ?? undefined)
        );
    }

    constructor() {
        this.initFormValue$.pipe(
            skip(1),
            untilDestroyed(this),
        ).subscribe({
            next: (initFormValue) => {
                this.formModalComponent.loading = false;
                this.formModalComponent.initFormValue = initFormValue ?? undefined;
            }, error: () => {
                this.formModalComponent.close();
            }
        });
    }
}
