import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { HSCO_Model, Health_OccupationalHealth_Model } from "../../models/hsco.model";


type Full_Model = HSCO_Model;

@UntilDestroy()
@Component({
    selector: "app-occupational-health-form",
    templateUrl: "./occupational-health-form.component.html",
    styleUrls: ["./occupational-health-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OccupationalHealthFormComponent extends BaseFormComponent<HSCO_Model> {

    public errorResourceKeyPrefix = "occupational.health.form.errors";

    public form = new FormGroup({
        hscoId: new FormControl<Full_Model["hscoId"]>(0, { nonNullable: true, validators: [] }),
        hscoName: new FormControl<Full_Model["hscoName"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [] }),
        occupationalHealth: new FormArray([
            new FormGroup({
                occupationalHealthId: new FormControl<Health_OccupationalHealth_Model["occupationalHealthId"]>(0, { nonNullable: true, validators: [] }),
                hscoId: new FormControl<Full_Model["hscoId"]>(0, { nonNullable: true, validators: [] }),
                dC_OccupationalHealthClassificationId: new FormControl<Health_OccupationalHealth_Model["dC_OccupationalHealthClassificationId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                dC_OccupationalHealthTypeId: new FormControl<Health_OccupationalHealth_Model["dC_OccupationalHealthTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
                groupedExposureServiceList: new FormControl<Health_OccupationalHealth_Model["groupedExposureServiceList"]>(undefined, { nonNullable: true, validators: [] }),
                aloneServiceList: new FormControl<Health_OccupationalHealth_Model["aloneServiceList"]>(undefined, { nonNullable: true, validators: [] }),
            }),
        ]),
    });

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            occupationalHealth: value.occupationalHealth?.map(oh => ({...oh, hscoId: value.hscoId})),
        }
    }
}
