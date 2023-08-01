import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ExposureTypeEnum } from "../../../../../../../api/enums";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { Exposure } from "../../models/exposure.model";


type Full_Model = Exposure;

@UntilDestroy()
@Component({
    selector: "app-exposure-form",
    templateUrl: "./exposure-form.component.html",
    styleUrls: ["./exposure-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExposureFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "exposure.form.errors";

    public form = new FormGroup({
        // Azonosító
        exposureId: new FormControl<Full_Model["exposureId"]>(0, { nonNullable: true, validators: [] }),

        // Expozíció
        description: new FormControl<Full_Model["description"]>({ value: "", disabled: true }, { nonNullable: true, validators: [] }),

        // Expozíció paraméterei
        _exposureXExposureItem: new FormGroup({
            // Teljes expozíciós paraméterek
            [ExposureTypeEnum.COMPLETE]: new FormControl<Full_Model["exposureXExposureItem"]>([], { nonNullable: true, validators: [] }),

            // Részleges expozíciós paraméterek
            [ExposureTypeEnum.PARTIAL]: new FormControl<Full_Model["exposureXExposureItem"]>([], { nonNullable: true, validators: [] }),
        }),
    });

    public setFormValue(data: Full_Model | null | undefined): void {
        super.setFormValue({
            ...data,
            _exposureXExposureItem: {
                [ExposureTypeEnum.COMPLETE]: data?.exposureXExposureItem?.filter(ei => ei.dC_ExposureTypeId === ExposureTypeEnum.COMPLETE) ?? [],
                [ExposureTypeEnum.PARTIAL]: data?.exposureXExposureItem?.filter(ei => ei.dC_ExposureTypeId === ExposureTypeEnum.PARTIAL) ?? [],
            },
        } as any);
    }

    public getFormValue(raw?: boolean | undefined): Full_Model {
        const { _exposureXExposureItem, ...value} = super.getFormValue(raw) as typeof this.form.value;

        return {
            ...value,
            exposureXExposureItem: [
                ...(_exposureXExposureItem?.[ExposureTypeEnum.COMPLETE] ?? [])
                    .map(ei => ({ ...ei, dC_ExposureTypeId: ExposureTypeEnum.COMPLETE })),
                ...(_exposureXExposureItem?.[ExposureTypeEnum.PARTIAL] ?? [])
                    .map(ei => ({ ...ei, dC_ExposureTypeId: ExposureTypeEnum.PARTIAL })),
            ],
        }
    }

    constructor() {
        super();

        // Sync exposure items with the same ID in the two array
        const completeExposureItemsCtrl = this.form.controls._exposureXExposureItem.controls[ExposureTypeEnum.COMPLETE];
        const partialExposureItemsCtrl = this.form.controls._exposureXExposureItem.controls[ExposureTypeEnum.PARTIAL];

        completeExposureItemsCtrl.valueChanges.pipe(
            untilDestroyed(this),
        ).subscribe((completeExposureItems) => {
            partialExposureItemsCtrl.setValue(
                (partialExposureItemsCtrl.value ?? []).map(pei => {
                    if ((pei.exposureItem?.exposureItemId ?? 0) > 0) {
                        const sameExposureItem = completeExposureItems?.find(cei => cei.exposureItem?.exposureItemId === pei.exposureItem?.exposureItemId)?.exposureItem;

                        if (sameExposureItem != null) {
                            pei.exposureItem = {
                                ...pei.exposureItem,
                                ...sameExposureItem,
                            };
                        }
                    }

                    return pei;
                }),
                { emitEvent: false }
            )
        });

        partialExposureItemsCtrl.valueChanges.pipe(
            untilDestroyed(this),
        ).subscribe((partialExposureItems) => {
            completeExposureItemsCtrl.setValue(
                (completeExposureItemsCtrl.value ?? []).map(cei => {
                    if ((cei.exposureItem?.exposureItemId ?? 0) > 0) {
                        const sameExposureItem = partialExposureItems?.find(pei => pei.exposureItem?.exposureItemId === cei.exposureItem?.exposureItemId)?.exposureItem;

                        if (sameExposureItem != null) {
                            cei.exposureItem = {
                                ...cei.exposureItem,
                                ...sameExposureItem,
                            };
                        }
                    }

                    return cei;
                }),
                { emitEvent: false }
            )
        });
    }
}
