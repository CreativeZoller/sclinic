import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { Exposure } from "../../../models/exposure.model";
import { ExposureXExposureItem } from "../../../models/exposure-x-exposure-item.model";
import { ExposureXExposureItemXService } from "../../../models/exposure-x-exposure-item-x-service.model";
import { CoreModelsDTOsMasterDataMainTablesServiceDTO, CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from "../../../../../../../../api/models";
import { distinctUntilChanged, map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { divisibleByValidator } from "../../../../../../core/utility/validators/number-divisible-by.validator";


type Full_Model = ExposureXExposureItemXService;

@UntilDestroy()
@Component({
    selector: "app-exposure-item-service-form",
    templateUrl: "./exposure-item-service-form.component.html",
    styleUrls: ["./exposure-item-service-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExposureItemServiceFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "exposure.item.service.form.errors";

    public form = new FormGroup({
        // Azonosító
        exposureXExposureItemXServiceId: new FormControl<Full_Model["exposureXExposureItemXServiceId"]>(0, { nonNullable: true, validators: [] }),

        // Expozíció
        description: new FormControl<Exposure["description"]>({ value: "", disabled: true }, { nonNullable: true, validators: [] }),
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
        isMandatory: new FormControl<Full_Model["isMandatory"]>(false, { nonNullable: true, validators: []}),

        // Hozott lelet
        isPreviousResultAccepted: new FormControl<Full_Model["isPreviousResultAccepted"]>(false, { nonNullable: true, validators: []}),

        // Megjegyzés
        remarks: new FormControl<Full_Model["remarks"]>(undefined, { nonNullable: true, validators: []}),

        // TODO bevezetés ha a BE is változik
        _service: new FormGroup({
            // Ár
            price: new FormControl<any>({value: undefined, disable: true}, { nonNullable: true, validators: [Validators.min(0)] }),
            // Normaidő
            duration: new FormControl<any>({value: undefined, disable: true}, { nonNullable: true, validators: [Validators.min(0), divisibleByValidator(5, "divisibleBy")] }),
        }),
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

    private _exposure: Exposure | undefined | null;
    @Input() set exposure(exposure: Exposure | undefined | null) {
        this._exposure = exposure;
        this.form.patchValue({
            description: exposure?.description ?? "",
        });
    }

    private _exposureXExposureItem: ExposureXExposureItem | undefined | null;
    @Input() set exposureXExposureItem(exposureXExposureItem: ExposureXExposureItem | undefined | null) {
        this._exposureXExposureItem = exposureXExposureItem;
        this.form.patchValue({
            exposureItem: {
                description: exposureXExposureItem?.exposureItem?.description ?? "",
                code: exposureXExposureItem?.exposureItem?.code ?? "",
            },
        });
    }

    public setFormValue(data: Full_Model | null | undefined): void {
        super.setFormValue(<any>{
            ...data,
            description: this._exposure?.description ?? "",
            exposureItem: {
                description: this._exposureXExposureItem?.exposureItem?.description ?? "",
                code: this._exposureXExposureItem?.exposureItem?.code ?? "",
            },
        });
    }

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            specialtyId: value.specialty?.specialtyId ?? null as any,
            // TODO kintebbi tábázatbna nem jelenik meg rendesen
            // specialty: undefined,
            serviceId: value.service?.serviceId ?? null as any,
            // service: undefined,
        };
    }
}
