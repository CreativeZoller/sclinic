import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { pairwise } from "rxjs";
import { PatientIdTypeCategoryEnum } from "src/api/enums/patientId-type-category.enum";
import { PatientIdTypeEnum } from "src/api/enums/patientId-type.enum";
import { CoreModelsDTOsMasterDataJunctionTablesPatientXPatientIdTypeDTO } from "src/api/models";
import { InitPageData } from "src/app/modules/app-common/init-page-data-provider/models/init-page-data.model";
import { InitPageDataProviderService } from "src/app/modules/app-common/init-page-data-provider/services/init-page-data-provider.service";
import { BaseFormComponent } from "src/app/modules/app-common/utility/base-form-component/base-form-component.directive";
import { UnArray } from "src/app/modules/core/utility/types/un-array";
import { isFutureDate } from "src/app/modules/core/utility/validators/date.validator";
import { Patient } from "src/app/modules/feature/master-data/patients/models/patient.model";

type Full_Model = Patient;
interface Extend_Patient_Model extends Full_Model {
    patientXSSNIdType: UnArray<Full_Model["patientXPatientIdType"]>;
}

@UntilDestroy()
@Component({
    selector: "app-cc-patient-form",
    templateUrl: "./patient-form.component.html",
    styleUrls: ["./patient-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CcPatientFormComponent extends BaseFormComponent<Extend_Patient_Model> {
    private initPageDataProviderService = inject(InitPageDataProviderService);
    public initData: InitPageData = this.initPageDataProviderService.getInitData(this.activatedRoute.snapshot);
    public errorResourceKeyPrefix = "patient.form.errors";

    constructor() {
        super();
        
        this.form.valueChanges.pipe(
            untilDestroyed(this),
            pairwise()
        ).subscribe(([prev, curr]) => { 
            if(this.skipResetingFields && (curr?.birthLastName != '' || curr?.birthLastName != null)) this.form.controls.birthLastName.markAsDirty();
            if(prev.surname !== curr.surname && !this.form.controls.birthLastName.dirty) {
                this.form.controls.birthLastName.setValue(curr.surname);
            }

            if(this.skipResetingFields && (curr?.birthFirstName != '' || curr?.birthFirstName != null)) this.form.controls.birthFirstName.markAsDirty();
            if(prev.firstname !== curr.firstname && !this.form.controls.birthFirstName.dirty) {
                this.form.controls.birthFirstName.setValue(curr.firstname);
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
        surname: new FormControl<Patient["surname"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Keresztnév
        firstname: new FormControl<Patient["firstname"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Állampolgárság
        dC_NationalityId: new FormControl<Patient["dC_NationalityId"]>(this.dc_DefaultNationality, { nonNullable: true, validators: [Validators.required] }),
        // Születéskori vezetéknév
        birthLastName: new FormControl<Patient["birthLastName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Születéskori keresztnév
        birthFirstName: new FormControl<Patient["birthFirstName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Anyja neve
        motherName: new FormControl<Patient["motherName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Taj szám
        patientXSSNIdType: new FormGroup({
            // Igazolvány típusa
            dC_PatientIdTypeId: new FormControl<UnArray<Patient["patientXPatientIdType"]>["dC_PatientIdTypeId"]>(undefined, { nonNullable: true, validators: [] }),
            // Igazolvány száma
            number: new FormControl<UnArray<Patient["patientXPatientIdType"]>["number"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Kategória
            dC_PatientIdTypeCategoryId: new FormControl<UnArray<Patient["patientXPatientIdType"]>["dC_PatientIdTypeCategoryId"]>(undefined, { nonNullable: true, validators: [] }),
            // Kiállítás dátuma
            issueDate: new FormControl<UnArray<Patient["patientXPatientIdType"]>["issueDate"]>(undefined, { nonNullable: true, validators: [] }),
        }),
        // This fg will be disabled if patient is deceased
        _deceasedDependentFg: new FormGroup({
            // Születési hely
            placeOfBirth: new FormControl<Patient["placeOfBirth"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
            // Születési dátum
            dateOfBirth: new FormControl<Patient["dateOfBirth"]>(undefined, { nonNullable: true, validators: [Validators.required, isFutureDate()] }),
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
            // Túlhasználó
            isOveruser: new FormControl<Patient["overuser"]>(undefined, { nonNullable: true, validators: [] }),
        }),
    });


    @Input() public set editorData(data: Extend_Patient_Model | undefined | null) {
        const patientIdType = data?.patientXPatientIdType?.filter(x => x.dC_PatientIdTypeId !== PatientIdTypeEnum.SocialSecurityNumber);
        const patientSSNId = data?.patientXPatientIdType?.find(x => x.dC_PatientIdTypeId === PatientIdTypeEnum.SocialSecurityNumber) ?? this.patientTAJId;

        const _extendData: Extend_Patient_Model = {
            ...data,
            patientXPatientIdType: patientIdType,
            patientXSSNIdType: patientSSNId,
        };
        super.editorData = _extendData;
    };

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
