import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DatePipe } from "@angular/common";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { Configuration, Grid_Configuration } from "../../models/configuration.model";
import { removeNullProperties } from "../../../../../core/utility/methods/remove-null-properties";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { CoreModelsMasterDataConfigurationGetConfigurationsByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { DatepickerFieldComponent } from "../../../../../app-common/datepicker-field/components/datepicker-field/datepicker-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Grid_Model = Grid_Configuration;
type Full_Model = Configuration;

@UntilDestroy()
@Component({
    selector: "app-configuration-list",
    templateUrl: "./configuration-list.component.html",
    styleUrls: ["./configuration-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private datePipe = inject(DatePipe);
    private resourceService = inject(ResourceService);

    public baseResourceKey = "configuration";
    public tableIdProperty = "configurationId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataConfigurationGetConfigurationsByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("configuration.list.table.headers.configurationName"),
            attributeName: "configurationName",
            cellClasses: ['max-200-width-colum'],
            headerClasses: ['max-200-width-colum'],
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        configurationNameContains: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("configuration.list.table.headers.configurationValue"),
            attributeName: "configurationValue",
            cellClasses: ['max-200-width-colum'],
            headerClasses: ['max-200-width-colum'],
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        configurationValueContains: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("configuration.list.table.headers.validFrom"),
            attributeName: "validFrom",
            formatterFn: (v) => this.datePipe.transform(v),
            headerSearchComponent: DatepickerFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: DatepickerFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        validFrom: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("configuration.list.table.headers.validTo"),
            attributeName: "validTo",
            formatterFn: (v) => this.datePipe.transform(v),
            headerSearchComponent: DatepickerFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: DatepickerFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        validTo: v ?? undefined,
                    });
                });
            },
        },
    ];

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Grid_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.masterDataManagementService.configurationGetConfigurationsByConditionPost({
                        ...filterData,
                        page: pageConfig.currentSelectedPage,
                        pageSize: pageConfig.rowsPerPage,
                    }).pipe(
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount$.next(res.totalRecordCount);
                            }
                        }),
                        map(res => res?.businessObjectList ?? []),
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({rowData, formValue}) => {
        return this.masterDataManagementService.configurationUpdateConfigurationPost(removeNullProperties({
            ...rowData,
            ...formValue,
        }));
    }
}
