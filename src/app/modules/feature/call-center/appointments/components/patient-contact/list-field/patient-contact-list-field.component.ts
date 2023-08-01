import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { filter, map, Observable, shareReplay } from "rxjs";
import { TableHeader } from "src/app/components/table/table/table-header";
import { SkipSettingValueAccessorProviders } from "src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseListFieldComponent } from "src/app/modules/app-common/utility/base-list-field/base-list-field.directive";
import { PatientXContact } from "src/app/modules/feature/master-data/patients/models/patient-x-contact.model";

type Full_Model = PatientXContact;

@UntilDestroy()
@Component({
    selector: "app-cc-patient-contact-list-field",
    templateUrl: "./patient-contact-list-field.component.html",
    styleUrls: ["./patient-contact-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class CcPatientContactListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "patient.contact";
    public tableIdProperty = "patientXContactId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("patient.contact.list.table.headers.dC_ContactTypeId"),
            attributeName: "dC_ContactTypeId",
            formatterFn: (value) => this.initData.dC_ContactTypeList.find(o => o.value === value)?.name,
        },
        {
            name: this.resourceService.resolve("patient.contact.list.table.headers.contactValue"),
            attributeName: "contactValue",
        },
    ];

    public allSelectedContactTypeIds$ = this.getValue$().pipe(
        map((value) => value?.map(v => v.dC_ContactTypeId!) ?? []),
        filter(v => v != null),
        shareReplay(1),
    )

    public canCreate$: Observable<boolean> = this.allSelectedContactTypeIds$.pipe(
        map(selectedIds => {
          const sourceListIds = this.initData.dC_ContactTypeList.map(sourceListId => sourceListId.value);
          return !(
            selectedIds.length === sourceListIds.length &&
            selectedIds.every(id => sourceListIds.includes(id))
          );
        })
    );
}
