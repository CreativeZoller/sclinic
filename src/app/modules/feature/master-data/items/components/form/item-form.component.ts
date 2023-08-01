import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { isBetweenDateRange } from "../../../../../core/utility/validators/date.validator";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { Item } from "../../models/item.model";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { BehaviorSubject, map, shareReplay, startWith } from "rxjs";
import { CoreModelsDTOsMasterDataMainTablesPartnerDTO, CoreModelsDTOsMasterDataMainTablesPriceTableDTO } from "../../../../../../../api/models";


type Full_Model = Item;

@UntilDestroy()
@Component({
    selector: "app-item-form",
    templateUrl: "./item-form.component.html",
    styleUrls: ["./item-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "item.form.errors";

    private parent$ = new BehaviorSubject<Full_Model | null | undefined>(undefined);
    @Input() set parent(parent: Full_Model | null | undefined) {
        this.parent$.next(parent);
    };

    @Input() nestingLevel: number = 0;


    public activePriceTable$ = new BehaviorSubject<CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined>(undefined);
    @Input() set activePriceTable(activePriceTable: CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined | null) {
        this.activePriceTable$.next(activePriceTable ?? undefined);
    }

    dc_DefaultItemStatus = (this.initData.dC_ItemStatusList.find(x => x.dto.isDefault)?.value || undefined);

    public form = new FormGroup({
        // Azonosító
        itemId: new FormControl<Full_Model["itemId"]>(0, { nonNullable: true, validators: [] }),
        // Cikk neve
        itemName: new FormControl<Full_Model["itemName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Státusz
        dC_ItemStatusId: new FormControl<Full_Model["dC_ItemStatusId"]>(this.dc_DefaultItemStatus, { nonNullable: true, validators: [Validators.required] }),
        // Cikkszám
        itemNumber: new FormControl<Full_Model["itemNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Kategória
        dC_ItemCategoryId: new FormControl<Full_Model["dC_ItemCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Eszköz típusa
        dC_ItemTypeId: new FormControl<Full_Model["dC_ItemTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Érvényességi dátum
        validityDate: new FormControl<Full_Model["validityDate"]>(undefined, { nonNullable: true, validators: [isBetweenDateRange(undefined, 'experiodDate')] }),
        // Lejárati dátum
        expirationDate: new FormControl<Full_Model["expirationDate"]>(undefined, { nonNullable: true, validators: [isBetweenDateRange('validityDate', undefined)] }),
        // Gyári szám
        manufacturingNumber: new FormControl<Full_Model["manufacturingNumber"]>(undefined, { nonNullable: true, validators: [] }),
        // Beszállító Partner Azonosító
        partnerId: new FormControl<Full_Model["partnerId"]>(undefined, { nonNullable: true, validators: [] }),
        // Beszállító Partner
        partner: new FormControl<Full_Model["partner"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Beszerzési ár
        purchasePrice: new FormControl<Full_Model["purchasePrice"]>(0, { nonNullable: true, validators: [] }),
        // Lista ár
        sellingPrice: new FormControl<Full_Model["sellingPrice"]>(0, { nonNullable: true, validators: [Validators.required] }),
        // Választható cikk szolgáltatás kódolásnál
        isSelectableItemWhenBooking: new FormControl<Full_Model["isSelectableItemWhenBooking"]>(false, { nonNullable: true, validators: [Validators.required] }),

        // DEEP_ERP field
        deeperpItemIdentification: new FormControl<Full_Model["deeperpItemIdentification"]>(undefined, { nonNullable: true, validators: [] }),

        // Árak
        priceTemplateItem: new FormControl<Full_Model["priceTemplateItem"]>(undefined, { nonNullable: true, validators: [] }),

        // Alszám megnevezés.
        subItemName: new FormControl<Full_Model["subItemName"]>(undefined, { nonNullable: true, validators: [] }),
        //  Alszám: 01-99
        subItemNumber: new FormControl<Full_Model["subItemNumber"]>({ value: undefined, disabled: true} , { nonNullable: true, validators: [] }),

        // Alszám
        subItems: new FormControl<Full_Model["subItems"]>(undefined, { nonNullable: true, validators: [] }),

        // Szülő Azonosító
        parentItemId: new FormControl<Full_Model["parentItemId"]>(undefined, { nonNullable: true, validators: [] }),

        // Szülő
        parentItem: new FormControl<Full_Model["parentItem"]>(undefined, { nonNullable: true, validators: [] }),
    });

    partnerAutocomplete = {
        searhcFn$: (value: string) => {
            return this.masterDataManagementService.partnerGetPartnerByConditionPost({
                companyName: value,
                needPartnerData: true,
                needBisnode: false,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesPartnerDTO) => v?.company?.fullName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesPartnerDTO) => v?.company?.fullName ?? "",
        getFormattedInputValue: (v: CoreModelsDTOsMasterDataMainTablesPartnerDTO) => v?.partnerId,
    };

    public ngOnInit() {
        this.parent$.pipe(
            untilDestroyed(this),
        ).subscribe(() => {
            // Call setFormValue again to update values by parent value
            this.setFormValue(this.initialEditorData$.value);
        })
    }

    public getFormValue(raw?: boolean | undefined): Full_Model {
        const value = super.getFormValue(raw);

        return {
            ...value,
            partnerId: value.partner?.partnerId,
        }
    }

    public setFormValue(data: Full_Model | undefined | null) {
        const parent = this.parent$.value;

        super.setFormValue({
            ...data,
            itemName: data?.itemName ?? parent?.itemName,
            itemNumber: data?.itemNumber ?? parent?.itemNumber,
            dC_ItemCategoryId: data?.dC_ItemCategoryId ?? parent?.dC_ItemCategoryId,
            dC_ItemTypeId: data?.dC_ItemTypeId ?? parent?.dC_ItemTypeId,
            parentItemId: data?.parentItemId ?? parent?.itemId,
            deeperpItemIdentification: {
                ...data?.deeperpItemIdentification,
                deeperpItemNumber: data?.deeperpItemIdentification?.deeperpItemNumber ?? parent?.deeperpItemIdentification?.deeperpItemNumber,
                invoiceItemName: data?.deeperpItemIdentification?.invoiceItemName ?? parent?.deeperpItemIdentification?.invoiceItemName,
            }
        });
    };
}
