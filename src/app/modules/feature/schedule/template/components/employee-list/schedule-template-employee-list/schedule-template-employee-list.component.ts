import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { CheckboxFieldComponent } from 'src/app/modules/app-common/checkbox-field/components/checkbox-field/checkbox-field.component';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseListFieldComponent } from 'src/app/modules/app-common/utility/base-list-field/base-list-field.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { MedicalalEmployeeXService } from '../../../models/medical-employee-x-service.model';
import { ScheduleTemplateSummary } from '../../../models/schedule-template-summary.model';
import { FormModel } from '../schedule-template-employee-form/schedule-template-employee-form.component';


type Full_Model = UnArray<ScheduleTemplateSummary["employeeDataList"]>;

@Component({
    selector: 'app-schedule-template-employee-list',
    templateUrl: './schedule-template-employee-list.component.html',
    styleUrls: ['./schedule-template-employee-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ScheduleTemplateEmployeeListComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "schedule.template.employee";
    public tableIdProperty = "scheduleTemplateEmployeeList";
    public tableTitle: string = this.resourceService.resolve("schedule.template.employee.list.table.title");

    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.type"),
            attributeName: "dC_MedicalEmployeeType.name"
        },
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.titleType"),
            attributeName: "dC_TitleType.name"
        },
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.firstName"),
            attributeName: "firstName"
        },
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.lastName"),
            attributeName: "lastName"
        },
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.sealNumber"),
            attributeName: "stampNumber"
        },
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.specialties"),
            attributeName: "medicalEmployeeXService",
            formatterFn: (v) => v.map((r: MedicalalEmployeeXService) => r?.specialty?.specialtyName ?? '').join(', ') ?? ""
        },
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.fogl"),
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: Full_Model) => {
                return (comp: CheckboxFieldComponent) => {
                    comp.writeValue(!!row.medicalEmployeeId);
                }
            }
        },
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.insurance"),
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: Full_Model) => {
                return (comp: CheckboxFieldComponent) => {
                    comp.writeValue(!!row.medicalEmployeeId);
                }
            }
        },
        {
            name: this.resourceService.resolve("schedule.template.employee.list.table.headers.annualLeave"),
            attributeName: "numberOfDaysOff"
        },
    ];

    public allSelected$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedEmployees ?? [])
        );
        return of(null);
    }
}
