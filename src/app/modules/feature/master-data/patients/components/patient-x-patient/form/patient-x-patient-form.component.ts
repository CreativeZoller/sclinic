import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { BehaviorSubject, combineLatest, map, shareReplay } from "rxjs";
import { PatientXPatient } from "../../../models/patient-x-patient.model";


type Full_Model = PatientXPatient;

@UntilDestroy()
@Component({
    selector: "app-patient-x-patient-form",
    templateUrl: "./patient-x-patient-form.component.html",
    styleUrls: ["./patient-x-patient-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientXPatientFormComponent extends BaseFormComponent<Full_Model> {

    @Input() public baseResourceKey = "patient.x.patient";
    public get errorResourceKeyPrefix() { return this.baseResourceKey + ".form.errors"; }

    public form = new FormGroup({
        // kapcsolatban levő páciens
        relatedPatient: new FormControl<Full_Model["relatedPatient"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
    });

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            relatedPatientId: value.relatedPatient?.patientId ?? value.patientId,
            relatedPatient: undefined,
        }
    };

    @Input() allPatients: NonNullable<PatientXPatient["relatedPatient"]>[] = [];
    @Output() refreshAllPatients = new EventEmitter<void>();

    protected allSelectedPatients$ = new BehaviorSubject<NonNullable<PatientXPatient["relatedPatient"]>[]>([]);
    @Input() set allSelectedPatients(list: NonNullable<PatientXPatient["relatedPatient"]>[] | null | undefined) {
        this.allSelectedPatients$.next(list ?? []);
    };

    protected allUnselectablePatients$ = combineLatest([
        this.allSelectedPatients$,
    ]).pipe(
        map(([allSelectedPatients]) => {
            return allSelectedPatients;
        }),
        shareReplay(1),
    )
}
