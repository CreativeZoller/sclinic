import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { UnArray } from "../../../../../../core/utility/types/un-array";
import { arrayMinLength } from "../../../../../../core/utility/validators/array-min-length.validator";
import { notNullish } from "../../../../../../core/utility/validators/not-nullish.validator";
import { MedicalEmployeeXContract } from "../../../models/medical-employee-x-contract.model";
import { MedicalEmployeeXContractScheduleEntry } from "../../../models/medical-employee-x-contract-schedule-entry.model";


type Full_Model = MedicalEmployeeXContract;
type Full_Model_Period = UnArray<MedicalEmployeeXContract["medicalContractPeriod"]>;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-contract-form",
    templateUrl: "./medical-employee-contract-form.component.html",
    styleUrls: ["./medical-employee-contract-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalEmployeeContractFormComponent extends BaseFormComponent<Full_Model> implements OnInit{

    public errorResourceKeyPrefix = "medical.employee.contract.form.errors";

    public form = new FormGroup({
        // Azonosító
        medicalContractId: new FormControl<Full_Model["medicalContractId"]>(0, { nonNullable: true, validators: [] }),

        // Szerződés száma
        medicalContractNumber: new FormControl<Full_Model["medicalContractNumber"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

        // Szerződés megnevezése
        medicalContractName: new FormControl<Full_Model["medicalContractName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

        _period: new FormGroup({
            // Ellátóhelyek
            medicalContractPeriodXClinic: new FormControl<Full_Model_Period["medicalContractPeriodXClinic"]>([], { nonNullable: true, validators: [arrayMinLength(1)]}),

            // Szerződés típusa
            // Ügyeletes?
            isDuty: new FormControl<Full_Model["isDuty"]>(false, { nonNullable: true, validators: []}),
            // Munkavállaló
            isEmployee: new FormControl<Full_Model_Period["isEmployee"]>(false, { nonNullable: true, validators: []}),
            // Szerződés típusa: óradíjas / leadós.  TRUE: Óradíjas  FALSE: Leadós
            isHourlyRate: new FormControl<Full_Model_Period["isHourlyRate"]>(false, { nonNullable: true, validators: []}),
            // Lemond. jut.?
            isCancelCommission: new FormControl<Full_Model_Period["isCancelCommission"]>(false, { nonNullable: true, validators: []}),
            // Fizetett ebédidő?
            isPaidLunchBreak: new FormControl<Full_Model_Period["isPaidLunchBreak"]>(false, { nonNullable: true, validators: []}),
            // Fizetett utazási idő?
            isPaidTravelTime: new FormControl<Full_Model_Period["isPaidTravelTime"]>(false, { nonNullable: true, validators: []}),

            _scheduleEntries: new FormControl<MedicalEmployeeXContractScheduleEntry[]>([], { nonNullable: true, validators: [notNullish(), arrayMinLength(1)]}),

            // A hét? / B hét? / C hét? / D hét
            dC_WeekTypeIdFg: new FormGroup({
                ...this.initData.dC_WeekTypeList.map((opt) => ({
                    [opt.value]: new FormControl<boolean>(true, { nonNullable: true, validators: []}),
                })).reduce((pv, cv) => ({ ...pv, ...cv }), {}),
            }, {
                validators: [ this.selectionFgArrayMinLengthValidator(1) ],
            }),

            // Hétfő? / Kedd? / Szerda? / Csütörtök? / Péntek? / Szombat? / Vasárnap?
            dC_DayIdFg: new FormGroup({
                ...this.initData.dC_DayList.map((opt) => ({
                    [opt.value]: new FormControl<boolean>(false, { nonNullable: true, validators: []}),
                })).reduce((pv, cv) => ({ ...pv, ...cv }), {}),
            }, {
                validators: [ this.selectionFgArrayMinLengthValidator(1) ],
            }),
        }),

        medicalContractPeriodCommission: new FormControl<Full_Model["medicalContractPeriodCommission"]>([], { nonNullable: true, validators: [notNullish()] }),
    });

    private selectionFgArrayMinLengthValidator(requiredLength: number) {
        return (ctrl: AbstractControl) => {
            if (ctrl instanceof FormGroup) {
                const selectedLength = Object.entries(ctrl.getRawValue())
                    .filter((entry) => entry[1] === true)
                    .length;

                if (selectedLength < requiredLength) return {
                    arrayMinLength: {
                        actual: selectedLength,
                        requiredLength: requiredLength,
                    },
                };
            }

            return null;
        }
    }

    private savedMedicalContractPeriodIds: number[] = [];

    // Convert outer value to inner value
    public setFormValue(data: Full_Model | undefined | null) {
        const selectedWeekTypeIdMap: { [key: number ]: boolean } = {};
        const selectedDayIdMap: { [key: number ]: boolean } = {};

        this.savedMedicalContractPeriodIds = (data?.medicalContractPeriod ?? []).map(p => p.medicalContractPeriodId!);
        for (const period of data?.medicalContractPeriod ?? []) {
            if (period.dC_DayId != null) selectedDayIdMap[period.dC_DayId] = true;
            if (period.dC_WeekTypeId != null) selectedWeekTypeIdMap[period.dC_WeekTypeId] = true;
        }

        // _scheduleEntries will be the entries without day and week information,
        // so lock a selected week and day and filter the list by it
        const lockedWeekTypeId = Number.parseFloat(Object.keys(selectedWeekTypeIdMap)?.[0]);
        const lockedDayId = Number.parseFloat(Object.keys(selectedDayIdMap)?.[0]);
        const _scheduleEntries: MedicalEmployeeXContractScheduleEntry[] = (data?.medicalContractPeriod ?? []).filter(period => {
            return period.dC_WeekTypeId === lockedWeekTypeId && period.dC_DayId === lockedDayId
        })

        const _data = {
            ...data,
            _period: {
                ...data,
                ...data?.medicalContractPeriod?.[0],
                dC_WeekTypeIdFg: {
                    ...(data == null)
                        ? {}
                        : Object.keys(this.form.getRawValue()._period.dC_WeekTypeIdFg)
                            .map((id) => ({[id]: false}))
                            .reduce((pv, cv) => ({...pv, ...cv}), {}),
                    ...selectedWeekTypeIdMap,
                },
                dC_DayIdFg: {
                    ...(data == null)
                        ? {}
                        : Object.keys(this.form.getRawValue()._period.dC_DayIdFg)
                            .map((id) => ({[id]: false}))
                            .reduce((pv, cv) => ({...pv, ...cv}), {}),
                    ...selectedDayIdMap,
                },
                _scheduleEntries: _scheduleEntries,
            }
        }

        super.setFormValue(_data);
    };

    // Convert inner value to outer value
    public getFormValue(raw?: boolean): Full_Model {
        const { _period, ...restValue } = raw ? this.form.getRawValue() : this.form.value;
        const {
            dC_DayIdFg,
            dC_WeekTypeIdFg,
            _scheduleEntries,
            ...restPeriodValue
        } = _period ?? {};

        const selectedDayIdList = Object.entries(dC_DayIdFg ?? {})
            .filter((entry) => entry[1] === true)
            .map(entry => Number.parseFloat(entry[0]));

        const selectedWeekTypeIdList = Object.entries(dC_WeekTypeIdFg ?? {})
            .filter((entry) => entry[1] === true)
            .map(entry => Number.parseFloat(entry[0]));

        const medicalContractPeriod: Full_Model_Period[] = [];
        for (const selectedDayId of selectedDayIdList)
        for (const selectedWeekTypeId of selectedWeekTypeIdList)
        for (const scheduleEntry of _scheduleEntries ?? []) {
            medicalContractPeriod.push({
                dC_DayId: selectedDayId,
                dC_WeekTypeId: selectedWeekTypeId,
                ...scheduleEntry,
                ...restPeriodValue,
            });
        }

        for (let i = 0; i < medicalContractPeriod.length; i++) {
            medicalContractPeriod[i].medicalContractPeriodId = this.savedMedicalContractPeriodIds[i] ?? 0;
        }

        return {
            ...restValue,
            isDuty: _period?.isDuty ?? false,
            medicalContractPeriod: medicalContractPeriod,
        };
    };

    ngOnInit() {
        this.form.controls._period.valueChanges.pipe(
            untilDestroyed(this),
        ).subscribe(() => {
            // Szerződés típusa: óradíjas / leadós.
            //TRUE: Óradíjas
            //FALSE: Leadós => Leadós és Munkavállaló egyszerre nem lehet aktív

            if(!this.form.controls._period.controls.isHourlyRate.value) {
                if (this.form.controls._period.controls.isEmployee.enabled) {
                    this.form.controls._period.controls.isEmployee.reset(undefined, { emitEvent: false });
                    this.form.controls._period.controls.isEmployee.disable();
                }
            } else {
                if (this.form.controls._period.controls.isEmployee.disabled) {
                    this.form.controls._period.controls.isEmployee.enable();
                }
            }
        });
    }
}
