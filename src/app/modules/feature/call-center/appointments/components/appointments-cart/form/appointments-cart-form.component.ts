import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { AppointmentCart } from "../models/appointments-cart-data.model";
import { BaseFormComponent } from "src/app/modules/app-common/utility/base-form-component/base-form-component.directive";

@UntilDestroy()
@Component({
    selector: "app-cc-appointments-cart-form",
    templateUrl: "./appointments-cart-form.component.html",
    styleUrls: ["./appointments-cart-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CcAppointmentCartFormComponent extends BaseFormComponent<AppointmentCart> {
    public form = new FormGroup({
        fullName: new FormControl('', { nonNullable: true, validators: [] }),
        birthday: new FormControl('', { nonNullable: true, validators: [] }),
        cartName: new FormControl('', { nonNullable: true, validators: [] }),
        cartComment: new FormControl('', { nonNullable: true, validators: [] })
    });
    public isClosed: boolean = false;
    @Input() set data (value: AppointmentCart) {
        if (value) {
            this.form.get('fullName')?.disable();
            this.form.get('birthday')?.disable();
            if (value.cartStatus === false) {
                this.form.get('cartName')?.disable();
                this.form.get('cartComment')?.disable();
            }
            this.form.reset();
            this.form.patchValue({
                fullName: value.fullName,
                birthday: value.birthday,
                cartName: value.cartTitle,
                cartComment: value.cartComments,
            });
        }
    };
    // todo: set times and pass to table once received
    
    public errorResourceKeyPrefix = "patient.form.errors";
}