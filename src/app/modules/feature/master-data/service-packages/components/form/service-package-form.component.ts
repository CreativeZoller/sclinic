import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ServicePackage } from "../../models/service-package.model";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { CoreModelsDTOsMasterDataMainTablesPriceTableDTO } from "../../../../../../../api/models";
import { BehaviorSubject, map, shareReplay, startWith } from "rxjs";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { isEmpty } from "../../../../../core/utility/methods/is-empty";
import { ServicePackageTypeEnum, ServiceTypeEnum, StatusEnum } from "../../../../../../../api/enums";


export type Full_Model = ServicePackage;

@UntilDestroy()
@Component({
    selector: "app-service-package-form",
    templateUrl: "./service-package-form.component.html",
    styleUrls: ["./service-package-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePackageFormComponent  extends BaseFormComponent<Full_Model> {

    private resourceService = inject(ResourceService);

    public errorResourceKeyPrefix = "service.package.form.errors";

    public form = new FormGroup({
        // Azonosító
        servicePackageId: new FormControl<Full_Model["servicePackageId"]>(0, { nonNullable: true, validators: []}),

        // Alcsomag / Csomag
        dC_ServicePackageTypeId: new FormControl<Full_Model["dC_ServicePackageTypeId"]>(ServicePackageTypeEnum.PACKAGE, { nonNullable: true, validators: []}),

        // Csomag neve
        servicePackageName: new FormControl<Full_Model["servicePackageName"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.maxLength(128)]}),

        // Csomag angol neve
        servicePackageName_EN: new FormControl<Full_Model["servicePackageName_EN"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.maxLength(128)]}),

        // Csomag leírása
        description: new FormControl<Full_Model["description"]>(undefined, { nonNullable: true, validators: []}),

        // Státusz
        dC_StatusId: new FormControl<Full_Model["dC_StatusId"]>(
            this.initData.dC_StatusList.find(s => s.dto.isDefault)?.value ?? undefined,
            { nonNullable: true, validators: [Validators.required]}
        ),

        // Csomag kategóriája
        dC_ServicePackageCategoryId: new FormControl<Full_Model["dC_ServicePackageCategoryId"]>(undefined, { nonNullable: true, validators: [Validators.required]}),

        // Szűrés?
        isScreeningTest: new FormControl<Full_Model["isScreeningTest"]>(false, { nonNullable: true, validators: []}),

        // Lehetséges foglalási felületek
        servicePackageXDC_BookingArea: new FormControl<Full_Model["servicePackageXDC_BookingArea"]>([], { nonNullable: true, validators: []}),

        // Árazás
        priceTemplateItem: new FormControl<Full_Model["priceTemplateItem"]>([], { nonNullable: true, validators: []}),
        // Listaár
        basePrice: new FormControl<Full_Model["basePrice"]>(0, { nonNullable: true, validators: [Validators.min(0)]}),

        // Általános vizsgálatok
        servicePackageXService: new FormControl<Full_Model["servicePackageXService"]>([], { nonNullable: true, validators: []}),

        // alcsomagok a csomaghoz
        servicePackageXSubServicePackage: new FormControl<Full_Model["servicePackageXSubServicePackage"]>([], { nonNullable: true, validators: []}),

        // Laborvizsgálatok
        servicePackageXLabService: new FormControl<Full_Model["servicePackageXLabService"]>([], { nonNullable: true, validators: []}),

        // Értékesítés
        servicePackageXRole: new FormControl<Full_Model["servicePackageXRole"]>([], { nonNullable: true, validators: []}),

        // Összevont deep.erp cikkszámok kiválasztása

        // Számlanév
        deeperpMergedItemName: new FormControl<Full_Model["deeperpMergedItemName"]>(undefined, { nonNullable: true, validators: [Validators.required]}),
        // deep.erp.cikkszám az összevont tételekhez
        deeperpMergedItemNumber: new FormControl<Full_Model["deeperpMergedItemNumber"]>(undefined, { nonNullable: true, validators: [Validators.required]}),

        // Csomagok (amiknek az Csomag a részét képezi)
        servicePackageList: new FormControl<Full_Model["servicePackageList"]>([], { nonNullable: true, validators: []}),

        // Szerződések (amiknek az Csomag a részét képezi)
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
            servicePackageList: undefined,
            servicePackageXContract: undefined,
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
        ServicePackageTypeEnum: ServicePackageTypeEnum,
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
