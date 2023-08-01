import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { JobTitleXService } from "../../../models/job-title-x-service.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BehaviorSubject, combineLatest, map, of, shareReplay, switchMap } from "rxjs";
import { ServiceTypeEnum } from "../../../../../../../../api/enums";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";


type Full_Model = JobTitleXService;

@UntilDestroy()
@Component({
    selector: "app-job-title-service-list-field",
    templateUrl: "./job-title-service-list-field.component.html",
    styleUrls: ["./job-title-service-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class JobTitleServiceListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey$ = new BehaviorSubject<string>("job.title.service");
    @Input() public set baseResourceKey(baseResourceKey: string) {
        this.baseResourceKey$.next(baseResourceKey);
    }
    @Input() public tableIdProperty = "jobTitleXServiceId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders$ = this.baseResourceKey$.pipe(
        map((baseResourceKey) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.service.serviceName`),
                    attributeName: "service.serviceName",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.isMandatory`),
                    attributeName: "isMandatory",
                    formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                    <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input"></div>`,
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.isPreviousResultAccepted`),
                    attributeName: "isPreviousResultAccepted",
                    formatterFn: (value) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                    <input type="checkbox" ${value ? "checked" : ""} disabled class="form-check-input"></div>`,
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.dC_ExposureFrequencyId`),
                    attributeName: "dC_ExposureFrequencyId",
                    formatterFn: (v) => this.initData.dC_ExposureFrequencyList.find(item => item.value === v)?.name,
                },
            ];
        }),
        shareReplay(1),
    )

    public allSelectedServices$ = this.getValue$().pipe(
        map((list) => (list ?? []).map(v => v.service!).filter(v => v != null)),
        shareReplay(1),
    );

    protected refreshAllServices$ = new BehaviorSubject<void>(void 0);
    protected allServices$ = this.refreshAllServices$.pipe(
        switchMap(() => this.masterDataManagementService.serviceGetServiceByConditionPost({
            dC_ServiceTypeIdList: [ServiceTypeEnum.GENERAL_EXAMINATION],
        })),
        map((res) => res?.businessObjectList ?? []),
        shareReplay(1),
    );

    protected canCreate$ = combineLatest([
        this.allServices$,
        this.allSelectedServices$
    ]).pipe(
        map(([allServices, allSelectedServices]) => {
            return !(
                allServices.length === allSelectedServices.length
                && allServices.every(s => allSelectedServices.some(as => as.serviceId === s.serviceId))
            );
        }),
        shareReplay(1),
    )

    protected handleSave$ = ({ rowData, formValue }: ListHandlerCallbackData<Full_Model, Full_Model>) => {
        const value = this.listFieldComponent.value ?? [];

        const indexToUpdate = (rowData as any)?._index as number | undefined;
        if (indexToUpdate != null) value[indexToUpdate] = formValue;
        else value.push(formValue);

        this.listFieldComponent.changeValue([
            ...value
        ]);

        return of(null);
    }

    protected handleDelete$ = ({ rowData }: ListHandlerCallbackData<Full_Model, Full_Model>) => {
        const value = this.listFieldComponent.value ?? [];

        this.listFieldComponent.changeValue(
            value.filter((_, i) => i !== (rowData as any)?._index)
        );
        return of(null);
    }

    protected valueToFormValue: (value: Full_Model[]) => Full_Model[] = (value: Full_Model[]) => {
        if (!Array.isArray(value)) return [];

        return value.map((v) => {
                if (this.listFieldComponent == null) return v;

                const validProperties = Object.keys(this.listFieldComponent.editorForm.form.controls);

                const value: any = { ...v };
                for (const key of Object.keys(value)) {
                    if (!validProperties.includes(key)) delete value[key];
                }

                return value;
            })
    };
}
