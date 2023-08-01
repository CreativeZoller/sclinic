import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { Exposure } from "../../../../exposure/models/exposure.model";
import { GroupExposureItemList } from "../../../models/occupational.health.service.model";
import { distinctUntilChanged, filter, map, of, pairwise, shareReplay, tap } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { CoreModelsDTOsMasterDataMainTablesExposureDTO, CoreModelsDTOsMasterDataMainTablesExposureItemDTO } from "../../../../../../../../api/models";
import { ConfirmDialogService } from "../../../../../../app-common/confirm-dialog/services/confirm-dialog.service";


type Full_Model = GroupExposureItemList;

@UntilDestroy()
@Component({
    selector: "app-grouped-exposure-item-form",
    templateUrl: "./grouped-exposure-item-form.component.html",
    styleUrls: ["./grouped-exposure-item-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedExposureItemFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "occupational.health.service.form.errors";
    private masterDataManagementService = inject(MasterDataManagementService);
    private confirmDialogService = inject(ConfirmDialogService);

    public form = new FormGroup({
        exposure: new FormGroup({
            exposureId: new FormControl<Exposure["exposureId"]>({ disabled: true, value: undefined }, { nonNullable: true, validators: [] }),
            description: new FormControl<Exposure["description"]>({ disabled: true, value: undefined }, { nonNullable: true, validators: [] }),
        }),

        exposureItemId: new FormControl<Full_Model["exposureItemId"]>(undefined, { nonNullable: true, validators: [] }),
        exposureItem: new FormControl<Full_Model["exposureItem"]>(undefined, { nonNullable: true, validators: [] }),
        code: new FormControl<Full_Model["code"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [Validators.required] }),
        serviceList: new FormControl<Full_Model["serviceList"]>([], { nonNullable: true, validators: [Validators.required] }),

        _isComplete: new FormControl<boolean>({ value: false, disabled: true }, { nonNullable: true, validators: [Validators.required] }),
    });

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return <any>{
            ...value,
            exposureItemId: value?.exposureItem?.exposureItemId
        };
    }

    protected _exposure: Exposure | undefined | null;
    @Input() set exposure(exposure: Exposure | undefined | null) {
        this._exposure = exposure;
        this.form.patchValue({
            exposure: exposure ?? undefined,
        });
    }

    public setFormValue(data: Full_Model | null | undefined): void {
        super.setFormValue(<any>{
            ...data,
            exposure: this._exposure,
        });
    }

    exposureItemAutocomplete = {
        searhcFn$: (propertyToFilter: keyof CoreModelsDTOsMasterDataMainTablesExposureItemDTO) => {
            return (value: string) => this.masterDataManagementService.exposureItemGetExposureItemByConditionPost({
                [propertyToFilter]: value || "",
                exposureId: this._exposure?.exposureId,
                needService: true,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesExposureItemDTO) => v?.description + ' - ' + v?.code ?? "",


        getFormattedCodeeInputText: (v: CoreModelsDTOsMasterDataMainTablesExposureItemDTO) => v?.code ?? "",

        getFormattedDescriptionNameInputText: (v: CoreModelsDTOsMasterDataMainTablesExposureItemDTO) => v?.description ?? "",
    };

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

        this.form.controls.exposureItem.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            untilDestroyed(this),
            pairwise()
        ).subscribe(([prev, curr]) => {
            const serviceList = (curr?.exposureXExposureItem?.map(x => x.exposureXExposureItemXService) ?? []).flatMap(x => x ?? []);

            if (prev == undefined && curr != undefined) {
                this.form.patchValue({
                    serviceList: serviceList
                });
            }
        });
    }
}
