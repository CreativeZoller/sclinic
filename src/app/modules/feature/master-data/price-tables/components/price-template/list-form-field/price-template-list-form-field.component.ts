import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, of } from "rxjs";
import { FormModalComponent } from "../../../../../../app-common/form-modal/components/form-modal/form-modal.component";
import { BaseControlValueAccessorWithForm } from "../../../../../../app-common/utility/base-control-value-acessor-with-form/base-control-value-acessor-with-form.directive";
import { ResourceService } from "../../../../../../core/resource/services/resource.service";
import { PriceTemplate } from "../../../models/price-template.model";
import { BasePriceTemplateXPriceTemplateItemGenericListComponent } from "../price-template-x-price-template-item/generic-list/price-template-x-price-template-item-generic-list.component";


export const BASE_PRICE_TEMPLATE_INDEX = -2;
export const EUR_PRICE_TEMPLATE_INDEX = -1;

@UntilDestroy()
@Component({
    selector: "app-price-template-list-form-field",
    templateUrl: "./price-template-list-form-field.component.html",
    styleUrls: ["./price-template-list-form-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTemplateListFormFieldComponent extends BaseControlValueAccessorWithForm<PriceTemplate[]> {

    private resourceService = inject(ResourceService);

    @Input() priceTableId: number | undefined | null;

    protected priceTemplates$ = new BehaviorSubject<PriceTemplate[]>([]);

    public form = new FormGroup({
        // Cikk típusú PriceTemplate-ek
        itemPriceTemplates: new FormControl<PriceTemplate[]>([], { nonNullable: true, validators: [] }),
        // Szolgáltatás típusú PriceTemplate-ek
        servicePriceTemplates: new FormControl<PriceTemplate[]>([], { nonNullable: true, validators: [] }),
        // Alcsomag típusú PriceTemplate-ek
        serviceSubPackagePriceTemplates: new FormControl<PriceTemplate[]>([], { nonNullable: true, validators: [] }),
        // Csomag típusú PriceTemplate-ek
        servicePackagePriceTemplates: new FormControl<PriceTemplate[]>([], { nonNullable: true, validators: [] }),
    });

    public readValue(): PriceTemplate[] {
        const value = this.form.value;

        return this.priceTemplates$.value.map((pt, ptIndex) => {
            return <PriceTemplate>{
                ...pt,
                priceTemplateItem: Object.values(value)
                    .flatMap(priceTemplates => priceTemplates[ptIndex])
                    .flatMap(priceTemplate => priceTemplate?.priceTemplateItem ?? [])
                    .filter(v => v != null),
            };
        });
    }

    public writeValue(value?: PriceTemplate[] | undefined): void {
        this.priceTemplates$.next(value ?? []);
        this.form.updateValueAndValidity();
    }

    private getNextAvailablePriceTemplateCopyName(originalName: string, priceTemplateList: PriceTemplate[]) {
        const reservedNames = priceTemplateList.map(pt => pt.priceTemplateName ?? "").filter(name => name.includes(originalName));
        reservedNames.push("");

        let newName: string = "";
        for(let i = 0; reservedNames.includes(newName); newName = `${originalName} (${++i})`);

        return newName;
    }

    @ViewChildren("priceTemplateItemListComponent") private priceTemplateItemListComponent: QueryList<BasePriceTemplateXPriceTemplateItemGenericListComponent<any>>;
    public onCopyPriceTemplateAtIndex(index: number) {
        if(this.actionsDisabled) return;

        // Create new PriceTemplate
        const newPriceTemplate = {
            ...this.priceTemplates$.value[index],
            priceTemplateId: 0,
            priceTableId: this.priceTableId ?? undefined,
            parentPriceTemplateId: undefined,//BE oldali másolás miatt volt csak, de ez átkerült FE-re szóval nem kell megadni
        };

        // Generate copied name
        const nameToCopy = (index === EUR_PRICE_TEMPLATE_INDEX) ? this.resourceService.resolve("price.template.list.table.headers.basePriceEUR")
            : (index === BASE_PRICE_TEMPLATE_INDEX) ? this.resourceService.resolve("price.template.list.table.headers.basePrice")
            : newPriceTemplate.priceTemplateName ?? "";
        newPriceTemplate.priceTemplateName = this.getNextAvailablePriceTemplateCopyName(nameToCopy, this.priceTemplates$.value ?? []);

        // Apply changes to stored PriceTemplate list
        this.priceTemplates$.next([ ...this.priceTemplates$.value, newPriceTemplate ]);
        this.form.updateValueAndValidity();
        this.cdr.markForCheck();

        // Notify child list components to copy prices properly
        for (const comp of this.priceTemplateItemListComponent) comp.onCopyPriceTemplateAtIndex(index);
    }

    @ViewChild("priceTemplateFormModal") private formModalComponent: FormModalComponent<PriceTemplate>;
    public onEditPriceTemplateAtIndex(index: number) {
        if(this.actionsDisabled) return;

        const priceTemplate = this.priceTemplates$.value[index];

        this.formModalComponent.handleSave$ = (formValue) => {
            const newPriceTemplatesValue = [ ...this.priceTemplates$.value ];
            newPriceTemplatesValue[index] = {
                ...this.priceTemplates$.value[index],
                ...formValue,
            };
            this.priceTemplates$.next(newPriceTemplatesValue);
            this.form.updateValueAndValidity();
            this.cdr.markForCheck();

            return of(null);
        }
        this.formModalComponent.modalTitle = this.resourceService.resolve("price.template.editor.title.edit");
        this.formModalComponent.saveButtonLabel = this.resourceService.resolve("general.action.label.save");
        this.formModalComponent.dismissButtonLabel = this.resourceService.resolve("general.action.label.cancel");
        this.formModalComponent.initFormValue = priceTemplate;
        this.formModalComponent.open();
    }

    public onChangePriceTemplates(
        key: keyof typeof this.form.value,
        list: PriceTemplate[]
    ) {
        this.form.patchValue({ [key]: list });
    }

    protected priceTemplatesLoadingCount = 0;
    protected onPriceTemplatesLoadingChanged(isLoading: boolean) {
        this.priceTemplatesLoadingCount += isLoading ? +1 : -1;
    }
    protected priceTemplatesLoadingErrorCount = 0;
    protected onHasPriceTemplatesLoadingErrorChanged(hasError: boolean) {
        this.priceTemplatesLoadingErrorCount += hasError ? +1 : -1;
    }

    @HostBinding("class.actions-disabled")
    protected get actionsDisabled() { return this.priceTemplatesLoadingCount > 0 || this.priceTemplatesLoadingErrorCount > 0; }
}
