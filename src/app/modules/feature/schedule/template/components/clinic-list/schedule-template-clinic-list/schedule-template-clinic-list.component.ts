import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableHeader } from 'src/app/components/table/table/table-header';
import { CheckboxFieldComponent } from 'src/app/modules/app-common/checkbox-field/components/checkbox-field/checkbox-field.component';
import { SkipSettingValueAccessorProviders } from 'src/app/modules/app-common/utility/base-control-value-acessor/base-control-value-acessor.directive';
import { BaseListFieldComponent } from 'src/app/modules/app-common/utility/base-list-field/base-list-field.directive';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';
import { ScheduleTemplateSummary } from '../../../models/schedule-template-summary.model';
import { Observable, of, shareReplay } from 'rxjs';
import { ListHandlerCallbackData } from 'src/app/modules/app-common/list/components/list/list.component';
import { FormModel } from '../schedule-template-clinic-form/schedule-template-clinic-form.component';


@Component({
    selector: 'app-schedule-template-clinic-list',
    templateUrl: './schedule-template-clinic-list.component.html',
    styleUrls: ['./schedule-template-clinic-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ScheduleTemplateClinicListComponent extends BaseListFieldComponent<Clinic> {

    public baseResourceKey = "schedule.template.clinic";
    public tableIdProperty = "scheduleTemplateClinicList";
    public tableTitle: string = this.resourceService.resolve("schedule.template.clinic.list.table.title");

    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.name"),
            attributeName: "address.dC_City.name"
        },
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.bookable"),
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (value, row: UnArray<ScheduleTemplateSummary["clinicDataList"]>) => {
                return (comp: CheckboxFieldComponent) => {
                    comp.writeValue(!!row.isExternalSite);
                }
            }
        },
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.phone"),
            attributeName: "phoneNumber"
        },
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.company"),
            attributeName: "clinicName"
        },
        {
            name: this.resourceService.resolve("schedule.template.clinic.list.table.headers.room"),
            attributeName: "roomNumber"
        },
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
