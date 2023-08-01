import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Role } from "../../models/role.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";


type Full_Model = Role;

@UntilDestroy()
@Component({
    selector: "app-role-form",
    templateUrl: "./role-form.component.html",
    styleUrls: ["./role-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "role.form.errors";

    public form = new FormGroup({
        // Szerepkör megnevezése
        roleName: new FormControl<Full_Model["roleName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        technical: new FormControl<Full_Model["technical"]>(false, { nonNullable: true, validators: [Validators.required] }),
        // Jogosultságok
        roleXRight: new FormControl<Full_Model["roleXRight"]>([], { nonNullable: true, validators: [] }),
    });
}
