import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { combineLatest, distinctUntilChanged, map, Observable, of, shareReplay } from "rxjs";
import { BaseFormComponent } from "src/app/modules/app-common/utility/base-form-component/base-form-component.directive";
import { SelectOption } from "src/app/modules/core/utility/types/select-option";
import { isBetweenDateRange } from "src/app/modules/core/utility/validators/date.validator";
import { PatientXId } from "src/app/modules/feature/master-data/patients/models/patient-x-id.model";


type Full_Model = PatientXId;

@UntilDestroy()
@Component({
    selector: "app-cc-patient-id-form",
    templateUrl: "./patient-id-form.component.html",
    styleUrls: ["./patient-id-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CcPatientIdFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    public errorResourceKeyPrefix = "patient.id.form.errors";

    @Input() public allSelectedPatientIdTypeIds$: Observable<NonNullable<Full_Model["dC_PatientIdTypeId"]>[]> = of([]);

    public patientIdTypeOptions$: Observable<SelectOption<NonNullable<Full_Model["dC_PatientIdTypeId"]>>[]> = of([]);

    public ngOnInit(): void {
        this.patientIdTypeOptions$ = combineLatest([
            (this.allSelectedPatientIdTypeIds$ ?? of([])),
            this.initialEditorData$,
        ]).pipe(
            map(([allSelectedPatientIdTypeIds, initialEditorData]) => {
                return this.initData.dC_PatientIdTypeList.filter((opt) => {
                    return !allSelectedPatientIdTypeIds.includes(opt.value)
                        || initialEditorData?.dC_PatientIdTypeId === opt.value
                })
            }),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }

    public form = new FormGroup({
        // Igazolvány típusa
        dC_PatientIdTypeId: new FormControl<Full_Model["dC_PatientIdTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Igazolvány száma
        number: new FormControl<Full_Model["number"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Kategória
        dC_PatientIdTypeCategoryId: new FormControl<Full_Model["dC_PatientIdTypeCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Kiállítás dátuma
        issueDate: new FormControl<Full_Model["issueDate"]>(undefined, { nonNullable: true, validators: [Validators.required, isBetweenDateRange(undefined, 'expirationDate')] }),
        // Érvényesség dátuma
        expirationDate: new FormControl<Full_Model["expirationDate"]>(undefined, { nonNullable: true, validators: [Validators.required, isBetweenDateRange('issueDate', undefined)] }),
        // Megjegyzés
        comment: new FormControl<Full_Model["comment"]>(undefined, { nonNullable: true, validators: [] }),
        // Létrehozó
        createdBy_UserName: new FormControl<Full_Model["createdBy_UserName"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [] }),
        // Létrehozás dátuma
        creationDate: new FormControl<Full_Model["creationDate"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [] }),
        // Utolsó módosító
        lastModifiedBy_UserName: new FormControl<Full_Model["lastModifiedBy_UserName"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [] }),
        // Utolsó módosítás dátuma
        lastModifiedDate: new FormControl<Full_Model["lastModifiedDate"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [] }),
    });
}
