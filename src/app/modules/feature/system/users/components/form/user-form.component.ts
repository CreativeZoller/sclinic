import { ChangeDetectionStrategy, Component } from "@angular/core";
import { User } from "../../models/user.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { fullEmailValidator } from "../../../../../core/utility/validators/full-email.validator";
import { combineLatest, map, startWith } from "rxjs";
import { TwoFactorAuthenticationTypeEnum, UserTypeEnum } from "../../../../../../../api/enums";


type Full_Model = User;

@UntilDestroy()
@Component({
    selector: "app-user-form",
    templateUrl: "./user-form.component.html",
    styleUrls: ["./user-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "user.form.errors";

    dc_DefaultUserStatus = (this.initData.dC_UserStatusList.find(x => x.dto.isDefault)?.value || undefined);

    public form = new FormGroup({
        // Típus
        dC_UserTypeId: new FormControl<Full_Model["dC_UserTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Titulus
        dC_TitleTypeId: new FormControl<Full_Model["dC_TitleTypeId"]>(undefined, { nonNullable: true, validators: [] }),
        // Felhasználó családneve
        familyName: new FormControl<Full_Model["familyName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Felhasználó keresztneve
        firstName: new FormControl<Full_Model["firstName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Kétfaktoros azonosítás típusa
        dC_TwoFactorAuthenticationTypeId: new FormControl<Full_Model["dC_TwoFactorAuthenticationTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Telefonszám
        phoneNumber: new FormControl<Full_Model["phoneNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Felhasználónév / E-mail cím
        email: new FormControl<Full_Model["email"]>(undefined, { nonNullable: true, validators: [
            Validators.required,
            Validators.minLength(3),
            fullEmailValidator,
        ] }),
        // Státusz
        dC_UserStatusId: new FormControl<Full_Model["dC_UserStatusId"]>(this.dc_DefaultUserStatus, { nonNullable: true, validators: [Validators.required] }),
        // Szerepkörök
        swissUserXRole: new FormControl<Full_Model["swissUserXRole"]>([], { nonNullable: true, validators: [Validators.required] }),
    });

    public twoFactorAuthenticationTypeOptions$ = this.form.controls.dC_UserTypeId.valueChanges.pipe(
        startWith(this.form.controls.dC_UserTypeId.value),
        map((userType) => {
            return this.initData.dC_TwoFactorAuthenticationTypeList.filter((authTypeOption) => {
                if (userType == null) return true;

                if(userType === UserTypeEnum.DOCTOR) {
                    return authTypeOption.value !== TwoFactorAuthenticationTypeEnum.GOOGLE;
                } else {
                    return authTypeOption.value === TwoFactorAuthenticationTypeEnum.GOOGLE
                }
            });
        }),
    )

    constructor() {
        super();

        combineLatest([
            this.twoFactorAuthenticationTypeOptions$,
            this.form.controls.dC_TwoFactorAuthenticationTypeId.valueChanges.pipe(
                startWith(this.form.controls.dC_TwoFactorAuthenticationTypeId.value)
            ),
        ]).pipe(
            untilDestroyed(this),
        ).subscribe(([options, selectedOptionValue]) => {
            if (selectedOptionValue != null && options.every(o => o.value !== selectedOptionValue)) {
                this.form.controls.dC_TwoFactorAuthenticationTypeId.reset();
            }
        });
    }
}
