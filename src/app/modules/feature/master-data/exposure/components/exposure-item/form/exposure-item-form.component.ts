import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { ExposureXExposureItem } from "../../../models/exposure-x-exposure-item.model";
import { Exposure } from "../../../models/exposure.model";


type Full_Model = ExposureXExposureItem;

@UntilDestroy()
@Component({
    selector: "app-exposure-item-form",
    templateUrl: "./exposure-item-form.component.html",
    styleUrls: ["./exposure-item-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExposureItemFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "exposure.item.form.errors";

    public form = new FormGroup({
        // Azonosító
        exposureXExposureItemId: new FormControl<Full_Model["exposureXExposureItemId"]>(0, { nonNullable: true, validators: [] }),
        // FK Azonosító
        exposureId: new FormControl<Full_Model["exposureId"]>(0, { nonNullable: true, validators: [] }),

        // Expozíció
        description: new FormControl<Exposure["description"]>({ value: "", disabled: true }, { nonNullable: true, validators: [] }),
        // Azonosító
        exposureItemId: new FormControl<Full_Model["exposureItemId"]>(0, { nonNullable: true, validators: [] }),
        // (Exp paraméter)
        exposureItem: new FormGroup({
            // Azonosító
            exposureItemId: new FormControl<NonNullable<Full_Model["exposureItem"]>["exposureItemId"]>(0, { nonNullable: true, validators: [] }),
            // Paraméter
            description: new FormControl<NonNullable<Full_Model["exposureItem"]>["description"]>("", { nonNullable: true, validators: [ Validators.required ] }),
            // Paraméter kódja
            code: new FormControl<NonNullable<Full_Model["exposureItem"]>["code"]>("", { nonNullable: true, validators: [ Validators.required ] }),
        }),

        // Szolgáltatások
        exposureXExposureItemXService: new FormControl<Full_Model["exposureXExposureItemXService"]>([], { nonNullable: true, validators: [] }),
    });

    protected _exposure: Exposure | undefined | null;
    @Input() set exposure(exposure: Exposure | undefined | null) {
        this._exposure = exposure;
        this.form.patchValue({
            description: exposure?.description ?? "",
            exposureId: exposure?.exposureId,
        });
    }

    public setFormValue(data: Full_Model | null | undefined): void {
        super.setFormValue(<any>{
            ...data,
            description: this._exposure?.description ?? "",
        });
    }
}
