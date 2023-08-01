import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DivisionNumber, Grid_DivisionNumber } from "../../models/division-number.model";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { pairwise } from "rxjs";
import { EndpointExportSelectOptionValue } from "../../../../../core/utility/types/endpoint-export-select-option-value";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";


type Grid_Model = Grid_DivisionNumber;
type Full_Model = DivisionNumber;

@UntilDestroy()
@Component({
    selector: "app-division-number-form",
    templateUrl: "./division-number-form.component.html",
    styleUrls: ["./division-number-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DivisionNumberFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "division.number.form.errors";

    constructor() {
        super();

        this.form.valueChanges.pipe(
            untilDestroyed(this),
            pairwise()
        ).subscribe(([prev, curr]) => {
            const value = this.form.getRawValue();

            for (let i = 0; i < (curr?.divisionNumberXField?.length ?? 0); ++i) {
                const prevFieldName = prev?.divisionNumberXField?.[i]?.fieldName;
                const currFieldName = curr?.divisionNumberXField?.[i]?.fieldName;

                if (prevFieldName !== currFieldName) {
                    const fieldValueCtrl = this.form.controls.divisionNumberXField.controls[i].controls.fieldValue;
                    if (!this.skipResetingFields) fieldValueCtrl.reset(undefined, { emitEvent: false });

                    if (currFieldName?.nullable ?? false) {
                        if (fieldValueCtrl.hasValidator(Validators.required)) fieldValueCtrl.removeValidators(Validators.required);
                    } else {
                        if (!fieldValueCtrl.hasValidator(Validators.required)) fieldValueCtrl.addValidators(Validators.required);
                    }

                    fieldValueCtrl.updateValueAndValidity();
                }
            }

            for (const fg of this.form.controls.divisionNumberXField.controls) {
                if (isEmpty(fg.controls.fieldName.value)) {
                    if (!fg.controls.fieldValue.disabled) {
                        fg.controls.fieldValue.reset(undefined, { emitEvent: false });
                        fg.controls.fieldValue.disable();
                    }
                } else {
                    if (!fg.controls.fieldValue.enabled) {
                        fg.controls.fieldValue.reset(undefined, { emitEvent: false });
                        fg.controls.fieldValue.enable();
                    }
                }
            }

            if (value.divisionNumberXField.every(field => !isEmpty(field?.fieldName) && !isEmpty(field?.fieldValue))) {
                this.form.controls.divisionNumberXField.push(
                    this.createNewDivisionNumberXFieldFg()
                )
            }
        });
    }

    private createNewDivisionNumberXFieldFg() {
        return new FormGroup({
            // Mező
            fieldName: new FormControl<EndpointExportSelectOptionValue | undefined>(undefined, { nonNullable: true, validators: []}),
            // Érték
            fieldValue: new FormControl<any>(undefined, { nonNullable: true, validators: [Validators.required] }),
        })
    }

    dc_DefaultStatus = (this.initData.dC_StatusList.find(x => x.dto.isDefault)?.value || undefined);

    public form = new FormGroup({
        // Konfiguráció neve
        name: new FormControl<DivisionNumber["name"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Érték
        value: new FormControl<DivisionNumber["value"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Státusz
        dC_StatusId: new FormControl<DivisionNumber["dC_StatusId"]>(this.dc_DefaultStatus, { nonNullable: true, validators: [Validators.required] }),
        // Mező-Érték array
        divisionNumberXField: new FormArray([
            this.createNewDivisionNumberXFieldFg()
        ])
    });

    public stringifyFieldValue(fieldName: EndpointExportSelectOptionValue | undefined | null, value: any) {
        if (value == null) return undefined;
        if (fieldName?.type === "Date") return (value as Date).toISOString();

        return value.toString();
    }

    public parseFieldValue(fieldName: EndpointExportSelectOptionValue | undefined | null, value: string | null | undefined): any {
        if (value == null) return undefined;
        if (fieldName?.type === "number") return Number.parseFloat(value);
        if (fieldName?.type === "boolean") return value === "true";
        if (fieldName?.type === "Date") return new Date(value);

        return value;
    }

    public setFormValue(data: Full_Model | null | undefined): void {
        this.form.reset();
        this.form.controls.divisionNumberXField.clear({ emitEvent: false });

        const neededLength = data?.divisionNumberXField?.length ?? 0;
        while (neededLength > (this.form.controls.divisionNumberXField?.length ?? Infinity)) {
            this.form.controls.divisionNumberXField.push(
                this.createNewDivisionNumberXFieldFg(),
                { emitEvent: false },
            );
        }

        this.form.controls.divisionNumberXField.push(
            this.createNewDivisionNumberXFieldFg(),
            { emitEvent: false },
        );

        if (data != null) {
            const transformedData = {
                ...data,
                divisionNumberXField: data.divisionNumberXField?.map?.((field) => {
                    const fieldNameOption = this.initData.divisionNumberXFieldOptions.find(o => `MasterDataManagementEngine.${o.value.path}` === field?.fieldName);
                    return {
                        fieldName: fieldNameOption?.value,
                        fieldValue: this.parseFieldValue(fieldNameOption?.value, field?.fieldValue),
                    }
                })
            }

            this.skipResetingFields = true;
            this.form.patchValue(transformedData);
            this.skipResetingFields = false;
        }
    }

    public getFormValue(raw?: boolean | undefined): Full_Model {
        const value = raw ? this.form.getRawValue() : this.form.value;

        return {
            ...value,
            divisionNumberXField: value.divisionNumberXField
                ?.filter?.((field) => field.fieldName != null)
                ?.map?.((field) => {
                    return {
                        fieldName: `MasterDataManagementEngine.${field?.fieldName?.path}`,
                        fieldValue: this.stringifyFieldValue(field?.fieldName, field?.fieldValue),
                    }
                })
        }
    }
}
