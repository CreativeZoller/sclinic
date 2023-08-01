import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { filter, map, shareReplay, Observable } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { UserXRole } from "../../../models/user-x-role.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = UserXRole;

@UntilDestroy()
@Component({
    selector: "app-user-role-list-field",
    templateUrl: "./user-role-list-field.component.html",
    styleUrls: ["./user-role-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class UserRoleListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "user.role";
    public tableIdProperty = "roleId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("user.role.list.table.headers.roleName"),
            attributeName: "roleId",
            formatterFn: (value) => this.initData.roles.find(role => role.value === value)?.name,
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
            selectedIds.length === sourceListIds.length &&
            selectedIds.every(id => sourceListIds.includes(id))
          );
        })
    );
}
