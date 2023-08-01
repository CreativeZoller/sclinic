import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { CoreModelsDTOsMasterDataMainTablesServiceDTO, CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from "../../../../../../../../api/models";
import { distinctUntilChanged, map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { ExposureXExposureItemXService } from "../../../../exposure/models/exposure-x-exposure-item-x-service.model";
import { ExposureXExposureItem } from "../../../../exposure/models/exposure-x-exposure-item.model";
import { ExposureData, TransferModelGroupExposureItemData } from "../../../models/occupational.health.service.model";


type Full_Model = ExposureXExposureItemXService;

@UntilDestroy()
@Component({
    selector: "app-grouped-exposure-item-service-form",
    templateUrl: "./grouped-exposure-item-service-form.component.html",
    styleUrls: ["./grouped-exposure-item-service-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedExposureItemServiceFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "grouped.exposure.item.service.form.errors";

    public form = new FormGroup({
        // Azonosító
        exposureXExposureItemXServiceId: new FormControl<Full_Model["exposureXExposureItemXServiceId"]>(0, { nonNullable: true, validators: [] }),

        // Expozíció
        exposure: new FormGroup({
            // Expozíció
            description: new FormControl<ExposureData["description"]>({ value: "", disabled: true }, { nonNullable: true, validators: [] }),
        }),
        // (Exp paraméter)
        exposureItem: new FormGroup({
            // Paraméter
            description: new FormControl<NonNullable<ExposureXExposureItem["exposureItem"]>["description"]>({ value: "", disabled: true }, { nonNullable: true, validators: [ Validators.required ] }),
            // Paraméter kódja
            code: new FormControl<NonNullable<ExposureXExposureItem["exposureItem"]>["code"]>({ value: "", disabled: true }, { nonNullable: true, validators: [ Validators.required ] }),
        }),

        // Szakma
        specialty: new FormControl<Full_Model["specialty"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Szolgáltatás
        service: new FormControl<Full_Model["service"]>(undefined, { nonNullable: true, validators: [Validators.required]}),

        // Gyakoriság
        dC_ExposureFrequencyId: new FormControl<Full_Model["dC_ExposureFrequencyId"]>(undefined, { nonNullable: true, validators: [Validators.required]}),

        // Kötelező
        isMandatory: new FormControl<Full_Model["isMandatory"]>(false , { nonNullable: true, validators: []}),

        // Hozott lelet
        isPreviousResultAccepted: new FormControl<Full_Model["isPreviousResultAccepted"]>(false, { nonNullable: true, validators: []}),

        // Megjegyzés
        remarks: new FormControl<Full_Model["remarks"]>(undefined, { nonNullable: true, validators: []}),
    });

    specialtyAutocomplete = {
        searhcFn: (value: string) => {
            return this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({
                specialtyName: value,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO) => v?.specialtyName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO) => v?.specialtyName ?? "",
    }

    serviceAutocomplete = {
        searhcFn: (value: string) => {
            return this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({
                specialtyIds: [ this.form.value.specialty?.specialtyId! ],
                needsServices: true,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                map((specialtyList) => {
                    return specialtyList
                        .flatMap(specialty => specialty.specialtyXService ?? [])
                        .map(v => v.service!)
                        .filter((v, i, arr) => arr.findIndex(v2 => v2?.serviceId === v?.serviceId) === i)
                        .filter(v => v?.serviceName?.toLowerCase()?.includes(value.toLowerCase()))
                }),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesServiceDTO) => v?.serviceName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesServiceDTO) => v?.serviceName ?? "",
    }

    constructor() {
        super();

        this.form.controls.specialty.valueChanges.pipe(
            distinctUntilChanged((a, b) => a?.specialtyId === b?.specialtyId),
            untilDestroyed(this),
        ).subscribe((specialty) => {
            this.form.controls.service.reset();

            if (specialty == null) {
                if (!this.form.controls.service.disabled) this.form.controls.service.disable();
            } else {
                if (!this.form.controls.service.enabled) this.form.controls.service.enable();
            }
        })
    }

    private _exposure: ExposureData | undefined | null;
    @Input() set exposure(exposure: ExposureData | undefined | null) {
        this._exposure = exposure;
        this.form.patchValue({
            exposure: {
                description: exposure?.description ?? "",
            },
        });
    }

    // TODO model
    private _exposureItemData: TransferModelGroupExposureItemData | undefined | null;
    @Input() set exposureItem(exposureItemData: TransferModelGroupExposureItemData | undefined | null) {
        this._exposureItemData = exposureItemData;
        this.form.patchValue({
            exposureItem: {
                description: exposureItemData?.exposureItem?.description ?? "",
                code: exposureItemData?.exposureItem?.code ?? "",
            },
        });
    }

    public setFormValue(data: Full_Model | null | undefined): void {
        super.setFormValue(<any>{
            ...data,
            exposure: {
                description: this._exposure?.description ?? "",
            },
            exposureItem: {
                description: this._exposureItemData?.exposureItem?.description ?? "",
                code: this._exposureItemData?.code ?? "",
            },
        });
    }

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return <any>{
            ...value,
            exposureItem: undefined,
            exposure: undefined,
            specialtyId: value.specialty?.specialtyId ?? null as any,
            serviceId: value.service?.serviceId ?? null as any,
        };
    }
}
