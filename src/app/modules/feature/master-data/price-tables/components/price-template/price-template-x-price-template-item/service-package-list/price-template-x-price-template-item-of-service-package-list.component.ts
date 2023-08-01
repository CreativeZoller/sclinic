import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, Observable } from "rxjs";
import { BasePriceTemplateXPriceTemplateItemGenericListComponent } from "../generic-list/price-template-x-price-template-item-generic-list.component";
// TODO amint megvan a ServicePackage feature, onnan húzzuk be!
// import { ServicePackage } from "../../../../../service-packages/models/service-package.model";
import { ServiceSubPackage as ServicePackage } from "../../../../../service-sub-packages/models/service-sub-package.model";
import { MasterDataManagementService } from "../../../../../../../../../api/services";
import { ServicePackageTypeEnum } from "../../../../../../../../../api/enums";


type Model = ServicePackage;

@UntilDestroy()
@Component({
    selector: "app-price-template-x-price-template-item-of-service-package-list",
    templateUrl: "./price-template-x-price-template-item-of-service-package-list.component.html",
    styleUrls: ["./price-template-x-price-template-item-of-service-package-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTemplateXPriceTemplateItemOfServicePackageListComponent extends BasePriceTemplateXPriceTemplateItemGenericListComponent<Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey: string = "price.template.of.service.package";
    public tableIdProperty: keyof Model = "servicePackageId";
    public getPriceTemplateItemsOfModel = (model: Model) => model.smallPriceList ?? [];
    public modelSpecificTableHeaders: TableHeader<Model>[] = [
        {
            name: this.resourceService.resolve("price.template.of.service.package.list.table.headers.dC_ServicePackageCategoryId"),
            formatterFn: (_, row: Model) => {
                return this.initData.dC_ServicePackageCategoryList.find(item => item.value === row?.dC_ServicePackageCategoryId)?.name;
            },
        },
        {
            name: this.resourceService.resolve("price.template.of.service.package.list.table.headers.servicePackageName"),
            formatterFn: (_, row: Model) => row?.servicePackageName,
        },
        {
            name: this.resourceService.resolve("price.template.of.service.package.list.table.headers.dC_ServicePackageTypeId"),
            formatterFn: (_, row: Model) => this.initData.dC_ServicePackageTypeList.find(item => item.value === row?.dC_ServicePackageTypeId)?.name,
        },
    ];
    @Input() public getModelList$ = (priceTableId?: number) : Observable<Model[]> => {
        return this.masterDataManagementService.servicePackageGetServicePackageByConditionPost({
            needPricesForPriceTable: true,
            priceTableId: priceTableId,
            dC_ServicePackageTypeIdList: [ServicePackageTypeEnum.PACKAGE],
            // TODO needs
        }).pipe(
            map(res => res?.businessObjectList ?? []),
        );
    };
}

