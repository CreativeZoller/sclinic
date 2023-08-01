import { Component, inject } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, debounceTime, map, shareReplay, switchMap } from 'rxjs';
import { CoreModelsResourceManagementScheduleTemplateGetScheduleTemplateByConditionRequest } from 'src/api/models';
import { ResourceManagementService } from 'src/api/services';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { CheckboxFieldComponent } from 'src/app/modules/app-common/checkbox-field/components/checkbox-field/checkbox-field.component';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { NumberFieldComponent } from 'src/app/modules/app-common/number-field/components/number-field/number-field.component';
import { SelectFieldComponent } from 'src/app/modules/app-common/select-field/components/select-field/select-field.component';
import { TextFieldComponent } from 'src/app/modules/app-common/text-field/components/text-field/text-field.component';
import { ResourceService } from 'src/app/modules/core/resource/services/resource.service';
import { ScheduleTemplate } from '../../models/schedule-template.model';


type Grid_Model = ScheduleTemplate; // Tudom hogy nincs értelme, de még a backendet átalakítják, hozzá kell majd igazítani
type Full_Model = ScheduleTemplate;

@UntilDestroy()
@Component({
    selector: 'app-schedule-template-list',
    templateUrl: './schedule-template-list.component.html',
    styleUrls: ['./schedule-template-list.component.scss']
})
export class ScheduleTemplateListComponent {

    private resourceService = inject(ResourceService);
    private resourceManagementService = inject(ResourceManagementService);
    private filterData$ = new BehaviorSubject<CoreModelsResourceManagementScheduleTemplateGetScheduleTemplateByConditionRequest>({});

    public baseResourceKey = "schedule.template";
    public tableIdProperty = "scheduleTemplateId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.template.list.table.headers.name"),
            attributeName: "name",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        templateName: v ?? undefined,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("schedule.template.list.table.headers.id"),
            attributeName: "scheduleTemplateId",
            headerSearchComponent: NumberFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: NumberFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.hideStepping = true;
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        scheduleTemplateIdList: !!v ? [v] : [],
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("schedule.template.list.table.headers.aWeek"),
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: Full_Model) =>
                (comp: CheckboxFieldComponent) => comp.writeValue(!!row.isWeekA),
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
                        isWeekA: v ?? null,
                    });
                });
            },
        },
        {
            name: this.resourceService.resolve("schedule.template.list.table.headers.bWeek"),
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: Full_Model) =>
                (comp: CheckboxFieldComponent) => comp.writeValue(!!row.isWeekB),
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
                            isWeekB: v ?? null,
                        });
                    });
                },
        },
        {
            name: this.resourceService.resolve("schedule.template.list.table.headers.cWeek"),
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: Full_Model) =>
                (comp: CheckboxFieldComponent) => comp.writeValue(!!row.isWeekC),
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
                            isWeekC: v ?? null,
                        });
                    });
                },
        },
        {
            name: this.resourceService.resolve("schedule.template.list.table.headers.dWeek"),
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: Full_Model) =>
                (comp: CheckboxFieldComponent) => comp.writeValue(!!row.isWeekD),
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
                            isWeekD: v ?? null,
                        });
                    });
                },
        },
        {
            name: this.resourceService.resolve("schedule.template.list.table.headers.description"),
            attributeName: "description",
            headerSearchComponent: TextFieldComponent,
            initHeaderSearchComponentBindingsFn: (instance: TextFieldComponent) => {
                instance.placeholder = this.resourceService.resolve("general.action.label.search");
                instance.classes = ["form-control--search"];
                instance.registerOnChange((v) => {
                    this.filterData$.next({
                        ...this.filterData$.value,
                        templateDescription: v ?? undefined,
                    });
                });
            },
        },
    ];

    public getTableData$: () => Observable<Grid_Model[]> = () => {
        return this.filterData$.pipe(
            debounceTime(200),
            switchMap((filterData) => {
                return this.resourceManagementService.scheduleTemplateGetScheduleTemplateByConditionPost({
                    ...filterData,
                })
            }),
            map(res => res?.businessObjectList ?? []),
            shareReplay(1)
        );
    }

    public handleSave$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({formValue}) => {
        return this.resourceManagementService.scheduleTemplateCreateOrUpdateScheduleTemplatePost({
            scheduleTemplate: [{
                ...formValue
            }]
        }).pipe(
            map((res) => res.businessObjectList?.[0]),
            shareReplay(1),
        );
    }

    public handleDelete$?: (data: ListHandlerCallbackData<Grid_Model, Full_Model>) => Observable<any> = ({gridRowData}) => {
        return this.resourceManagementService.scheduleTemplateDeleteScheduleTemplateDelete({
            scheduleTemplateIdList: [gridRowData?.scheduleTemplateId! ]
        });
    }

    public getFullModelFromGridModel$ = (gridRowData: Full_Model) =>
    {
        return this.resourceManagementService.scheduleTemplateGetScheduleTemplateSummaryPost({
            scheduleTemplateId: gridRowData.scheduleTemplateId
        }).pipe(
            map(res => {
                return {
                    ...res,
                    ...gridRowData
                }
            }),
            shareReplay(1)
        );
    }
}
