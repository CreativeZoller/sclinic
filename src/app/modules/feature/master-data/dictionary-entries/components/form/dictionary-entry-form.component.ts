import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";

export type DictionaryEntryFormModel = {
    name: string;
};

@UntilDestroy()
@Component({
    selector: "app-dictionary-entry-form",
    templateUrl: "./dictionary-entry-form.component.html",
    styleUrls: ["./dictionary-entry-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryEntryFormComponent extends BaseFormComponent<DictionaryEntryFormModel> {

    public errorResourceKeyPrefix = "dictionary.entry.form.errors";

    public form = new FormGroup({
        name: new FormControl<string>("", { nonNullable: true, validators: [Validators.required]}),
    });
}
