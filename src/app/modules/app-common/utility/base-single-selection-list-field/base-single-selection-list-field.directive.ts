import { Directive } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseSelectionListFieldComponent } from "../base-selection-list-field/base-selection-list-field.directive";


@UntilDestroy()
@Directive({})
export class BaseSingleSelectionListFieldComponent<Model extends object = any> extends BaseSelectionListFieldComponent<Model> {
}
