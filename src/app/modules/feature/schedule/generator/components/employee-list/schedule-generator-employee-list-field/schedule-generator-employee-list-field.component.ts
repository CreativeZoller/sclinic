import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseListFieldComponent } from 'src/app/modules/app-common/utility/base-list-field/base-list-field.directive';
import { MedicalEmployee } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee.model';
import { MedicalalEmployeeXService } from '../../../../template/models/medical-employee-x-service.model';
import { FormModel } from '../schedule-generator-employee-form/schedule-generator-employee-form.component';


type Full_Model = MedicalEmployee;

@Component({
    selector: 'app-schedule-generator-employee-list-field',
    templateUrl: './schedule-generator-employee-list-field.component.html',
    styleUrls: ['./schedule-generator-employee-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ScheduleGeneratorEmployeeListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "schedule.generator.employee";
    public tableIdProperty = "scheduleTemplateEmployeeList";
    public tableTitle: string = this.resourceService.resolve("schedule.generator.employee.list.table.title");

    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.titleType"),
            attributeName: "dC_TitleType.name"
        },
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.firstName"),
            attributeName: "firstName"
        },
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.lastName"),
            attributeName: "lastName"
        },
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.sealNumber"),
            attributeName: "stampNumber"
        },
        {
            name: this.resourceService.resolve("schedule.generator.employee.list.table.headers.specialties"),
            attributeName: "medicalEmployeeXService",
            formatterFn: (v) => v.map((r: MedicalalEmployeeXService) => r?.specialty?.specialtyName ?? '').join(', ') ?? ""
        }
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
