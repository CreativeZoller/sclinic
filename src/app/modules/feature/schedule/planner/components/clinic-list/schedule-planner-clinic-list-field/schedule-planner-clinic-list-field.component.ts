import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseListFieldComponent } from 'src/app/modules/app-common/utility/base-list-field/base-list-field.directive';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';
import { FormModel } from '../schedule-planner-clinic-form/schedule-planner-clinic-form.component';


@Component({
    selector: 'app-schedule-planner-clinic-list-field',
    templateUrl: './schedule-planner-clinic-list-field.component.html',
    styleUrls: ['./schedule-planner-clinic-list-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class SchedulePlannerClinicListFieldComponent extends BaseListFieldComponent<Clinic> {

    public baseResourceKey = "schedule.planner.filter.clinic";
    public tableIdProperty = "clinicId";

    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.planner.filter.clinic.list.table.headers.id"),
            attributeName: "clinicId"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.clinic.list.table.headers.name"),
            attributeName: "clinicName"
        },
        {
            name: this.resourceService.resolve("schedule.planner.filter.clinic.list.table.headers.phone"),
            attributeName: "phoneNumber"
        }
    ];

    public allSelected$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedClinics ?? [])
        );
        return of(null);
    }
}
