import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map, Observable } from "rxjs";
import { BasePriceTemplateXPriceTemplateItemGenericListComponent } from "../generic-list/price-template-x-price-template-item-generic-list.component";
import { Service } from "../../../../../services/models/service.model";
import { MasterDataManagementService } from "../../../../../../../../../api/services";


type Model = Service & { specialtyName: string };

@UntilDestroy()
@Component({
    selector: "app-price-template-x-price-template-item-of-service-list",
    templateUrl: "./price-template-x-price-template-item-of-service-list.component.html",
    styleUrls: ["./price-template-x-price-template-item-of-service-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTemplateXPriceTemplateItemOfServiceListComponent extends BasePriceTemplateXPriceTemplateItemGenericListComponent<Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey: string = "price.template.of.service";
    public tableIdProperty: keyof Model = "serviceId";
    public getPriceTemplateItemsOfModel = (model: Model) => model.smallPriceList ?? [];
    public modelSpecificTableHeaders: TableHeader<Model>[] = [
        {
            name: this.resourceService.resolve("price.template.of.service.list.table.headers.dC_ServiceCategoryId"),
            formatterFn: (_, row: Model) => {
                return this.initData.dC_ServiceCategoryList.find(item => item.value === row?.dC_ServiceCategoryId)?.name;
            },
        },
        {
            name: this.resourceService.resolve("price.template.of.service.list.table.headers.specialtyXService"),
            formatterFn: (_, row: Model) => row?.specialtyName,
        },
        {
            name: this.resourceService.resolve("price.template.of.service.list.table.headers.serviceName"),
            formatterFn: (_, row: Model) => row?.serviceName,
        },
        {
            name: this.resourceService.resolve("price.template.of.service.list.table.headers.dC_ServicePackageTypeId"),
            formatterFn: () => this.resourceService.resolve("general.enum.label.ServicePackageType.ELEMENTAL"),
        }
    ];

    @Input() public getModelList$ = (priceTableId?: number) : Observable<Model[]> => {
        return this.masterDataManagementService.serviceGetServiceByConditionPost({
            needPricesForPriceTable: true,
            priceTableId: priceTableId,
            needSpecialty: true,
            // TODO needs
        }).pipe(
            map(res => {
                if (res?.businessObjectList) {
                    return res.businessObjectList.flatMap(service => {
                        // Assuming service has specialtyXService property
                        if (service.specialtyXService) {
                            // Map each specialtyXService to a new service object
                            return service.specialtyXService.map(specialty => {
                                return {
                                    ...service,
                                    specialtyId: specialty.specialtyId,
                                    specialtyName: specialty.specialty?.specialtyName ?? ''
                                };
                            });
                        } else {
                            // If there is no specialtyXService, skip the service object
                            return [];
                        }
                    });
                } else {
                    return [];
                }
            }),
        );
    };

}

