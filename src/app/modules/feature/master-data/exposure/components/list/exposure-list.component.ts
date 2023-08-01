import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { BehaviorSubject, concat, debounceTime, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { MasterDataManagementService } from "../../../../../../../api/generated/masterdata/api/api";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { Exposure } from "../../models/exposure.model";
import { DatePipe } from "@angular/common";
import { CoreModelsMasterDataExposureGetExposureByConditionRequest } from "../../../../../../../api/models";
import { TextFieldComponent } from "../../../../../app-common/text-field/components/text-field/text-field.component";
import { DatepickerFieldComponent } from "../../../../../app-common/datepicker-field/components/datepicker-field/datepicker-field.component";
import { SelectFieldComponent } from "../../../../../app-common/select-field/components/select-field/select-field.component";
import { PaginationConfig } from "../../../../../../components/table/pagination/pagination.component";


type Full_Model = Exposure;

@UntilDestroy()
@Component({
    selector: "app-exposure-list",
    templateUrl: "./exposure-list.component.html",
    styleUrls: ["./exposure-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExposureListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private datePipe = inject(DatePipe);

    public baseResourceKey = "exposure";
    public tableIdProperty = "exposureId";

    private filterData$ = new BehaviorSubject<CoreModelsMasterDataExposureGetExposureByConditionRequest>({});

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("exposure.list.table.headers.isCompleted"),
            attributeName: "isCompleted",
            formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input">
            </div>`,
            headerSearchComponent: SelectFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: SelectFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.options = [
                    { name: this.resourceService.resolve("general.label.true"), value: true },
                    { name: this.resourceService.resolve("general.label.false"), value: false },
                ];
                instance.writeValue(null);
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        isCompleted: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("exposure.list.table.headers.description"),
            attributeName: "description",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        description: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("exposure.list.table.headers.exposureDate"),
            attributeName: "exposureDate",
            formatterFn: (v) => this.datePipe.transform(v),
            headerSearchComponent: DatepickerFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: DatepickerFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        exposureDate: v ?? undefined,
                    });
                });
            },
        },
    ];

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    public getTableData$: (pageConfig: PaginationConfig) => Observable<Full_Model[]> = (pageConfig) => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return concat(
                    of(undefined as any),
                    this.masterDataManagementService.exposureGetExposureByConditionPost({
                        ...filterData,
                        needExposureItem: true,
                        needService: true,
                        needSpecialty: true,

                        page: pageConfig.currentSelectedPage,
                        pageSize: pageConfig.rowsPerPage,
                    }).pipe(
                        tap(res => {
                            if (res && res.totalRecordCount != null) {
                                this.totalRecordCount$.next(res.totalRecordCount);
                            }
                        }),
                        map(res => res?.businessObjectList ?? []),
                        shareReplay(1),
                    ),
                );
            }),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Full_Model, Full_Model>) => Observable<any> = ({ formValue }) => {
        return this.masterDataManagementService.exposureItemCreateOrUpdateExposureItemPost({
            businessObjectList: (formValue.exposureXExposureItem ?? [])
                .map((ei) => ei.exposureItem!)
                .filter((ei, i, arr) => arr.findIndex(ei2 => ei2.exposureItemId === ei.exposureItemId) === i),// Deduplicate
        }).pipe(
            map((res) => res.businessObjectList),
            shareReplay(1),
            switchMap(() => this.masterDataManagementService.exposureCreateOrUpdateExposurePost({
                businessObjectList: [ { ...formValue } ],
            }).pipe(
                map((res) => res.businessObjectList),
            )),
        );
    }
}
