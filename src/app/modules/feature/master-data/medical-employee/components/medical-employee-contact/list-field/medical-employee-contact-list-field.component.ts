import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { MedicalEmployeeXContact } from "../../../models/medical-employee-x-contact.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { filter, map, shareReplay } from "rxjs";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = MedicalEmployeeXContact;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-contact-list-field",
    templateUrl: "./medical-employee-contact-list-field.component.html",
    styleUrls: ["./medical-employee-contact-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class MedicalEmployeeContactListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "medical.employee.contact";
    public tableIdProperty = "medicalEmployeeXContactId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("medical.employee.contact.list.table.headers.dC_ContactTypeId"),
            attributeName: "dC_ContactTypeId",
            formatterFn: (value) => this.initData.dC_ContactTypeList.find(o => o.value === value)?.name,
        },
        {
            id: 2,
            name: this.resourceService.resolve("medical.employee.contact.list.table.headers.contactValue"),
            attributeName: "contactValue",
        },
    ];

    public allSelectedContactTypeIds$ = this.getValue$().pipe(
        map((value) => value?.map(v => v.dC_ContactTypeId!) ?? []),
        filter(v => v != null),
        shareReplay(1),
    )
}
