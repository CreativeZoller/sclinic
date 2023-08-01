import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";
import { Service_MedicalEmployee } from "../../../models/service-x-medical-emplyoee.model";


type Full_Model = Service_MedicalEmployee;

@UntilDestroy()
@Component({
    selector: "app-service-specialty-doctor-selection-list-field",
    templateUrl: "./service-specialty-doctor-selection-list-field.component.html",
    styleUrls: ["./service-specialty-doctor-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceSpecialtyDoctorSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    public baseResourceKey = "service.specialty.doctor";
    public tableIdProperty = "medicalEmployeeId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.specialty.doctor.list.table.headers.dC_TitleTypeId"),
            attributeName: "dC_TitleTypeId",
            formatterFn: (v) => this.initData.dC_TitleTypeList.find((item) => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.specialty.doctor.list.table.headers.lastName"),
            attributeName: "lastName",
        },
        {
            name: this.resourceService.resolve("service.specialty.doctor.list.table.headers.firstName"),
            attributeName: "firstName",
        },
        {
            name: this.resourceService.resolve("service.specialty.doctor.list.table.headers.stampNumber"),
            attributeName: "stampNumber",
        },
    ];

    private allSpecialtyDoctors$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() set allSpecialtyDoctors(list: Full_Model[] | null | undefined) {
        this.allSpecialtyDoctors$.next(list ?? []);
    };

    public getTableData$ = () => this.allSpecialtyDoctors$
}
