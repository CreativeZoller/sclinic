import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { TableHeader } from "../../../../../../components/table/table/table-header";
import { MasterDataManagementService } from "src/api/services";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { ListHandlerCallbackData } from "../../../../../app-common/list/components/list/list.component";
import { JobTitle } from "../../models/job-title.model";
import { HSCO_Data_Model } from "../../models/hsco.model";
import { FormControl, FormGroup } from "@angular/forms";


type Grid_Model = JobTitle;
type Full_Model = JobTitle;

@UntilDestroy()
@Component({
    selector: "app-job-title-list",
    templateUrl: "./job-title-list.component.html",
    styleUrls: ["./job-title-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobTitleListComponent {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    protected cdr = inject(ChangeDetectorRef);

    public baseResourceKey = "job.title";
    public tableIdProperty = "jobTitleId";

    public selectedHSCOId$ = new BehaviorSubject<number | undefined>(undefined);

    protected hscoLevel: number[] = [4];
    protected showTableLoading$ = new BehaviorSubject<boolean>(true);

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("job.title.list.table.headers.feor"),
            attributeName: "hsco.hscoNumber",
        },
        {
            name: this.resourceService.resolve("job.title.list.table.headers.position"),
            attributeName: "jobTitleId",
        },
        {
            name: this.resourceService.resolve("job.title.list.table.headers.job.title.name"),
            attributeName: "titleName",
        },
        {
            name: this.resourceService.resolve("job.title.list.table.headers.completed"),
            attributeName: "completed",
            formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
            <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input"></div>`,
        },
    ]

    public form = new FormGroup({
        hsco: new FormControl<Full_Model["hsco"]>(undefined, { nonNullable: true, validators: [] }),
    });

    constructor() {
        this.form.controls.hsco.valueChanges.subscribe((selectedHSCO) => {
            this.selectedHSCOId$.next(selectedHSCO?.hscoId);
            this.getTableData$();
        });
    }

    public getTableData$: () => Observable<Grid_Model[]> = () => {
        return combineLatest([this.selectedHSCOId$]).pipe(
            switchMap(([selectedHSCOId]) => {
                if (!selectedHSCOId) {
                    this.showTableLoading$.next(false);
                    return of([]);
                }

                this.showTableLoading$.next(true);
                return this.masterDataManagementService.jobTitleGetJobTitleByConditionPost({
                    hscoId: selectedHSCOId,
                    needHSCO: true,
                    needService: true,
                    needOccupationalHealth: true,
                }).pipe(
                    tap(() => this.showTableLoading$.next(false)),
                    map(res => res?.businessObjectList ?? []),
                    catchError(err => {
                        this.showTableLoading$.next(false);
                        return of([]);
                    }),
                );
            }),
            map(res => res ?? []),
            shareReplay(1),
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({ rowData, formValue }) => {
        return this.masterDataManagementService.jobTitleCreateOrUpdateJobTitlePost({
            businessObjectList: [ {
                ...formValue
            }],
        }).pipe(
            map((res) => res.businessObjectList),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({ gridRowData }) => {
        return this.masterDataManagementService.jobTitleDeleteJobTitleDelete({
            jobTitleIds: [ gridRowData?.jobTitleId!],
        });
    }

    hscoAutocomplete = {
        searchFn$: (value: string) => {
            return this.masterDataManagementService.hSCOGetHSCOByConditionPost({
                hscoNumber: value,
                hscoName: value,
                hscoLevel: this.hscoLevel,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (x: HSCO_Data_Model) =>
            x ? x?.hscoNumber + " - " + x?.hscoName ?? "" : "",

        getFormattedInputText: (x: HSCO_Data_Model) =>
            x ? x?.hscoNumber + " - " + x?.hscoName ?? "" : "",
        getFormattedInputValue: (x: HSCO_Data_Model) => x?.hscoId,
    };
}
