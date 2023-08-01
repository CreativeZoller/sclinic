import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, of, shareReplay } from "rxjs";
import { CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO } from "src/api/models";
import { TableHeader } from "src/app/components/table/table/table-header";
import { SkipSettingValueAccessorProviders } from "src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "src/app/modules/app-common/utility/base-selection-list-field/base-selection-list-field.directive";


type Full_Model = CoreModelsDTOsMasterDataDCTablesDCBookingAreaDTO;

@UntilDestroy()
@Component({
    selector: "app-schedule-generator-booking-area-selection-list-field",
    templateUrl: "./schedule-generator-booking-area-selection-list-field.component.html",
    styleUrls: ["./schedule-generator-booking-area-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ScheduleGeneratorBookingAreaSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    public baseResourceKey = "service.booking.area";
    public tableIdProperty = "dC_BookingAreaId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.booking.area.list.table.headers.name"),
            attributeName: "name",
        },
    ];

    public getTableData$ = () => of(this.initData.dC_BookingAreaList).pipe(
        map((list) => list.map(v => v.dto)),
        shareReplay(1),
    );
}
