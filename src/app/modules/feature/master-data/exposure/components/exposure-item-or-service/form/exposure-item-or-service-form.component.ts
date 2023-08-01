import { AfterViewInit, ChangeDetectionStrategy, Component, QueryList, ViewChildren } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, startWith, take } from "rxjs";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { ExposureXExposureItem } from "../../../models/exposure-x-exposure-item.model";
import { ExposureXExposureItemXService } from "../../../models/exposure-x-exposure-item-x-service.model";
import { ExposureItemFormComponent } from "../../exposure-item/form/exposure-item-form.component";
import { ExposureItemServiceFormComponent } from "../../exposure-item-service/form/exposure-item-service-form.component";
import { Exposure } from "../../../models/exposure.model";


type Full_Model = ExposureXExposureItem | ExposureXExposureItemXService;

@UntilDestroy()
@Component({
    selector: "app-exposure-item-or-service-form",
    templateUrl: "./exposure-item-or-service-form.component.html",
    styleUrls: ["./exposure-item-or-service-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExposureItemOrServiceFormComponent extends BaseFormComponent<Full_Model> implements AfterViewInit {

    protected currentFormComponent$ = new BehaviorSubject<BaseFormComponent<Full_Model> | undefined>(undefined);

    @ViewChildren("childFormComponent") private childFormComponent: QueryList<BaseFormComponent<Full_Model>>;
    public ngAfterViewInit() {
        combineLatest([
            this.initialEditorData$,
            this.childFormComponent.changes.pipe(startWith(this.childFormComponent.toArray())) as Observable<BaseFormComponent<Full_Model>[]>,
        ]).pipe(
            untilDestroyed(this),
        ).subscribe(([initialEditorData, childFormComponentArray]) => {
            if (this.isExposureItem(initialEditorData)) {
                this.currentFormComponent$.next(childFormComponentArray.find(c => c instanceof ExposureItemFormComponent))
            } else {
                this.currentFormComponent$.next(childFormComponentArray.find(c => c instanceof ExposureItemServiceFormComponent))
            }

            this.cdr.markForCheck();
        });
    }

    public get errorResourceKeyPrefix() {
        return this.currentFormComponent$.value?.errorResourceKeyPrefix!;
    };

    public get form() {
        return this.currentFormComponent$.value?.form!
    };

    private isExposureItem(data: Full_Model | undefined | null): data is ExposureXExposureItem {
        return ((data as ExposureXExposureItemXService)?.exposureXExposureItemXServiceId == null);
    }

    protected isExposureItem$ = this.initialEditorData$.pipe(
        map((data) => this.isExposureItem(data)),
        shareReplay(1),
    )

    public setFormValue(data: Full_Model | undefined | null) {
        this.initialEditorData$.next(data);

        this.currentFormComponent$.pipe(
            filter(c => c != null),
            take(1),
            untilDestroyed(this),
        ).subscribe((childFormComponent) => {
            childFormComponent!.editorData = data;
        })
    };

    public getFormValue(raw?: boolean): Full_Model {
        return raw
            ? this.currentFormComponent$?.value?.form?.getRawValue()
            : this.currentFormComponent$?.value?.form?.value;
    };

    public formValueToRequestValue(value: Full_Model): Full_Model {
        const formComp = this.currentFormComponent$?.value;
        if (formComp == null) return value;

        return formComp.formValueToRequestValue(value);
    }

    public getElementRef() {
        return this.currentFormComponent$.value?.getElementRef() ?? this.el;
    }

    public updateView() {
        super.updateView();
        this.currentFormComponent$.value?.updateView();
    }

    protected exposure$ = this.initialEditorData$.pipe(
        map((data) => (data as any)?._exposure as Exposure),
        shareReplay(1),
    );

    protected exposureXExposureItem$ = this.initialEditorData$.pipe(
        map((data) => (data as any)?._exposureXExposureItem as ExposureXExposureItem),
        shareReplay(1),
    );
}
