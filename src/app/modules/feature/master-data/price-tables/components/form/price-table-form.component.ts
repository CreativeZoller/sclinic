import { AfterViewInit, ChangeDetectionStrategy, Component, Input, QueryList, ViewChildren } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, filter, take } from "rxjs";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { PriceTable } from "../../models/price-table.model";
import { PriceTableFormCreateComponent } from "../form-create/price-table-form-create.component";
import { PriceTableFormUpdateComponent } from "../form-update/price-table-form-update.component";


type Full_Model = PriceTable;

@UntilDestroy()
@Component({
    selector: "app-price-table-form",
    templateUrl: "./price-table-form.component.html",
    styleUrls: ["./price-table-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTableFormComponent extends BaseFormComponent<Full_Model> implements AfterViewInit {

    protected childFormComponent$ = new BehaviorSubject<BaseFormComponent<Full_Model> | undefined>(undefined);

    protected pendingActivePriceTable$ = new BehaviorSubject<Full_Model | undefined>(undefined);
    @Input() set pendingActivePriceTable(activePriceTable: Full_Model | undefined) {
        this.pendingActivePriceTable$.next(activePriceTable);
    };

    protected activePriceTable$ = new BehaviorSubject<Full_Model | undefined>(undefined);
    @Input() set activePriceTable(activePriceTable: Full_Model | undefined) {
        this.activePriceTable$.next(activePriceTable);
    };

    @ViewChildren("childFormComponent") private childFormComponent: QueryList<BaseFormComponent<Full_Model>>;
    public ngAfterViewInit() {
        this.childFormComponent$.next(this.childFormComponent.first);
        this.childFormComponent.changes.pipe(
            untilDestroyed(this),
        ).subscribe(() => {
            this.childFormComponent$.next(this.childFormComponent.first);
            this.cdr.markForCheck();
        })
    }

    public get errorResourceKeyPrefix() {
        return this.childFormComponent$.value?.errorResourceKeyPrefix!;
    };

    public get form() {
        return this.childFormComponent$.value?.form!
    };

    public setFormValue(data: Full_Model | undefined | null) {
        this.childFormComponent$.pipe(
            filter(c => c != null),
            filter(c => c instanceof (data != null ? PriceTableFormUpdateComponent : PriceTableFormCreateComponent)),
            take(1),
            untilDestroyed(this),
        ).subscribe((childFormComponent) => {
            childFormComponent!.editorData = data;
        })
    };

    public getFormValue(raw?: boolean): Full_Model {
        return raw
            ? this.childFormComponent$?.value?.form.getRawValue()
            : this.childFormComponent$?.value?.form?.value;
    };

    public formValueToRequestValue(value: Full_Model): Full_Model {
        const formComp = this.childFormComponent$?.value;
        if (formComp == null) return value;

        return formComp.formValueToRequestValue(value);
    }

    public getElementRef() {
        return this.childFormComponent$.value?.getElementRef() ?? this.el;
    }

    public updateView() {
        super.updateView();
        this.childFormComponent$.value?.updateView();
    }
}
