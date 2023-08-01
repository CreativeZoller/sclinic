import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { Full_Model_ClinicRoom } from "../../../models/clinic-x-room.mode";


type Full_Model_Rooms = Full_Model_ClinicRoom;

@UntilDestroy()
@Component({
    selector: "app-clinic-room-list-field",
    templateUrl: "./clinic-room-list-field.component.html",
    styleUrls: ["./clinic-room-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ClinicRoomListFieldComponent extends BaseListFieldComponent<Full_Model_Rooms> {

    public baseResourceKey = "clinic.room";
    public tableIdProperty = "roomId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;
    @Input() public clinicName: string | undefined;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("clinic.room.list.table.headers.dC_FloorId"),
            attributeName: "dC_FloorId",
            formatterFn: (v) => this.initData.dC_FloorList.find((item) => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("clinic.room.list.table.headers.roomNumber"),
            attributeName: "roomNumber",
        },
    ];
}
