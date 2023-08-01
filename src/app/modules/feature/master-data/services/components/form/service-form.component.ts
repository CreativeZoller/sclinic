import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Service } from "../../models/service.model";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { CoreModelsDTOsMasterDataMainTablesPriceTableDTO } from "../../../../../../../api/models";
import { BehaviorSubject, filter, map, Observable, of, pairwise, shareReplay, startWith, take, tap } from "rxjs";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { arrayMinLength } from "../../../../../core/utility/validators/array-min-length.validator";
import { ServiceTypeEnum, StatusEnum } from "../../../../../../../api/enums";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { ConfirmDialogService } from "../../../../../app-common/confirm-dialog/services/confirm-dialog.service";
import { ServiceXServicePackageConfirmDialogContentComponent } from "../utility/confirm-dialog-content-components/service-service-package-confirm-dialog-content.component";
import { Service_MedicalEmployee } from "../../models/service-x-medical-emplyoee.model";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { ServiceXConnectedService } from "../../models/service-x-connected-service.model";
import { ServiceXIncompatibleService } from "../../models/service-x-incompatible-service.model";
import { divisibleByValidator } from "../../../../../core/utility/validators/number-divisible-by.validator";


export type Full_Model = Service;

@UntilDestroy()
@Component({
    selector: "app-service-form",
    templateUrl: "./service-form.component.html",
    styleUrls: ["./service-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceFormComponent  extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);
    private confirmDialogService = inject(ConfirmDialogService);

    public errorResourceKeyPrefix = "service.form.errors";

    public form = new FormGroup({
        // Azonosító
        serviceId: new FormControl<Full_Model["serviceId"]>(0, { nonNullable: true, validators: []}),

        // Szolgáltatás neve
        serviceName: new FormControl<Full_Model["serviceName"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.maxLength(128)]}),

        // Szolgáltatás neve angolul
        serviceName_EN: new FormControl<Full_Model["serviceName_EN"]>(undefined, { nonNullable: true, validators: [Validators.maxLength(128)]}),

        // Szolgáltatás leírása
        description: new FormControl<Full_Model["description"]>(undefined, { nonNullable: true, validators: []}),

        // Minimum eltelt napok száma két szolgáltatás között
        minimumNumberOfDaysNextUse: new FormControl<Full_Model["minimumNumberOfDaysNextUse"]>(0, { nonNullable: true, validators: [Validators.min(0)]}),

        // Státusz
        dC_StatusId: new FormControl<Full_Model["dC_StatusId"]>(
            this.initData.dC_StatusList.find(s => s.dto.isDefault)?.value ?? undefined,
            { nonNullable: true, validators: [Validators.required]}
        ),
        // Normaidő
        duration: new FormControl<Full_Model["duration"]>(15, { nonNullable: true, validators: [Validators.min(0), divisibleByValidator(5, "divisibleBy")]}),

        // Elemi szolgáltatás kategória
        dC_ServiceCategoryId: new FormControl<Full_Model["dC_ServiceCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Típus
        dC_ServiceTypeId: new FormControl<Full_Model["dC_ServiceTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required]}),

        // Külső helyszínen történő vizsgálat, foglalás szükséges egy másik rendszerben
        isPerformedExternally: new FormControl<Full_Model["isPerformedExternally"]>(false, { nonNullable: true, validators: []}),

        // Lehetséges foglalási felületek
        serviceXDC_BookingArea: new FormControl<Full_Model["serviceXDC_BookingArea"]>([], { nonNullable: true, validators: []}),

        // Foglalás időpontjának változásáról e-mailt fog kapni a páciens
        isSendBookingChangeEmailNotification: new FormControl<Full_Model["isSendBookingChangeEmailNotification"]>(false, { nonNullable: true, validators: []}),

        // Orvosszakmák hozzárendelése
        specialtyXService: new FormControl<Full_Model["specialtyXService"]>([], { nonNullable: true, validators: []}),
        // Orvosok hozzárendelése
        _doctorList: new FormControl<Service_MedicalEmployee[]>([], { nonNullable: true, validators: []}),

        // TODO ha elkészült hozzá BE bekötni
        // Rendelje hozzá a szolgáltatást minden ellátóhely, minden szobájához, vagy sem?
        TODO_assignToAllClinics: new FormControl(undefined, { nonNullable: true, validators: []}),

        // Árazás
        priceTemplateItem: new FormControl<Full_Model["priceTemplateItem"]>([], { nonNullable: true, validators: []}),
        // Listaár
        basePrice: new FormControl<Full_Model["basePrice"]>(0, { nonNullable: true, validators: [Validators.min(0)]}),

        // Összeférhetetlen elemi szolgáltatások
        serviceXIncompatibleService: new FormControl<Full_Model["serviceXIncompatibleService"]>([], { nonNullable: true, validators: []}),

        // Kapcsolódó elemi szolgáltatások
        serviceXConnectedService: new FormControl<Full_Model["serviceXConnectedService"]>([], { nonNullable: true, validators: []}),

        // Szükséges cikkek
        serviceXItem: new FormControl<Full_Model["serviceXItem"]>([], { nonNullable: true, validators: []}),

        // Laborvizsgálatok
        serviceXLab: new FormControl<Full_Model["serviceXLab"]>([], { nonNullable: true, validators: [arrayMinLength(1)]}),

        // Értékesítés
        serviceXRole: new FormControl<Full_Model["serviceXRole"]>([], { nonNullable: true, validators: []}),

    // Összevont deep.erp cikkszámok kiválasztása
        // Számlanév
        deeperpMergedItemName: new FormControl<Full_Model["deeperpMergedItemName"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // deep.erp.cikkszám az összevont tételekhez
        deeperpMergedItemNumber: new FormControl<Full_Model["deeperpMergedItemNumber"]>(undefined, { nonNullable: true, validators: [Validators.required]}),

        // Csomagok/alcsomagok (amiknek a szolgáltatás a részét képezi)
        servicePackageXService: new FormControl<Full_Model["servicePackageXService"]>([], { nonNullable: true, validators: []}),

        // DEEP.ERP kompatibilitást biztosító mezők
        deeperpItemIdentification: new FormControl<Full_Model["deeperpItemIdentification"]>(undefined, { nonNullable: true, validators: []}),
    }, [
        (control) => {
            const fg = control as typeof this.form;

            const doesNotHaveDeeperpMergedItemName = isEmpty(fg.value.deeperpMergedItemName);
            const isStatusActive = fg.value.dC_StatusId === StatusEnum.ACTIVE;

            if (doesNotHaveDeeperpMergedItemName && isStatusActive) {
                return {
                    "status.can.not.be.active.if.field.is.empty": {
                        fieldName: this.resourceService.resolve("service.form.label.deeperpMergedItemName"),
                    },
                };
            }

            return null
        }
    ]);

    constructor() {
        super();

        this.form.valueChanges.pipe(
            startWith(this.form.value),
            untilDestroyed(this),
        ).subscribe((formValue) => {
            if (formValue.dC_ServiceTypeId === ServiceTypeEnum.LAB_EXAMINATION) {
                if (!this.form.controls.serviceXLab.enabled) {
                    if(!this.skipResetingFields) this.form.controls.serviceXLab.reset(undefined, { emitEvent: false });
                    this.form.controls.serviceXLab.enable();
                }
            } else {
                if (!this.form.controls.serviceXLab.disabled) {
                    if(!this.skipResetingFields) this.form.controls.serviceXLab.reset(undefined, { emitEvent: false });
                    this.form.controls.serviceXLab.disable();
                }
            }
        })

        this.form.controls.dC_StatusId.valueChanges.pipe(
            startWith(this.form.controls.dC_StatusId.value),
            pairwise(),
            untilDestroyed(this),
        ).subscribe(([prevStatusId, statusId]) => {
            const activeServicePackages = this.form.getRawValue().servicePackageXService
                ?.filter(sp => sp?.servicePackage?.dC_StatusId === StatusEnum.ACTIVE)
                ?? [];

            if (activeServicePackages.length)
            if (prevStatusId !== statusId)
            if (statusId === StatusEnum.INACTIVE) {
                this.confirmDialogService.confirm({
                    messageComponent: ServiceXServicePackageConfirmDialogContentComponent,
                    initMessageComponentBindingsFn: (instance) => {
                        instance.ngAfterViewInit$.pipe(
                            take(1),
                            untilDestroyed(this),
                            untilDestroyed(instance),
                        ).subscribe(() => {
                            // Need to copy initData because ActivatedRoute is different in popup
                            instance.listFieldComponent.activatedRoute = this.activatedRoute;
                            instance.listFieldComponent.initData = this.initData;
                            instance.form.controls.servicePackageXService.setValue(activeServicePackages);
                            instance.form.controls.servicePackageXService.disable();

                            instance.cdr.detectChanges();
                        });
                    },
                }).pipe(
                    filter((confirmed) => !confirmed),// Csak ha elutasította
                    untilDestroyed(this),
                ).subscribe(() => {
                    this.form.controls.dC_StatusId.setValue(prevStatusId);
                });
            }
        });
    }

    public activePriceTable$ = new BehaviorSubject<CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined>(undefined);
    @Input() set activePriceTable(activePriceTable: CoreModelsDTOsMasterDataMainTablesPriceTableDTO | undefined | null) {
        this.activePriceTable$.next(activePriceTable ?? undefined);
    }

    protected basePriceValue$ = this.form.controls.basePrice.valueChanges.pipe(
        startWith(this.form.controls.basePrice.value),
        shareReplay(1),
    );
    protected setBasePriceValue(value: Full_Model["basePrice"]) {
        this.form.controls.basePrice.setValue(value);
    }

    public getFormValue(raw?: boolean | undefined): Full_Model {
        const value = super.getFormValue(raw) as typeof this.form.value;

        return {
            ...value,
            servicePackageXService: undefined,
            medicalEmployeeXService: (value.specialtyXService ?? []).flatMap(specialtyXService => {
                return (value._doctorList ?? []).map(doctor => ({
                    medicalEmployeeId: doctor.medicalEmployeeId,
                    specialtyId: specialtyXService?.specialty?.specialtyId ?? specialtyXService.specialtyId,
                }));
            }),
        };
    }

    public setFormValue(data: Full_Model | null | undefined): void {
        super.setFormValue({
            ...data,
            _doctorList: (data?.medicalEmployeeXService ?? [])
                .map(sXd => sXd.medicalEmployee ?? { medicalEmployeeId: sXd.medicalEmployeeId})
                .filter((v, i, arr) => arr.findIndex(_v => _v.medicalEmployeeId === v.medicalEmployeeId) === i),
        } as Full_Model)
    }

    public getExtraButtonsConfig$ = () => this.form.controls.serviceId.valueChanges.pipe(
        startWith(this.form.controls.serviceId.value),
        map((serviceId) => ((serviceId ?? 0) === 0) ? [] : [{
            component: ButtonComponent,
            initComponentBindingFn: (instance: ButtonComponent) => {
                instance.label = this.resourceService.resolve("general.action.label.copy");
                instance.click.pipe(untilDestroyed(this)).subscribe(() => {
                    this.editorData = {
                        ...this.initialEditorData$.value,
                        serviceId: 0,
                        serviceName: "",
                        serviceName_EN: "",
                        servicePackageXService: [],
                    };
                });
            },
        }]),
        shareReplay(1),
    );
}

@Component({
    standalone: true,
    template: `
        <button
            type="button"
            class="btn customBtn--secondary"
            (click)="click.emit()"
            [disabled]="disabled"
        >
            {{ label }}
        </button>
    `,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: "order-2"
    }
})
class ButtonComponent {
    label: string = "";
    click = new EventEmitter<void>();
    disabled = false;
}
