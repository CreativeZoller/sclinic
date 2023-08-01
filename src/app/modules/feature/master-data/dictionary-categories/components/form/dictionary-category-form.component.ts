import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DictionaryCategory } from "../../models/dictionary-category.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";


type Full_Model = DictionaryCategory;

@UntilDestroy()
@Component({
    selector: "app-dictionary-category-form",
    templateUrl: "./dictionary-category-form.component.html",
    styleUrls: ["./dictionary-category-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryCategoryFormComponent extends BaseFormComponent<Full_Model> {
    public errorResourceKeyPrefix = "dictionary.category.form.errors";

    public form = new FormGroup({
        name: new FormControl<Full_Model["name"]>({ value: undefined, disabled: true}, { nonNullable: true, validators: [Validators.required] }),
        categoryName: new FormControl<Full_Model["categoryName"]>(undefined, { nonNullable: true, validators: [] }),
        remarks: new FormControl<Full_Model["remarks"]>(undefined, { nonNullable: true, validators: [] }),
    });
}
