import { ChangeDetectionStrategy, Component } from "@angular/core";
import { map, of, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { ServicePackageXBookingArea } from "../../../models/service-package-x-booking-area.model";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";


type Full_Model = ServicePackageXBookingArea;

@UntilDestroy()
@Component({
    selector: "app-service-package-booking-area-selection-list-field",
    templateUrl: "./service-package-booking-area-selection-list-field.component.html",
    styleUrls: ["./service-package-booking-area-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServicePackageBookingAreaSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    public baseResourceKey = "service.package.booking.area";
    public tableIdProperty = "dC_BookingAreaId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.package.booking.area.list.table.headers.name"),
            attributeName: "name",
        },
    ];

    public getTableData$ = () => of(this.initData.dC_BookingAreaList).pipe(
        map((list) => list.map(v => v.dto)),
        shareReplay(1),
    );
}
