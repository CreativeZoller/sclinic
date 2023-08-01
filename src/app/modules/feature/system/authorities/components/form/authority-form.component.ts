import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Authority } from "../../models/authority.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";


type Full_Model = Authority;

@UntilDestroy()
@Component({
    selector: "app-authority-form",
    templateUrl: "./authority-form.component.html",
    styleUrls: ["./authority-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorityFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "authority.form.errors";

    public form = new FormGroup({
        // Megnevezés
        name: new FormControl<Full_Model["name"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Funckiók hozzárendelés
        rightXFunction: new FormControl<Full_Model["rightXFunction"]>([], { nonNullable: true, validators: [Validators.required] }),
    });
}
