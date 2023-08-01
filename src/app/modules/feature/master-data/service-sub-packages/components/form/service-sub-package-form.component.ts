import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ServiceSubPackage } from "../../models/service-sub-package.model";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { CoreModelsDTOsMasterDataMainTablesPriceTableDTO } from "../../../../../../../api/models";
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, pairwise, shareReplay, startWith, take } from "rxjs";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { arrayMinLength } from "../../../../../core/utility/validators/array-min-length.validator";
import { ServicePackageTypeEnum, ServiceTypeEnum, StatusEnum, SubServicePackageTypeEnum } from "../../../../../../../api/enums";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { ConfirmDialogService } from "../../../../../app-common/confirm-dialog/services/confirm-dialog.service";
import { ServiceSubPackageXServicePackageConfirmDialogContentComponent } from "../utility/confirm-dialog-content-components/service-sub-package-service-package-confirm-dialog-content.component";
import { UnArray } from "../../../../../core/utility/types/un-array";
import { divisibleByValidator } from "../../../../../core/utility/validators/number-divisible-by.validator";



export type Full_Model = ServiceSubPackage;
type Service_Model = NonNullable<UnArray<ServiceSubPackage["servicePackageXService"]>["service"]>;

@UntilDestroy()
@Component({
    selector: "app-service-sub-package-form",
    templateUrl: "./service-sub-package-form.component.html",
    styleUrls: ["./service-sub-package-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceSubPackageFormComponent  extends BaseFormComponent<Full_Model>{

    private resourceService = inject(ResourceService);
    private confirmDialogService = inject(ConfirmDialogService);

    public errorResourceKeyPrefix = "service.sub.package.form.errors";

    public form = new FormGroup({
        // Azonosító
        servicePackageId: new FormControl<Full_Model["servicePackageId"]>(0, { nonNullable: true, validators: []}),

        // Alcsomag / Csomag
        dC_ServicePackageTypeId: new FormControl<Full_Model["dC_ServicePackageTypeId"]>(ServicePackageTypeEnum.SUB_PACKAGE, { nonNullable: true, validators: []}),

        // Alcsomag neve
        servicePackageName: new FormControl<Full_Model["servicePackageName"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.maxLength(128)]}),

        // Alcsomag angol neve
        servicePackageName_EN: new FormControl<Full_Model["servicePackageName_EN"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.maxLength(128)]}),

        // Alcsomag leírása
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

        // Alcsomag kategóriája
        dC_SubServicePackageCategoryId: new FormControl<Full_Model["dC_SubServicePackageCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Alcsomag típusa
        dC_SubServicePackageTypeId: new FormControl<Full_Model["dC_SubServicePackageTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // Pontos idő?
        isRightTime: new FormControl<Full_Model["isRightTime"]>(false, { nonNullable: true, validators: []}),

        // Szűrés?
        isScreeningTest: new FormControl<Full_Model["isScreeningTest"]>(false, { nonNullable: true, validators: []}),

        // Lehetséges foglalási felületek
        servicePackageXDC_BookingArea: new FormControl<Full_Model["servicePackageXDC_BookingArea"]>([], { nonNullable: true, validators: []}),

        // TODO ha elkészült hozzá BE bekötni
        // Rendelje hozzá a szolgáltatást minden ellátóhely, minden szobájához, vagy sem?
        TODO_assignToAllClinics: new FormControl(undefined, { nonNullable: true, validators: []}),

        // Árazás
        priceTemplateItem: new FormControl<Full_Model["priceTemplateItem"]>([], { nonNullable: true, validators: []}),
        // Listaár
        basePrice: new FormControl<Full_Model["basePrice"]>(0, { nonNullable: true, validators: [Validators.min(0)]}),

        // Általános vizsgálatok
        servicePackageXService: new FormControl<Full_Model["servicePackageXService"]>([], { nonNullable: true, validators: [arrayMinLength(2)]}),

        // Maximum választható szolgáltatások száma
        maxServiceCount: new FormControl<Full_Model["maxServiceCount"]>(undefined, { nonNullable: true, validators: [Validators.min(1), Validators.max(0)]}),

        // Laborvizsgálatok
        servicePackageXLabService: new FormControl<Full_Model["servicePackageXLabService"]>([], { nonNullable: true, validators: []}),

        // Maximum választható laborvizsgálatok száma
        maxLabServiceCount: new FormControl<Full_Model["maxLabServiceCount"]>(undefined, { nonNullable: true, validators: [Validators.min(1), Validators.max(0)]}),

        // Értékesítés
        servicePackageXRole: new FormControl<Full_Model["servicePackageXRole"]>([], { nonNullable: true, validators: []}),

    // Összevont deep.erp cikkszámok kiválasztása
        // Számlanév
        deeperpMergedItemName: new FormControl<Full_Model["deeperpMergedItemName"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // deep.erp.cikkszám az összevont tételekhez
        deeperpMergedItemNumber: new FormControl<Full_Model["deeperpMergedItemNumber"]>(undefined, { nonNullable: true, validators: [Validators.required]}),

        // Csomagok (amiknek az alcsomag a részét képezi)
        servicePackageList: new FormControl<Full_Model["servicePackageList"]>([], { nonNullable: true, validators: []}),

        // Szerződések (amiknek az alcsomag a részét képezi)
        // TODO amint be lesz kötve a csomaghoz a szerződés:
            // servicePackageXContract: new FormControl<Full_Model["servicePackageXContract"]>([], { nonNullable: true, validators: []}),
        servicePackageXContract: new FormControl<any[]>([], { nonNullable: true, validators: []}),

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

        this.form.controls.dC_StatusId.valueChanges.pipe(
            startWith(this.form.controls.dC_StatusId.value),
            pairwise(),
            untilDestroyed(this),
        ).subscribe(([prevStatusId, statusId]) => {
            const activeServicePackages = this.form.getRawValue().servicePackageList
                ?.filter(sp => sp?.servicePackage?.dC_StatusId === StatusEnum.ACTIVE)
                ?? [];

            if (activeServicePackages.length)
            if (prevStatusId !== statusId)
            if (statusId === StatusEnum.INACTIVE) {
                this.confirmDialogService.confirm({
                    messageComponent: ServiceSubPackageXServicePackageConfirmDialogContentComponent,
                    initMessageComponentBindingsFn: (instance) => {
                        instance.ngAfterViewInit$.pipe(
                            take(1),
                            untilDestroyed(this),
                            untilDestroyed(instance),
                        ).subscribe(() => {
                            // Need to copy initData because ActivatedRoute is different in popup
                            instance.listFieldComponent.activatedRoute = this.activatedRoute;
                            instance.listFieldComponent.initData = this.initData;
                            instance.form.controls.servicePackageList.setValue(activeServicePackages);
                            instance.form.controls.servicePackageList.disable();

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

        const sumServicesDurations = (serviceList: Service_Model[]): number => {
            if (serviceList == null || !Array.isArray(serviceList) || serviceList.length === 0) return 0;

            return serviceList.reduce((sum, v) => sum + (v?.duration ?? 0), 0);
        };

        this.form.controls.dC_SubServicePackageTypeId.valueChanges.pipe(
            startWith(this.form.controls.dC_SubServicePackageTypeId.value),
            untilDestroyed(this),
            pairwise(),
        ).subscribe(([prevDC_SubServicePackageTypeId, dC_SubServicePackageTypeId]) => {
            if (prevDC_SubServicePackageTypeId != null) {
                if (dC_SubServicePackageTypeId === SubServicePackageTypeEnum.REQUIRED) {
                    if (!this.skipResetingFields) this.form.controls.maxLabServiceCount.reset();
                    if (!this.skipResetingFields) this.form.controls.maxServiceCount.reset();
                    if (!this.skipResetingFields) this.form.controls.isRightTime.reset();

                    if (!this.form.controls.duration.disabled) this.form.controls.duration.disable({ emitEvent: false });
                    if (!this.skipResetingFields) this.form.controls.duration.reset();
                    this.form.controls.duration.setValue(sumServicesDurations([
                        ...(this.form.value.servicePackageXService?.map(v => v.service!) ?? []),
                        ...(this.form.value.servicePackageXLabService?.map(v => v.labService!) ?? []),
                    ]));
                }

                if (dC_SubServicePackageTypeId === SubServicePackageTypeEnum.OPTIONAL) {
                    if (!this.skipResetingFields) this.form.controls.isRightTime.reset();

                    if (!this.form.controls.duration.enabled) this.form.controls.duration.enable({ emitEvent: false });
                    if (!this.skipResetingFields) this.form.controls.duration.reset();
                }
            }
        });

        combineLatest([
            this.form.controls.servicePackageXService.valueChanges.pipe(
                startWith(this.form.controls.servicePackageXService.value),
            ),
            this.form.controls.servicePackageXLabService.valueChanges.pipe(
                startWith(this.form.controls.servicePackageXLabService.value),
            ),
        ]).pipe(
            untilDestroyed(this),
        ).subscribe(([servicePackageXService, servicePackageXLabService]) => {
            if (this.form.value.dC_SubServicePackageTypeId  === SubServicePackageTypeEnum.REQUIRED) {
                this.form.controls.duration.setValue(sumServicesDurations([
                    ...(servicePackageXService?.map(v => v.service!) ?? []),
                    ...(servicePackageXLabService?.map(v => v.labService!) ?? []),
                ]));
            }
        });

        this.form.controls.servicePackageXService.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            pairwise(),
          ).subscribe(([_prev, _current]) => {
            const prevLength = _prev?.length ?? 0;
            const currentLength = _current?.length ?? 0;

            if (currentLength !== prevLength) {
              this.form.controls.maxServiceCount.setValidators([
                Validators.min(1),
                Validators.max(currentLength),
              ]);
              this.form.controls.maxServiceCount.updateValueAndValidity();
            }
          });

        this.form.controls.servicePackageXLabService.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            pairwise(),
          ).subscribe(([_prev, _current]) => {
            const prevLength = _prev?.length ?? 0;
            const currentLength = _current?.length ?? 0;

            if (currentLength !== prevLength) {
              this.form.controls.maxLabServiceCount.setValidators([
                Validators.min(1),
                Validators.max(currentLength),
              ]);
              this.form.controls.maxLabServiceCount.updateValueAndValidity();
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

        const serviceLab = ((value.servicePackageXLabService as unknown) as Array<any>)?.map(x => {
             return {
                ...x,
                labServiceId : x?.serviceId ?? x.labServiceId
             }
        });

        return {
            ...value,
            servicePackageList: undefined,
            servicePackageXContract: undefined,
            servicePackageXLabService: serviceLab,
        } as Full_Model;
    }

    public getExtraButtonsConfig$ = () => this.form.controls.servicePackageId.valueChanges.pipe(
        startWith(this.form.controls.servicePackageId.value),
        map((servicePackageId) => ((servicePackageId ?? 0) === 0) ? [] : [{
            component: ButtonComponent,
            initComponentBindingFn: (instance: ButtonComponent) => {
                instance.label = this.resourceService.resolve("general.action.label.copy");
                instance.click.pipe(
                    untilDestroyed(this),
                    untilDestroyed(instance),
                ).subscribe(() => {
                    this.editorData = {
                        ...this.initialEditorData$.value,
                        servicePackageId: 0,
                        servicePackageName: "",
                        servicePackageName_EN: "",
                        servicePackageList: [],
                        servicePackageXContract: [],
                    } as Full_Model;
                });
            },
        }]),
        shareReplay(1),
    );

    protected constants = {
        ServiceTypeEnum: ServiceTypeEnum,
        SubServicePackageTypeEnum: SubServicePackageTypeEnum,
    };
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
