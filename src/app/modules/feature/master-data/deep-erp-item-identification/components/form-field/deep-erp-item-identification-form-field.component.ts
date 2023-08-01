import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { InitPageData } from "../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { BaseControlValueAccessorWithForm } from "../../../../../app-common/utility/base-control-value-acessor-with-form/base-control-value-acessor-with-form.directive";
import { DeeperpItemIdentification } from "../../models/deep-erp-item-identification.model";


type Full_Model = DeeperpItemIdentification;

@UntilDestroy()
@Component({
    selector: "app-deep-erp-item-identification-form-field",
    templateUrl: "./deep-erp-item-identification-form-field.component.html",
    styleUrls: ["./deep-erp-item-identification-form-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepErpItemIdentificationFormFieldComponent extends BaseControlValueAccessorWithForm<Full_Model> {

    public activatedRoute = inject(ActivatedRoute);

    initData = this.activatedRoute.snapshot.data["init"] as InitPageData;
    public errorResourceKeyPrefix = "deep.erp.item.identification.form.errors";

    public form = new FormGroup({
        // Megnevezés a számlán
        invoiceItemName: new FormControl<Full_Model["invoiceItemName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // DEEP.ERP rendszerben item azonosító (Külső azonosító)
        deeperpItemNumber: new FormControl<Full_Model["deeperpItemNumber"]>(undefined, { nonNullable: true, validators: [Validators.required ] }),
        // ÁFA ügyviteeli kategória
        vatCategory: new FormControl<Full_Model["vatCategory"]>(undefined, { nonNullable: true, validators: [] }),
        // Cikk ügyviteli kategória
        dC_ItemProcurationalCategoryId: new FormControl<Full_Model["dC_ItemProcurationalCategoryId"]>(undefined, { nonNullable: true, validators: [] }),
        // VT/TESZOR szám
        cpaNumber: new FormControl<Full_Model["cpaNumber"]>(undefined, { nonNullable: true, validators: [] }),
        // Aktív flag.
        isDEEPERPActive: new FormControl<Full_Model["isDEEPERPActive"]>(false, { nonNullable: true, validators: [] }),
        // Alap mennyiségi egység
        defaultQuantity: new FormControl<Full_Model["defaultQuantity"]>(0, { nonNullable: true, validators: [] }),
        // Alap eladási mennyiségi egység
        defaultSaleQuantity: new FormControl<Full_Model["defaultSaleQuantity"]>(0, { nonNullable: true, validators: [] }),
        // Alap beszerzési mennyiségi egység
        defaultPurchaseQuantity: new FormControl<Full_Model["defaultPurchaseQuantity"]>(0, { nonNullable: true, validators: [] }),
        // Környezetvédelmi termékdíj
        environmentProductTax: new FormControl<Full_Model["environmentProductTax"]>(undefined, { nonNullable: true, validators: [] }),
        // MRP kalkuláció engedélyezett
        mrpCalculationAllowed: new FormControl<Full_Model["mrpCalculationAllowed"]>(undefined, { nonNullable: true, validators: [] }),
        // Jövedéki
        excise: new FormControl<Full_Model["excise"]>(undefined, { nonNullable: true, validators: [] }),
        // Jövedéki zárjegy termeléskor
        productionTaxStamp: new FormControl<Full_Model["productionTaxStamp"]>(undefined, { nonNullable: true, validators: [] }),
        // Skontó alkalmazható
        discountAllowed: new FormControl<Full_Model["discountAllowed"]>(undefined, { nonNullable: true, validators: [] }),
        // Kifutó termék
        outOfProduction: new FormControl<Full_Model["outOfProduction"]>(undefined, { nonNullable: true, validators: [] }),
        // Veszélyes áru
        hazardousProduct: new FormControl<Full_Model["hazardousProduct"]>(undefined, { nonNullable: true, validators: [] }),
        // Veszélyes áru korl.Mennyiség
        hazardousProductLimitQuantity: new FormControl<Full_Model["hazardousProductLimitQuantity"]>(undefined, { nonNullable: true, validators: [] }),
    });

    public readValue(): Full_Model {
        return this.form.getRawValue();
    }

    public writeValue(value?: Full_Model | undefined): void {
        this.form.reset();
        this.form.patchValue(value!);
    }
}
