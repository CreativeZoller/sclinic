import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Patient } from "../../models/patient.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { pairwise } from "rxjs";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { isBetweenDateRange, isFutureDate } from "../../../../../core/utility/validators/date.validator";
import { PatientIdTypeEnum } from "../../../../../../../api/enums/patientId-type.enum";
import { PatientIdTypeCategoryEnum } from "../../../../../../../api/enums/patientId-type-category.enum";
import { CoreModelsDTOsMasterDataJunctionTablesPatientXPatientIdTypeDTO } from "../../../../../../../api/models";
import { UnArray } from "../../../../../core/utility/types/un-array";
import { cannotContainNumbers } from "../../../../../core/utility/validators/notAllowNumbers.validator";


type Full_Model = Patient;
interface Extend_Patient_Model extends Full_Model {
    patientXSSNIdType: UnArray<Full_Model["patientXPatientIdType"]>;
}

@UntilDestroy()
@Component({
    selector: "app-patient-form",
    templateUrl: "./patient-form.component.html",
    styleUrls: ["./patient-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientFormComponent extends BaseFormComponent<Extend_Patient_Model> {

    public errorResourceKeyPrefix = "patient.form.errors";

    constructor() {
        super();

        this.form.valueChanges.pipe(
            untilDestroyed(this),
            pairwise()
        ).subscribe(([prev, curr]) => {
            if(this.skipResetingFields && !isEmpty(curr.birthLastName)) this.form.controls.birthLastName.markAsDirty();
            if(prev.surname !== curr.surname && !this.form.controls.birthLastName.dirty) {
                this.form.controls.birthLastName.setValue(curr.surname);
            }

            if(this.skipResetingFields && !isEmpty(curr.birthFirstName)) this.form.controls.birthFirstName.markAsDirty();
            if(prev.firstname !== curr.firstname && !this.form.controls.birthFirstName.dirty) {
                this.form.controls.birthFirstName.setValue(curr.firstname);
            }

            if(this.form.controls.isDeceased.value === true) {
                if (!this.form.controls.deathTime.enabled) {
                    if (!this.skipResetingFields) this.form.controls.deathTime.reset(undefined, { emitEvent: false });
                    this.form.controls.deathTime.enable();
                }
                if(!this.form.controls._deceasedDependentFg.disabled) {
                    this.form.controls._deceasedDependentFg.disable();
                }
                if(!this.form.controls.patientXSSNIdType.disabled) {
                    this.form.controls.patientXSSNIdType.disable();
                }
            } else {
                if (!this.form.controls.deathTime.disabled) {
                    if (!this.skipResetingFields) this.form.controls.deathTime.reset(undefined, { emitEvent: false });
                    this.form.controls.deathTime.disable();
                }
                if(!this.form.controls._deceasedDependentFg.enabled) {
                    this.form.controls._deceasedDependentFg.enable();
                }
                if(!this.form.controls.patientXSSNIdType.enabled) {
                    this.form.controls.patientXSSNIdType.enable();
                }
            }

            if (this.form.controls._deceasedDependentFg.enabled) {
                if(this.form.controls._deceasedDependentFg.controls.isBanned.value === true) {
                    if (!this.form.controls._deceasedDependentFg.controls.bannedComment.enabled) {
                        if (!this.skipResetingFields) this.form.controls._deceasedDependentFg.controls.bannedComment.reset(undefined, { emitEvent: false });
                        this.form.controls._deceasedDependentFg.controls.bannedComment.enable();
                    }
                } else {
                    if (!this.form.controls._deceasedDependentFg.controls.bannedComment.disabled) {
                        if (!this.skipResetingFields) this.form.controls._deceasedDependentFg.controls.bannedComment.reset(undefined, { emitEvent: false });
                        this.form.controls._deceasedDependentFg.controls.bannedComment.disable();
                    }
                }

                if(this.form.controls._deceasedDependentFg.controls.isInDebt.value === true) {
                    if (!this.form.controls._deceasedDependentFg.controls.debtComment.enabled) {
                        if (!this.skipResetingFields) this.form.controls._deceasedDependentFg.controls.debtComment.reset(undefined, { emitEvent: false });
                        this.form.controls._deceasedDependentFg.controls.debtComment.enable();
                    }
                } else {
                    if (!this.form.controls._deceasedDependentFg.controls.debtComment.disabled) {
                        if (!this.skipResetingFields) this.form.controls._deceasedDependentFg.controls.debtComment.reset(undefined, { emitEvent: false });
                        this.form.controls._deceasedDependentFg.controls.debtComment.disable();
                    }
                }
            }
        });
    }

    dc_DefaultNationality = (this.initData.dC_NationalityList.find(x => x.dto.isDefault)?.value || undefined);
    defaultPatientXDC_Language: Patient["patientXDC_Language"] = [{ dC_LanguageId: this.initData.dC_LanguageList.find(x => x.dto.isDefault)?.value ?? undefined, }];

    // Define a default patient TAJ Id object
    patientTAJId: CoreModelsDTOsMasterDataJunctionTablesPatientXPatientIdTypeDTO = { dC_PatientIdTypeId: PatientIdTypeEnum.SocialSecurityNumber, dC_PatientIdTypeCategoryId: PatientIdTypeCategoryEnum.OfficialIDCard};

    public form = new FormGroup({
        patientId: new FormControl<Patient["patientId"]>(undefined, { nonNullable: true, validators: [] }),
        // Személyes adatok
        // Titulus
        dC_TitleTypeId: new FormControl<Patient["dC_TitleTypeId"]>(undefined, { nonNullable: true, validators: [] }),
        // Vezetéknév
        surname: new FormControl<Patient["surname"]>(undefined, { nonNullable: true, validators: [Validators.required, cannotContainNumbers] }),
        // Keresztnév
        firstname: new FormControl<Patient["firstname"]>(undefined, { nonNullable: true, validators: [Validators.required, cannotContainNumbers] }),
        // Állampolgárság
        dC_NationalityId: new FormControl<Patient["dC_NationalityId"]>(this.dc_DefaultNationality, { nonNullable: true, validators: [Validators.required] }),
        // Születéskori vezetéknév
        birthLastName: new FormControl<Patient["birthLastName"]>(undefined, { nonNullable: true, validators: [Validators.required, cannotContainNumbers] }),
        // Születéskori keresztnév
        birthFirstName: new FormControl<Patient["birthFirstName"]>(undefined, { nonNullable: true, validators: [Validators.required, cannotContainNumbers] }),
        // Anyja neve
        motherName: new FormControl<Patient["motherName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Elhunyt
        isDeceased: new FormControl<Patient["isDeceased"]>(undefined, { nonNullable: true, validators: [] }),
        // Halál időpontja/dátuma
        deathTime: new FormControl<Patient["deathTime"]>(undefined, { nonNullable: true, validators: [Validators.required, isBetweenDateRange("_deceasedDependentFg.dateOfBirth", undefined)] }),

        // Taj szám
        patientXSSNIdType: new FormGroup({
            // Igazolvány típusa
            dC_PatientIdTypeId: new FormControl<UnArray<Patient["patientXPatientIdType"]>["dC_PatientIdTypeId"]>(undefined, { nonNullable: true, validators: [] }),
            // Igazolvány száma
            number: new FormControl<UnArray<Patient["patientXPatientIdType"]>["number"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.maxLength(9)] }),
            // Kategória
            dC_PatientIdTypeCategoryId: new FormControl<UnArray<Patient["patientXPatientIdType"]>["dC_PatientIdTypeCategoryId"]>(undefined, { nonNullable: true, validators: [] }),
            // Kiállítás dátuma
            issueDate: new FormControl<UnArray<Patient["patientXPatientIdType"]>["issueDate"]>(undefined, { nonNullable: true, validators: [isBetweenDateRange("_deceasedDependentFg.dateOfBirth", undefined)] }),
        }),
        // This fg will be disabled if patient is deceased
        _deceasedDependentFg: new FormGroup({
            // Születési hely
            placeOfBirth: new FormControl<Patient["placeOfBirth"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Születési dátum
            dateOfBirth: new FormControl<Patient["dateOfBirth"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // VIP státusz
            dC_VIPId: new FormControl<Patient["dC_VIPId"]>(undefined, { nonNullable: true, validators: [] }),
            // Neme
            dC_GenderId: new FormControl<Patient["dC_GenderId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Címek
            patientXAddress: new FormControl<Patient["patientXAddress"]>([], { nonNullable: true, validators: [] }),
            // Egyéb elérhetőségek
            patientXContact: new FormControl<Patient["patientXContact"]>([], { nonNullable: true, validators: [] }),
            // Komminukációs nyelv
            patientXDC_Language: new FormControl<Patient["patientXDC_Language"]>(this.defaultPatientXDC_Language, { nonNullable: true, validators: [] }),
            // Munkahely és munkakör
            patientXEmployment: new FormControl<Patient["patientXEmployment"]>([], { nonNullable: true, validators: [] }),

            // Igazolvány adatok
            patientXPatientIdType: new FormControl<Patient["patientXPatientIdType"]>([], { nonNullable: true, validators: [] }),

            // Biztosítási és egészségpénztári adatok
            patientInsuranceDetail: new FormControl<Patient["patientInsuranceDetail"]>([], { nonNullable: true, validators: [] }),
            // Páciens hozzátartozóinak kapcsolata
            patientXPatient: new FormControl<Patient["patientXPatient"]>([], { nonNullable: true, validators: [] }),
            // Megjegyzések
            // Publikus megjegyzés
            publicComment: new FormControl<Patient["publicComment"]>(undefined, { nonNullable: true, validators: [] }),
            // Belső megjegyzés
            internalComment: new FormControl<Patient["internalComment"]>(undefined, { nonNullable: true, validators: [] }),
            // Kitiltva
            isBanned: new FormControl<Patient["isBanned"]>(undefined, { nonNullable: true, validators: [] }),
            // Kitiltás indoklása
            bannedComment: new FormControl<Patient["bannedComment"]>(undefined, { nonNullable: true, validators: [] }),
            // Tartozása van
            isInDebt: new FormControl<Patient["isInDebt"]>(undefined, { nonNullable: true, validators: [] }),
            // Tartozás indoklása
            debtComment: new FormControl<Patient["debtComment"]>(undefined, { nonNullable: true, validators: [] }),
        }),
    });

    public setFormValue(data: Extend_Patient_Model | undefined | null) {
        super.setFormValue(<any>{
            ...data,
            _deceasedDependentFg: {
                ...data,
            },
        });
    };

    public getFormValue(raw?: boolean): any {
        const { _deceasedDependentFg, ...value } = raw ? this.form.getRawValue() : this.form.value;

        return {
            ...value,
            ..._deceasedDependentFg,
        }
    }

    @Input() public set editorData(data: Extend_Patient_Model | undefined | null) {
        const patientIdType = data?.patientXPatientIdType?.filter(x => x.dC_PatientIdTypeId !== PatientIdTypeEnum.SocialSecurityNumber);
        const patientSSNId = data?.patientXPatientIdType?.find(x => x.dC_PatientIdTypeId === PatientIdTypeEnum.SocialSecurityNumber) ?? this.patientTAJId;

        const _extendData: Extend_Patient_Model = {
            ...data,
            patientXPatientIdType: patientIdType,
            patientXSSNIdType: patientSSNId,
        };

        this.initialEditorData$.next(_extendData);
        this.setFormValue(_extendData);
        this.cdr.markForCheck();
    };

    public formValueToRequestValue(value: Extend_Patient_Model): Extend_Patient_Model {
        const { _deceasedDependentFg } = this.form.getRawValue();

        return {
            ...value,
            ..._deceasedDependentFg,
            patientXPatientIdType: [
                value.patientXSSNIdType,
                ...(_deceasedDependentFg?.patientXPatientIdType ?? []),
            ],
        };
    }
}
