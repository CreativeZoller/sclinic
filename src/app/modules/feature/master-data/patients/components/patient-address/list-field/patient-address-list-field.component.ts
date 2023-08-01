import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { PatientXAddress } from "../../../models/patient-x-address.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { filter, map, shareReplay } from "rxjs";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = PatientXAddress;

@UntilDestroy()
@Component({
    selector: "app-patient-address-list-field",
    templateUrl: "./patient-address-list-field.component.html",
    styleUrls: ["./patient-address-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class PatientAddressListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "patient.address";
    public tableIdProperty = "patientXAddressId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("patient.address.list.table.headers.foreignAddress"),
            attributeName: "foreignAddress",
            formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
        {
            id: 2,
            name: this.resourceService.resolve("patient.address.list.table.headers.dC_PatientAddressTypeId"),
            attributeName: "dC_PatientAddressTypeId",
            formatterFn: (value) => this.initData.dC_PatientAddressTypeList.find(o => o.value === value)?.name,
        },
        {
            id: 3,
            name: this.resourceService.resolve("patient.address.list.table.headers.address.dC_City.postCode"),
            attributeName: "address.dC_City.postCode",
        },
        {
            id: 4,
            name: this.resourceService.resolve("patient.address.list.table.headers.address.dC_City.name"),
            attributeName: "address.dC_City.name",
        },
        {
            id: 5,
            name: this.resourceService.resolve("patient.address.list.table.headers.address.streetName"),
            attributeName: "address.streetName",
        },
        {
            id: 6,
            name: this.resourceService.resolve("patient.address.list.table.headers.address.dC_PublicPlaceCategoryId"),
            attributeName: "address.dC_PublicPlaceCategoryId",
            formatterFn: (value) => this.initData.dC_PublicPlaceCategoryList.find(o => o.value === value)?.name,
        },
        {
            id: 7,
            name: this.resourceService.resolve("patient.address.list.table.headers.address.buildingNumber"),
            attributeName: "address.buildingNumber",
        },
        {
            id: 8,
            name: this.resourceService.resolve("patient.address.list.table.headers.address.building"),
            attributeName: "address.building",
        },
        {
            id: 9,
            name: this.resourceService.resolve("patient.address.list.table.headers.address.staircase"),
            attributeName: "address.staircase",
        },
        {
            id: 10,
            name: this.resourceService.resolve("patient.address.list.table.headers.address.floor"),
            attributeName: "address.floor",
        },
        {
            id: 11,
            name: this.resourceService.resolve("patient.address.list.table.headers.address.door"),
            attributeName: "address.door",
        },
        {
            id: 12,
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
