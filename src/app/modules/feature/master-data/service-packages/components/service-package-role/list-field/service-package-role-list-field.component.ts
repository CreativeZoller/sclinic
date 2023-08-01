import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServicePackageXRole } from "../../../models/service-package-x-role.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { filter, map, Observable, shareReplay } from "rxjs";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = ServicePackageXRole;

@UntilDestroy()
@Component({
    selector: "app-service-package-role-list-field",
    templateUrl: "./service-package-role-list-field.component.html",
    styleUrls: ["./service-package-role-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServicePackageRoleListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "service.package.role";
    public tableIdProperty = "servicePackageXRoleId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.package.role.list.table.headers.roleId"),
            attributeName: "roleId",
            formatterFn: (v) => this.initData.roles.find(item => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.package.role.list.table.headers.percentage"),
            attributeName: "percentage",
        },
    ];

    public allSelectedRoleIds$ = this.getValue$().pipe(
        map((value) => value?.map(v => v.roleId!) ?? []),
        filter(v => v != null),
        shareReplay(1),
    )

    public canCreate$: Observable<boolean> = this.allSelectedRoleIds$.pipe(
        map(selectedIds => {
          const sourceListIds = this.initData.roles.map(sourceListId => sourceListId.value);
          return !(
            selectedIds.length === sourceListIds.length
                && selectedIds.every(id => sourceListIds.includes(id))
          );
        })
    );
}
