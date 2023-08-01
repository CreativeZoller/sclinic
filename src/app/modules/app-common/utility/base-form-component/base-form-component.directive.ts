import { ChangeDetectorRef, Directive, ElementRef, Input, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, Observable, of } from "rxjs";
import { ModalComponent } from "../../../../_metronic/partials";
import { InitPageData } from "../../init-page-data-provider/models/init-page-data.model";


@UntilDestroy()
@Directive({})
export abstract class BaseFormComponent<FormModel> {

    protected cdr = inject(ChangeDetectorRef);
    protected el = inject(ElementRef);
    protected activatedRoute = inject(ActivatedRoute);

    public updateView() {
        this.cdr.markForCheck();
    }

    public getElementRef() {
        return this.el;
    }

    public abstract errorResourceKeyPrefix: string;

    public initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    protected initialEditorData$ = new BehaviorSubject<FormModel | undefined | null>(undefined);
    @Input() public set editorData(data: FormModel | undefined | null) {
        this.initialEditorData$.next(data);
        this.setFormValue(data);
        this.cdr.markForCheck();
    };

    protected skipResetingFields: boolean = false;
    public setFormValue(data: FormModel | undefined | null) {
        this.form.reset();
        if (data != null) {
            this.skipResetingFields = true;
            this.form.patchValue(data);
            this.skipResetingFields = false;
        }
    };

    /**
     * A form értékét adja vissza
     */
    public getFormValue(raw?: boolean): FormModel {
        return raw ? this.form.getRawValue() : this.form.value;
    };

    /**
     * További form érték konverzióra használható az app-list-field -ek esetében
     *
     * Abban az esetben hasznos ha egy bizonyos adatra még szükség van az app-list-field táblázatában (pl dC_City.name),
     * de a requestbe már nem szeretnénk azt visszaküldeni (pl dC_City helyett csak a dC_CityId-t akarunk küldeni),
     * akkor azt ennek a funkciónak a segítségével ki tudjuk törölni.
     */
    public formValueToRequestValue(value: FormModel): FormModel {
        return value;
    };

    public abstract form: FormGroup;

    public getExtraButtonsConfig$: (modal: ModalComponent) => Observable<{
        component?: any,
        initComponentBindingFn?: (instance: any) => void,
    }[]> = () => of([]);
}
