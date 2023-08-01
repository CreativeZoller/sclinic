import { ChangeDetectionStrategy, Component } from "@angular/core";
import { map, of, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";
import { ClinicXBookingArea } from "../../../models/clinic-x-booking-area.model";


type Full_Model = ClinicXBookingArea;

@UntilDestroy()
@Component({
    selector: "app-clinic-booking-area-selection-list-field",
    templateUrl: "./clinic-booking-area-selection-list-field.component.html",
    styleUrls: ["./clinic-booking-area-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ClinicBookingAreaSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    public baseResourceKey = "clinic.booking.area";
    public tableIdProperty = "dC_BookingAreaId";

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("clinic.booking.area.list.table.headers.bookingAreaName"),
            attributeName: "name",
        },
    ];

    public getTableData$ = () => of(this.initData.dC_BookingAreaList).pipe(
        map((list) => list.map(v => v.dto)),
        shareReplay(1),
    );
}
