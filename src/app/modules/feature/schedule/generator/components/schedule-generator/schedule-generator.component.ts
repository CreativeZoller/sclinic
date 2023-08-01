import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { ResourceManagementService } from 'src/api/services';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { ResourceService } from 'src/app/modules/core/resource/services/resource.service';
import { arrayMinLength } from 'src/app/modules/core/utility/validators/array-min-length.validator';
import { isPastDate } from 'src/app/modules/core/utility/validators/date.validator';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';

@UntilDestroy()
@Component({
    selector: 'app-schedule-generator',
    templateUrl: './schedule-generator.component.html',
    styleUrls: ['./schedule-generator.component.scss']
})
export class ScheduleGeneratorComponent extends BaseFormComponent<Clinic> {

    private resourceManagementService = inject(ResourceManagementService);
    private toastrService = inject(ToastrService);
    private resourceService = inject(ResourceService);

    public errorResourceKeyPrefix: string;

    public form: FormGroup = new FormGroup({
        startDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, isPastDate()] }),
        endDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, isPastDate()] }),
        clinicIdList: new FormControl<any[]>([], { nonNullable: true, validators: [arrayMinLength(1)] }),
        medicalEmployeeIdList: new FormControl<any[]>([], { nonNullable: true, validators: [] }),
        dC_BookingAreaIdList: new FormControl<number[]>([], { nonNullable: true, validators: [] })
    });

    generate(): void {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
        if (this.form.valid) {
            this.resourceManagementService.scheduleGeneratorGeneratePlannedSchedulePost({
                ...this.form.value,
                dC_BookingAreaIdList: this.form.value.dC_BookingAreaIdList.map((item: any) => item.dC_BookingAreaId)
            }).pipe(
                untilDestroyed(this)
            ).subscribe((response) => {
                if (response.isSuccessful) {
                    this.toastrService.success(this.resourceService.resolve('schedule.generator.form.success'));
                }
            });
        }

        this.updateView();
    }
}
