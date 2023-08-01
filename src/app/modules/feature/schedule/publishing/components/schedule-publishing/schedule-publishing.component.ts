import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { ResourceManagementService } from 'src/api/services';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { ResourceService } from 'src/app/modules/core/resource/services/resource.service';
import { PublishingRequestBody } from '../../models/publishing-request-body.model';


type Form_Model = PublishingRequestBody;

@Component({
    selector: 'app-schedule-publishing',
    templateUrl: './schedule-publishing.component.html',
    styleUrls: ['./schedule-publishing.component.scss']
})
export class SchedulePublishingComponent extends BaseFormComponent<Form_Model> {

    private resourceManagement = inject(ResourceManagementService)
    private toastrService = inject(ToastrService);
    private resourceService = inject(ResourceService);

    public errorResourceKeyPrefix: string;
    public form = new FormGroup({
        startDate: new FormControl<Form_Model["startDate"]>(undefined, {nonNullable: true, validators: [Validators.required]}),
        endDate: new FormControl<Form_Model["endDate"]>(undefined, {nonNullable: true, validators: [Validators.required]}),
        clinicId: new FormControl<Form_Model["clinicId"]>([], {nonNullable: true, validators: []}),
        medicalEmployeeId: new FormControl<Form_Model["clinicId"]>([], {nonNullable: true, validators: []}),
        onlyChange: new FormControl<Form_Model["onlyChange"]>(false, {nonNullable: true, validators: []}),
        sendAll: new FormControl<boolean>(false, {nonNullable: true, validators: []}),
        email: new FormControl<string>('', {nonNullable: true, validators: []}),
    });

    publishing() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.resourceManagement.publishingCreatePublishingPost({
                ...this.form.value
            }).pipe(untilDestroyed(this)).subscribe(res => {
                if (res.errorMessage === null) {
                    this.toastrService.success(this.resourceService.resolve('schedule.publishing.toast.success'));
                }
            });
        }
    }
}
