import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { InitPageData } from "../../../../../../app-common/init-page-data-provider/models/init-page-data.model";
import { ClinicOpenHours } from "../../../models/clinic-open-hours.model";
import { DayEnum } from "../../../../../../../../api/enums";
import { $enum } from "ts-enum-util";
import { ActivatedRoute } from "@angular/router";
import { BaseControlValueAccessorWithForm } from "../../../../../../app-common/utility/base-control-value-acessor-with-form/base-control-value-acessor-with-form.directive";
import addHours from "date-fns/addHours";
import { isEmpty } from "../../../../../../core/utility/methods/is-empty";


type Full_Model = ClinicOpenHours;

@UntilDestroy()
@Component({
    selector: "app-clinic-open-hours-form-field",
    templateUrl: "./clinic-open-hours-form-field.component.html",
    styleUrls: ["./clinic-open-hours-form-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicOpenHoursFormFieldComponent extends BaseControlValueAccessorWithForm<Full_Model[]> {

    private activatedRoute = inject(ActivatedRoute);

    public initData = this.activatedRoute.snapshot.data["init"] as InitPageData;
    public errorResourceKeyPrefix = "clinic.open.hours.form.errors";

    public constants = {
        DayEnum: DayEnum,
    }

    public dayConfigs = $enum(DayEnum).getEntries().map(([key, value]) => {
        const isWeekend = value === DayEnum.SATURDAY || value === DayEnum.SUNDAY;

        return {
            dayId: value,
            resourceKeyPart: key.toString().toLowerCase(),
            defaultValues: <Partial<Full_Model>>{
                startTime: isWeekend ? undefined : addHours(new Date(0), 8).toISOString(),
                endTime: isWeekend ? undefined : addHours(new Date(0), 20).toISOString(),
            },
        };
    });

    public form = new FormGroup({
        ...this.mergeObjects(
            this.dayConfigs.map(({dayId, defaultValues}) => ({
                [dayId]: new FormGroup({
                    dC_DayId: new FormControl<Full_Model["dC_DayId"]>(dayId, { nonNullable: true, validators: [] }),
                    startTime: new FormControl<Full_Model["startTime"]>(defaultValues.startTime, { nonNullable: true, validators: [] }),
                    endTime: new FormControl<Full_Model["endTime"]>(defaultValues.endTime, { nonNullable: true, validators: [] })
                }, [
                    (ctrl: AbstractControl) => {
                        if (!(ctrl instanceof FormGroup)) return null;

                        const sameEmptyness = (arr: any[]) => arr.every((v, i, _arr) => isEmpty(v) === isEmpty(_arr[0]))

                        const isValid = sameEmptyness([
                            ctrl.controls["startTime"]?.value,
                            ctrl.controls["endTime"]?.value,
                        ]);

                        return isValid ? null : { "open.hours.all.or.none.required": true };
                    },
                ]),
            }))
        ),
    });

    public readValue(): Full_Model[] {
        const value = this.form.getRawValue();
        return Object.values(value);
    }

    public writeValue(value?: Full_Model[]): void {
        const transformedValue = this.mergeObjects(
            (value ?? [])
                .filter(x => x?.dC_DayId != null)
                .map((x) => ({ [x.dC_DayId!]: {...x} }))
        );

        this.form.patchValue(transformedValue);
    }

    private mergeObjects<T extends {}>(objList: T[]): T {
        return (objList ?? []).reduce((pv, cv) => ({...cv, ...pv}), {}) as T;
    }
}
