import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXItem } from "../../../models/service-x-item.model";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";


export type FormModel = {
    selectedItems: ServiceXItem[];
}

@UntilDestroy()
@Component({
    selector: "app-service-item-selection-list-form",
    templateUrl: "./service-item-selection-list-form.component.html",
    styleUrls: ["./service-item-selection-list-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceItemSelectionListFormComponent extends BaseFormComponent<FormModel> {

    public errorResourceKeyPrefix = "service.item.form.errors";

    public form = new FormGroup({
        selectedItems: new FormControl<FormModel["selectedItems"]>([], { nonNullable: true, validators: []}),
    });

    public setFormValue() {
        this.form.reset();
        this.form.patchValue({
            selectedItems: this.allSelectedItems,
        });
    };

    // Note: This method converts the junction table rows, not the form rows!
    public formValueToRequestValue(_value: any): any {
        const value = _value as ServiceXItem;
        return {
            ...value,
            item: undefined,
            itemId: value.item?.itemId ?? value.itemId,
        } as ServiceXItem;
    }

    @Input() allSelectedItems: ServiceXItem[] = [];
}
