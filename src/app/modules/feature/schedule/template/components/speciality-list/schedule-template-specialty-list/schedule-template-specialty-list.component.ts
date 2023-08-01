import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { BaseListFieldComponent } from 'src/app/modules/app-common/utility/base-list-field/base-list-field.directive';
import { ScheduleTemplateItemXSpecialty } from '../../../models/schedule-tempalte-item-x-specialty.model';
import { Observable, of, shareReplay } from 'rxjs';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { FormModel } from '../schedule-template-specialty-form/schedule-template-specialty-form.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';


type Full_model = UnArray<ScheduleTemplateItemXSpecialty>;

@Component({
    selector: 'app-schedule-template-specialty-list',
    templateUrl: './schedule-template-specialty-list.component.html',
    styleUrls: ['./schedule-template-specialty-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ScheduleTemplateSpecialtyListComponent extends BaseListFieldComponent<Full_model> {

    public baseResourceKey = "schedule.template.specialty";
    public tableIdProperty = "scheduleTemplateSpecialtyList";
    public tableTitle: string = this.resourceService.resolve("schedule.template.specialty.list.table.title");

    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.template.specialty.list.table.headers.name"),
            attributeName: "specialtyName"
        },
        {
            name: this.resourceService.resolve("schedule.template.specialty.list.table.headers.code"),
            attributeName: "specialtyCode"
        },
        {
            name: this.resourceService.resolve("schedule.template.specialty.list.table.headers.status"),
            attributeName: "specialtyStatus"
        }
    ];

    public allSelected$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedSpecialities ?? [])
        );
        return of(null);
    }
}
