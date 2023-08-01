import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { Full_Model_ClinicRoom } from "../../../models/clinic-x-room.mode";


type Full_Model = Full_Model_ClinicRoom;

@UntilDestroy()
@Component({
    selector: "app-clinic-room-form",
    templateUrl: "./clinic-room-form.component.html",
    styleUrls: ["./clinic-room-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicRoomFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "clinic.room.form.errors";
    @Input() public clinicName: string | undefined = "";

    public form = new FormGroup({
        // Cím típus
        dC_FloorId: new FormControl<Full_Model["dC_FloorId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        name: new FormControl<Full_Model["name"]>(undefined, { nonNullable: true, validators: [] }),
        roomNumber: new FormControl<Full_Model["roomNumber"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    });

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            name: "", // TODO this.clinicName
        }
    }
}
