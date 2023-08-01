import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, shareReplay } from "rxjs";
import { PriceTableStatusEnum } from "../../../../../../../api/enums";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { PriceTable } from "../../models/price-table.model";


type Full_Model = PriceTable;

@UntilDestroy()
@Component({
    selector: "app-price-table-form-create",
    templateUrl: "./price-table-form-create.component.html",
    styleUrls: ["./price-table-form-create.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTableFormCreateComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "price.table.form.create.errors";

    public form = new FormGroup({
        // Azonosító
        priceTableId: new FormControl<PriceTable["priceTableId"]>(0, { nonNullable: true, validators: [] }),
        // Ártábla neve
        priceTableName: new FormControl<PriceTable["priceTableName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Másolandó ártábla
        parentPriceTable: new FormControl<PriceTable["parentPriceTable"]>(undefined, { nonNullable: true, validators: [] }),
    });

    priceTableAutocomplete = {
        searhcFn$: (value: string) => {
            return this.masterDataManagementService.priceTableGetPriceTableByConditionPost({
                priceTableName: value || "",
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: PriceTable) => v?.priceTableName ?? "",

        getFormattedInputText: (v: PriceTable) => v?.priceTableName ?? "",
    };

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            parentPriceTable: undefined,
            parentPriceTableId: value?.parentPriceTable?.priceTableId,
            dC_PriceTableStatusId: PriceTableStatusEnum.DRAFT,
        };
    }
}
