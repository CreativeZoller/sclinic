import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { Full_Model_ClinicSelf } from "../../../models/clinic-x-self.mode";
import { filter, map, shareReplay } from "rxjs";


type Full_Model = Full_Model_ClinicSelf;

@UntilDestroy()
@Component({
    selector: "app-clinic-self-list-field",
    templateUrl: "./clinic-self-list-field.component.html",
    styleUrls: ["./clinic-self-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ClinicSelfListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "clinic.self";
    public tableIdProperty = "clinicXSelfId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("clinic.self.list.table.headers.selfName"),
            attributeName: "self",
            formatterFn: (value: Full_Model["self"]) => value?.selfName
        },
        {
            name: this.resourceService.resolve("clinic.self.list.table.headers.specialtyName"),
            attributeName: "specialty",
            formatterFn: (value: Full_Model["specialty"]) => value?.specialtyName
        },
        {
            name: this.resourceService.resolve("clinic.self.list.table.headers.clinicOrganizationUniteCode"),
            attributeName: "clinicOrganizationUniteCode",
        },
    ];

    public allClinicSelf$ = this.getValue$().pipe(
        map((value) => value?.map(v => v!) ?? []),
        filter(v => v != null),
        shareReplay(1),
    )
}
