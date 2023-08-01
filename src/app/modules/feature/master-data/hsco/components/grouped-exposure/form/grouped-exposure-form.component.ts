import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { CoreModelsDTOsMasterDataMainTablesExposureDTO, CoreModelsDTOsMasterDataMainTablesExposureItemDTO } from "../../../../../../../../api/models";
import { distinctUntilChanged, map, shareReplay, startWith } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { GroupedExposureServiceList } from "../../../models/occupational.health.service.model";


type Full_Model = GroupedExposureServiceList;

@UntilDestroy()
@Component({
    selector: "app-grouped-exposure-form",
    templateUrl: "./grouped-exposure-form.component.html",
    styleUrls: ["./grouped-exposure-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedExposureFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "occupational.health.service.form.errors";

    public form = new FormGroup({
        exposureId: new FormControl<Full_Model["exposureId"]>(0, { nonNullable: true, validators: [] }),
        exposure: new FormControl<Full_Model["exposure"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        exposureItemList: new FormControl<Full_Model["exposureItemList"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });

    exposureAutocomplete = {
        searhcFn: (value: string) => {
            return this.masterDataManagementService.exposureGetExposureByConditionPost({
                description: value,
                needExposureItem: true
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesExposureDTO) => v?.description ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesExposureDTO) => v?.description ?? "",
    }

    constructor() {
        super();

        this.form.controls.exposureId.valueChanges.pipe(
            distinctUntilChanged(),
            untilDestroyed(this),
        ).subscribe((exposureId) => {
            if (exposureId != null && exposureId > 0) {
                if (!this.form.controls.exposure.disabled) this.form.controls.exposure.disable();
            } else {
                if (!this.form.controls.exposure.enabled) this.form.controls.exposure.enable();
            }
        });
    }

    public setFormValue(data: Full_Model | null | undefined): void {
        super.setFormValue(<any>{
            ...data,
        });
    }

    public getFormValue(raw?: boolean | undefined): Full_Model {
        const value = super.getFormValue(raw);

        return {
            ...value,
            exposureId: value.exposure?.exposureId,
            exposure: value.exposure,
            // exposure: undefined,
        };
    }

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            exposure: undefined,
        };
    }

    protected rawFormValue$ = this.form.valueChanges.pipe(
        startWith(this.form.value),
        map(() => this.form.getRawValue()),
        shareReplay(1),
    );
}
