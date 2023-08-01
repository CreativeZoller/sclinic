import { ChangeDetectionStrategy, Component } from "@angular/core";
import { map, of, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { MedicalEmployeeXBookingArea } from "../../../models/medical-employee-x-booking-area.model";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";


type Full_Model = MedicalEmployeeXBookingArea;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-booking-area-selection-list-field",
    templateUrl: "./medical-employee-booking-area-selection-list-field.component.html",
    styleUrls: ["./medical-employee-booking-area-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class MedicalEmployeeBookingAreaSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    public baseResourceKey = "medical.employee.booking.area";
    public tableIdProperty = "dC_BookingAreaId";

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("medical.employee.booking.area.list.table.headers.name"),
            attributeName: "name",
        },
    ];

    public getTableData$ = () => of(this.initData.dC_BookingAreaList).pipe(
        map((list) => list.map(v => v.dto)),
        shareReplay(1),
    );
}
