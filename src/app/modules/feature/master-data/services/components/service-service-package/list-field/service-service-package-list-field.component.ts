import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXServicePackage } from "../../../models/service-x-service-package.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { map, Observable, of, shareReplay, tap } from "rxjs";


type Full_Model = ServiceXServicePackage;

@UntilDestroy()
@Component({
    selector: "app-service-service-package-list-field",
    templateUrl: "./service-service-package-list-field.component.html",
    styleUrls: ["./service-service-package-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceServicePackageListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "service.service.package";
    public tableIdProperty = "servicePackageXServiceId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.service.package.list.table.headers.servicePackage.servicePackageName"),
            attributeName: "servicePackage.servicePackageName",
        },
        {
            name: this.resourceService.resolve("service.service.package.list.table.headers.servicePackage.dC_ServicePackageCategoryId"),
            attributeName: "servicePackage.dC_ServicePackageCategoryId",
            formatterFn: (v) => this.initData.dC_ServicePackageCategoryList.find(item => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.service.package.list.table.headers.servicePackage.dC_ServicePackageTypeId"),
            attributeName: "servicePackage.dC_ServicePackageTypeId",
            formatterFn: (v) => this.initData.dC_ServicePackageTypeList.find(item => item.value === v)?.name,
        },
    ];

    // Convert JunctionDTO to ModelDTO for form to work
    public getFullModelFromGridModel$ = (gridRowData: Full_Model) => of(gridRowData.servicePackage);

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model["servicePackage"]>) => Observable<any> = ({gridRowData, formValue}) => {
        return this.masterDataManagementService.servicePackageCreateOrUpdateServicePackagePost({
            businessObjectList: [ formValue! ],
        }).pipe(
            map((res) => res.businessObjectList),
            tap(() => {
                const value = this.listFieldComponent.value ?? [];

                const indexToUpdate = (gridRowData as any)?._index as number | undefined;
                this.listFieldComponent.changeValue(
                    value.map((v, i) => {
                        return i !== indexToUpdate ? v : { ...v, servicePackage: formValue };
                    })
                );
            }),
            shareReplay(1),
        )
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Full_Model, Full_Model["servicePackage"]>) => Observable<any> = ({gridRowData}) => {
        return this.masterDataManagementService.servicePackageDeleteServicePackageDelete({
            businessObjectList: [ gridRowData?.servicePackageId! ],
        }).pipe(
            tap(() => {
                const value = this.listFieldComponent.value ?? [];

                const indexToRemove = (gridRowData as any)?._index as number | undefined;
                this.changeValue(
                    value.filter((_, i) => i !== indexToRemove)
                );
            }),
            shareReplay(1),
        );
    }
}
