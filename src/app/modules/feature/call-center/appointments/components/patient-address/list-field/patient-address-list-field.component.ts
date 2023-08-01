import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { filter, map, shareReplay } from "rxjs";
import { TableHeader } from "src/app/components/table/table/table-header";
import { SkipSettingValueAccessorProviders } from "src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseListFieldComponent } from "src/app/modules/app-common/utility/base-list-field/base-list-field.directive";
import { PatientXAddress } from "src/app/modules/feature/master-data/patients/models/patient-x-address.model";


type Full_Model = PatientXAddress;

@UntilDestroy()
@Component({
    selector: "app-cc-patient-address-list-field",
    templateUrl: "./patient-address-list-field.component.html",
    styleUrls: ["./patient-address-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class CcPatientAddressListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "patient.address";
    public tableIdProperty = "patientXAddressId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.foreignAddress"),
            attributeName: "foreignAddress",
            formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.dC_PatientAddressTypeId"),
            attributeName: "dC_PatientAddressTypeId",
            formatterFn: (value) => this.initData.dC_PatientAddressTypeList.find(o => o.value === value)?.name,
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.dC_City.postCode"),
            attributeName: "address.dC_City.postCode",
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.dC_City.name"),
            attributeName: "address.dC_City.name",
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.streetName"),
            attributeName: "address.streetName",
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.dC_PublicPlaceCategoryId"),
            attributeName: "address.dC_PublicPlaceCategoryId",
            formatterFn: (value) => this.initData.dC_PublicPlaceCategoryList.find(o => o.value === value)?.name,
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.buildingNumber"),
            attributeName: "address.buildingNumber",
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.building"),
            attributeName: "address.building",
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.staircase"),
            attributeName: "address.staircase",
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.floor"),
            attributeName: "address.floor",
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.door"),
            attributeName: "address.door",
        },
        {
            name: this.resourceService.resolve("patient.address.list.table.headers.address.lotNumber"),
            attributeName: "address.lotNumber",
        },
    ];

    public allSelectedPatientAddressTypeIds$ = this.getValue$().pipe(
        map((value) => value?.map(v => v.dC_PatientAddressTypeId!) ?? []),
        filter(v => v != null),
        shareReplay(1),
    )
}
