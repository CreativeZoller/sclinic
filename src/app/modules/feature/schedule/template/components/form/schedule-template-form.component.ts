import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { isPastDate } from 'src/app/modules/core/utility/validators/date.validator';
import { ScheduleTemplateSummary } from '../../models/schedule-template-summary.model';
import { ScheduleTemplate } from '../../models/schedule-template.model';


type Full_Model = ScheduleTemplate;

@Component({
    selector: 'app-schedule-template-form',
    templateUrl: './schedule-template-form.component.html',
    styleUrls: ['./schedule-template-form.component.scss']
})
export class ScheduleTemplateFormComponent extends BaseFormComponent<Full_Model> {

    private datePipe = inject(DatePipe);

    public errorResourceKeyPrefix: string;
    public form: FormGroup<any> = new FormGroup({
        scheduleTemplateId: new FormControl<ScheduleTemplate["scheduleTemplateId"]>(0, {nonNullable: true, validators: [] }),

        // Sablon adatok
        // Név
        name: new FormControl<ScheduleTemplate["name"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Leírás
        description: new FormControl<ScheduleTemplate["description"]>(undefined, { nonNullable: true, validators: []}),
        // A hétre érvényes
        isWeekA: new FormControl<ScheduleTemplate["isWeekA"]>(false, { nonNullable: true, validators: []}),
        // A hét érvényesség kezdete és vége
        weekAStartAndEndDate: new FormControl<string>({value: '', disabled: true}, { nonNullable: true, validators: []}),
        // A hét érvényesség kezdete és vége
        weekBStartAndEndDate: new FormControl<string>({value: '', disabled: true}, { nonNullable: true, validators: []}),
        // A hét érvényesség kezdete és vége
        weekCStartAndEndDate: new FormControl<string>({value: '', disabled: true}, { nonNullable: true, validators: []}),
        // A hét érvényesség kezdete és vége
        weekDStartAndEndDate: new FormControl<string>({value: '', disabled: true}, { nonNullable: true, validators: []}),
        // A hét érvényesség kezdete
        weekAStartDate: new FormControl<ScheduleTemplate["weekAStartDate"]>(undefined, { nonNullable: true, validators: [isPastDate()]}),
        // A hét érvényesség vége
        weekAEndDate: new FormControl<ScheduleTemplate["weekAEndDate"]>(undefined, { nonNullable: true, validators: [isPastDate()]}),
        // B hétre érvényes
        isWeekB: new FormControl<ScheduleTemplate["isWeekB"]>(false, { nonNullable: true, validators: []}),
        // B hét érvényesség kezdete
        weekBStartDate: new FormControl<ScheduleTemplate["weekBStartDate"]>(undefined, { nonNullable: true, validators: [isPastDate()]}),
        // B hét érvényesség vége
        weekBEndDate: new FormControl<ScheduleTemplate["weekBEndDate"]>(undefined, { nonNullable: true, validators: [isPastDate()]}),
        // C hétre érvényes
        isWeekC: new FormControl<ScheduleTemplate["isWeekC"]>(false, { nonNullable: true, validators: []}),
        // C hét érvényesség kezdete
        weekCStartDate: new FormControl<ScheduleTemplate["weekCStartDate"]>(undefined, { nonNullable: true, validators: [isPastDate()]}),
        // C hét érvényesség vége
        weekCEndDate: new FormControl<ScheduleTemplate["weekCEndDate"]>(undefined, { nonNullable: true, validators: [isPastDate()]}),
        // D hétre érvényes
        isWeekD: new FormControl<ScheduleTemplate["isWeekD"]>(false, { nonNullable: true, validators: []}),
        // D hét érvényesség kezdete
        weekDStartDate: new FormControl<ScheduleTemplate["weekDStartDate"]>(undefined, { nonNullable: true, validators: [isPastDate()]}),
        // D hét érvényesség vége
        weekDEndDate: new FormControl<ScheduleTemplate["weekDEndDate"]>(undefined, { nonNullable: true, validators: [isPastDate()]}),
        // Sablon alkalmazása szekció
        // Időszaktól
        applyFrom: new FormControl<string>('', { nonNullable: true, validators: [isPastDate()]}),
        // Időszakig
        applyTo: new FormControl<string>('', { nonNullable: true, validators: [isPastDate()]}),
        // Folyatatólagosan
        isContinuous: new FormControl<boolean>(false, { nonNullable: true, validators: []}),
        // Mintázatkövetően
        isPatternBased: new FormControl<boolean>(false, { nonNullable: true, validators: []}),
        // kezdő hét
        startWeek: new FormControl<string>('', { nonNullable: true, validators: []}),
        // befejezőhét
        endWeek: new FormControl<string>('', { nonNullable: true, validators: []}),
        // Orvosok és alkalmazottak
        employeeDataList: new FormControl<ScheduleTemplateSummary["employeeDataList"]>([], { nonNullable: true, validators: []}),
        // Ellátóhelyek
        clinicDataList: new FormControl<ScheduleTemplateSummary["clinicDataList"]>([], { nonNullable: true, validators: []}),
        // Szakmák Ez még nem jön a backendről, de már dolgoznak rajta
        specialtyDataList: new FormControl<Array<any>>([], { nonNullable: true, validators: []}),
    });

    public setFormValue(data: Full_Model | undefined | null) {
        super.setFormValue(data);

        if (data == null || data === undefined) return;

        if (this.form.get('weekAStartDate')?.value != null && this.form.get('weekAEndDate')?.value != null) {
            this.form.get('weekAStartAndEndDate')?.setValue(
                this.datePipe.transform(data.weekAStartDate, 'yyyy.MM.dd.') + ' - ' + this.datePipe.transform(data.weekAEndDate, 'yyyy.MM.dd.')
            );
        }

        if (this.form.get('weekAStartDate')?.value != null && this.form.get('weekAEndDate')?.value != null) {
            this.form.get('weekBStartAndEndDate')?.setValue(
                this.datePipe.transform(data.weekBStartDate, 'yyyy.MM.dd.') + ' - ' + this.datePipe.transform(data.weekBEndDate, 'yyyy.MM.dd.')
            );
        }

        if (this.form.get('weekAStartDate')?.value != null && this.form.get('weekAEndDate')?.value != null) {
            this.form.get('weekCStartAndEndDate')?.setValue(
                this.datePipe.transform(data.weekCStartDate, 'yyyy.MM.dd.') + ' - ' + this.datePipe.transform(data.weekCEndDate, 'yyyy.MM.dd.')
            );
        }

        if (this.form.get('weekAStartDate')?.value != null && this.form.get('weekAEndDate')?.value != null) {
            this.form.get('weekDStartAndEndDate')?.setValue(
                this.datePipe.transform(data.weekDStartDate, 'yyyy.MM.dd.') + ' - ' + this.datePipe.transform(data.weekDEndDate, 'yyyy.MM.dd.')
            );
        }
    };
}
