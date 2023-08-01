import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { map, of, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { ServiceXSpecialty } from "../../../models/service-x-specialty.model";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";
import { MasterDataManagementService } from "../../../../../../../../api/services";


type Full_Model = NonNullable<ServiceXSpecialty["specialty"]>;

@UntilDestroy()
@Component({
    selector: "app-service-speciality-selection-list-field",
    templateUrl: "./service-speciality-selection-list-field.component.html",
    styleUrls: ["./service-speciality-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceSpecialitySelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "service.speciality";
    public tableIdProperty = "specialtyId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.speciality.list.table.headers.specialty.specialtyName"),
            attributeName: "specialtyName",
        },
        {
            name: this.resourceService.resolve("service.speciality.list.table.headers.specialty.specialtyCode"),
            attributeName: "specialtyCode",
        },
    ];

    public getTableData$ = () => this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({}).pipe(
        map(res => res?.businessObjectList ?? []),
        shareReplay(1),
    );
}
