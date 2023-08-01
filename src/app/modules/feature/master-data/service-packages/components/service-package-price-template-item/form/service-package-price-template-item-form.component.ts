import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServicePackageXPriceTemplateItem } from "../../../models/service-package-x-price-template-item.model";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, shareReplay } from "rxjs";
import { SelectOption } from "../../../../../../core/utility/types/select-option";


type Full_Model = ServicePackageXPriceTemplateItem;

@UntilDestroy()
@Component({
    selector: "app-service-package-price-template-item-form",
    templateUrl: "./service-package-price-template-item-form.component.html",
    styleUrls: ["./service-package-price-template-item-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePackagePriceTemplateItemFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "service.package.price.template.item.form.errors";

    private _allSelectedPriceTemplates$ = new BehaviorSubject<NonNullable<Full_Model["priceTemplate"]>[]>([]);
    @Input() public set allSelectedPriceTemplates(o: NonNullable<Full_Model["priceTemplate"]>[]) {
        this._allSelectedPriceTemplates$.next(o)
    }
    private _allPriceTemplates$ = new BehaviorSubject<NonNullable<Full_Model["priceTemplate"]>[]>([]);
    @Input() public set allPriceTemplates(o: NonNullable<Full_Model["priceTemplate"]>[]) {
        this._allPriceTemplates$.next(o)
    }

    public priceTemplateOptions$ = combineLatest([
        this._allPriceTemplates$,
        this._allSelectedPriceTemplates$,
        this.initialEditorData$,
    ]).pipe(
        map(([allPriceTemplates, allSelectedPriceTemplates, initialEditorData]) => {
            return allPriceTemplates.filter((pt) => {
                return !allSelectedPriceTemplates.some(spt => spt?.priceTemplateId === pt?.priceTemplateId)
                    || initialEditorData?.priceTemplate?.priceTemplateId === pt?.priceTemplateId
            }).map(pt => {
                return <SelectOption<NonNullable<Full_Model["priceTemplate"]>>>{
                    name: pt.priceTemplateName!,
                    value: pt,
                    idProperty: "priceTemplateId" as const,
                }
            })
        }),
        distinctUntilChanged(),
        shareReplay(1),
    );

    public form = new FormGroup({
        // Azonosító
        priceTemplateItemId: new FormControl<Full_Model["priceTemplateItemId"]>(0, { nonNullable: true, validators: [] }),
        // Ársablon
        priceTemplate: new FormControl<Full_Model["priceTemplate"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Ár
        price: new FormControl<Full_Model["price"]>(undefined, { nonNullable: true, validators: [Validators.min(0), Validators.required] }),
    });

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            priceTemplate: undefined,
            priceTemplateId: value?.priceTemplate?.priceTemplateId,
        };
    }
}
