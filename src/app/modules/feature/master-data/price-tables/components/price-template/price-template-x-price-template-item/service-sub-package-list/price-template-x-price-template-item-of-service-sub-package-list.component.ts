import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, Observable } from "rxjs";
import { BasePriceTemplateXPriceTemplateItemGenericListComponent } from "../generic-list/price-template-x-price-template-item-generic-list.component";
import { ServiceSubPackage } from "../../../../../service-sub-packages/models/service-sub-package.model";
import { MasterDataManagementService } from "../../../../../../../../../api/services";
import { ServicePackageTypeEnum } from "../../../../../../../../../api/enums";


type Model = ServiceSubPackage;

@UntilDestroy()
@Component({
    selector: "app-price-template-x-price-template-item-of-service-sub-package-list",
    templateUrl: "./price-template-x-price-template-item-of-service-sub-package-list.component.html",
    styleUrls: ["./price-template-x-price-template-item-of-service-sub-package-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTemplateXPriceTemplateItemOfServiceSubPackageListComponent extends BasePriceTemplateXPriceTemplateItemGenericListComponent<Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey: string = "price.template.of.service.sub.package";
    public tableIdProperty: keyof Model = "servicePackageId";
    public getPriceTemplateItemsOfModel = (model: Model) => model.smallPriceList ?? [];
    public modelSpecificTableHeaders: TableHeader<Model>[] = [
        {
            name: this.resourceService.resolve("price.template.of.service.sub.package.list.table.headers.dC_SubServicePackageCategoryId"),
            formatterFn: (_, row: Model) => {
                return this.initData.dC_SubServicePackageCategoryList.find(item => item.value === row?.dC_SubServicePackageCategoryId)?.name;
            },
        },
        {
            name: this.resourceService.resolve("price.template.of.service.sub.package.list.table.headers.servicePackageName"),
            formatterFn: (_, row: Model) => row?.servicePackageName,
        },
        {
            name: this.resourceService.resolve("price.template.of.service.sub.package.list.table.headers.dC_ServicePackageTypeId"),
            formatterFn: (_, row: Model) => this.initData.dC_ServicePackageTypeList.find(item => item.value === row?.dC_ServicePackageTypeId)?.name,
        },
    ];
    @Input() public getModelList$ = (priceTableId?: number) : Observable<Model[]> => {
        return this.masterDataManagementService.servicePackageGetServicePackageByConditionPost({
            needPricesForPriceTable: true,
            priceTableId: priceTableId,
            dC_ServicePackageTypeIdList: [ServicePackageTypeEnum.SUB_PACKAGE],
            // TODO needs
        }).pipe(
            map(res => res?.businessObjectList ?? []),
        );
    };
}

