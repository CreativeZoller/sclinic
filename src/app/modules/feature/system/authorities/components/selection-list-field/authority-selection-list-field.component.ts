import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { map, Observable, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { Authority } from "../../models/authority.model";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { AuthenticationWebServiceService } from "../../../../../../../api/services";
import { SkipSettingValueAccessorProviders } from "../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";


type Grid_Model = Authority;
type Full_Model = Authority;

@UntilDestroy()
@Component({
    selector: "app-authority-selection-list-field",
    templateUrl: "./authority-selection-list-field.component.html",
    styleUrls: ["./authority-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class AuthoritySelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);

    public baseResourceKey = "authority";
    public tableIdProperty = "rightId";

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("authority.list.table.headers.name"),
            attributeName: "name",
        },
    ];

    public getTableData$ = () => this.authenticationWebServiceService.rightGetRightByConditionPost({
        needFunction: true,
    }).pipe(
        map((res) => res?.businessObjectList ?? []),
        shareReplay(1),
    );

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.authenticationWebServiceService.rightCreateOrUpdateRightPost({
            businessObject: removeNullProperties({
                ...rowData,
                ...formValue,
            }),
        }).pipe(
            map((res) => res.businessObject),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.authenticationWebServiceService.rightDeleteRightDelete({
            rightIds: [gridRowData?.rightId!],
        });
    }
}
