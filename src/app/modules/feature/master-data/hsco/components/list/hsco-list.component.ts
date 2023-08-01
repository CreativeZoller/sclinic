import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { map, Observable, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { MasterDataManagementService } from "src/api/services";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { HSCO_Model } from "../../models/hsco.model";


type Grid_Model = HSCO_Model;
type Full_Model = HSCO_Model;

@UntilDestroy()
@Component({
    selector: "app-hsco-list",
    templateUrl: "./hsco-list.component.html",
    styleUrls: ["./hsco-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HSCOListComponent {

    protected masterDataManagementService = inject(MasterDataManagementService);
    protected resourceService = inject(ResourceService);
    protected cdr = inject(ChangeDetectorRef);

    public baseResourceKey = "hsco";
    public tableIdProperty = "hscoId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("hsco.list.table.headers.hscoNumber"),
            attributeName: "hscoNumber",
        },
        {
            name: this.resourceService.resolve("hsco.list.table.headers.hscoName"),
            attributeName: "hscoName",
        },
    ]

    public getTableData$: () => Observable<Grid_Model[]> = () => {
        return this.masterDataManagementService
            .hSCOGetHSCOByConditionPost({
                needOccupationalHealthGroupedList: true,
                needOccupationalHealth: true,
                hscoLevel: [4],
            })
            .pipe(
                map((res: any) => res.businessObjectList ?? []),
            );
      };


    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({ formValue }) => {
        return this.masterDataManagementService.occupationalHealthCreateOrUpdateOccupationalHealthPost({
            businessObjectList: formValue.occupationalHealth ?? [],
            saveServiceByGroupedList: true,
        }).pipe(
            map((res) => res.businessObjectList),
            shareReplay(1),
        );
    }
}
