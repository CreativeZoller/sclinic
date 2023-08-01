import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { CoreModelsDTOsMasterDataMainTablesServiceDTO, CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from "../../../../../../../../api/models";
import { distinctUntilChanged, map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { OccupationalHealthXAloneService_Model } from "../../../models/occupational.health.service.model";


type Full_Model = OccupationalHealthXAloneService_Model;

@UntilDestroy()
@Component({
    selector: "app-occupational-health-service-form",
    templateUrl: "./occupational-health-service-form.component.html",
    styleUrls: ["./occupational-health-service-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OccupationalHealthServiceFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "occupational.health.service.form.errors";

    public form = new FormGroup({
        // Azonosító
        occupationalHealthXServiceId: new FormControl<Full_Model["occupationalHealthXServiceId"]>(0, { nonNullable: true, validators: []}),

        // Szakma
        specialty: new FormControl<Full_Model["specialty"]>(undefined, { nonNullable: true, validators: [Validators.required]}),

        exposure: new FormControl<Full_Model["exposure"]>(undefined, { nonNullable: true, validators: []}),

        exposureItemId: new FormControl<Full_Model["exposureItemId"]>(undefined, { nonNullable: true, validators: []}),

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

    public setFormValue(data: Full_Model | null | undefined): void {
        super.setFormValue(<any>{
            ...data,
        });
    }

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            specialtyId: value.specialty?.specialtyId!,
            // TODO kintebbi tábázatbna nem jelenik meg rendesen
            // specialty: undefined,
            serviceId: value.service?.serviceId!,
            // service: undefined,
        };
    }
}
