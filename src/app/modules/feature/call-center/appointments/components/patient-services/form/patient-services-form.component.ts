import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, Observable, combineLatest, delay, distinctUntilChanged, map, shareReplay, switchMap, take, tap } from "rxjs";
import { DayEnum } from "src/api/enums";
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO, CoreModelsDTOsMasterDataMainTablesSpecialtyDTO, CoreModelsDTOsMedicalManagementMainTablesAppointmentCartDTO } from "src/api/models";
import { MasterDataManagementService, MedicalManagementService } from "src/api/services";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { UserDataService } from "src/app/modules/core/auth/services/user-data.service";
import { ResourceService } from "src/app/modules/core/resource/services/resource.service";
import { WithNgAfterViewInitSubject } from "src/app/modules/core/utility/mixins/with-ng-after-view-init-subject.mixin";
import { SelectOption } from "src/app/modules/core/utility/types/select-option";
import { isBetweenDateRange } from "src/app/modules/core/utility/validators/date.validator";
import { $enum } from "ts-enum-util";
import { AppointmentCart } from "../../appointments-cart/models/appointments-cart-data.model";
import { Grid_Patient } from "src/app/modules/feature/master-data/patients/models/patient.model";
import { SelectedService } from "../models/selected-service.model";
import { AppointmentCartStatusEnum } from "src/api/enums/appointment-cart-status.enum";

type Grid_Model = Grid_Patient;

@UntilDestroy()
@Component({
    selector: "app-cc-patient-services-form",
    templateUrl: "./patient-services-form.component.html",
    styleUrls: ["./patient-services-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
/*todo:
    mukodes modositasa miutan a backend vegpont modosul es visszadobja
    rendesen a jogviszonyt s annak fuggvenyeben az arakat
*/
export class CcPatientServicesFormComponent extends WithNgAfterViewInitSubject(class {}) {
    @Output() serviceAdded = new EventEmitter();
    public birthDate: string | undefined;
    @ViewChild('cartModal') cartModal: ModalComponent;
    public cartData$ = new BehaviorSubject<any>({} as AppointmentCart);
    public activatedRoute = inject(ActivatedRoute);
    public ssn: string | undefined;
    public activePatient: any;
    public activeAppointmentCart: CoreModelsDTOsMedicalManagementMainTablesAppointmentCartDTO;

    private masterDataManagementService = inject(MasterDataManagementService);
    public patient$ = new BehaviorSubject<any>({} as AppointmentCart);
    @Input() set patient (value: Grid_Model) {
        this.ssn = value?.ssn;
        this.birthDate = value?.dateOfBirth;
        this.patient$.next(value);
        this.activePatient = value;
        this.getSelectedPatientCartStatus();
    }

    public getSelectedPatientCartStatus(): void {
        const patient = this.activePatient;
        if (patient.patientId === null || patient.patientId === undefined) return;
        this.medicalManagementService.appointmentCartGetAppointmentCartsByConditionPost({
            patientIds: [patient.patientId],
            needDC_AppointmentCartStatus: true,
            needPatient: true
        })
        .pipe(delay(200))
        .pipe(take(1))
        .subscribe(res => {
            if(res.appointmentCarts?.length != 0) {
                const activeCart = res.appointmentCarts?.filter(
                    (element) => element?.dC_AppointmentCartStatusId == 1
                );
                if (activeCart && activeCart.length > 0) {
                    // todo: lehelso v legutolso az aktiv ilyenkor
                    this.activeAppointmentCart = activeCart[0];
                }
            } else {
                this.medicalManagementService.appointmentCartCreateOrUpdateAppointmentCartPost({
                    "appointmentCart": {
                        "appointmentCartId": 0,
                        "dC_AppointmentCartStatusId": AppointmentCartStatusEnum.ACTIVE,
                        "patientId": patient.patientId,
                        "patient": patient
                    }
                }).subscribe(() => this.getSelectedPatientCartStatus());
            }
        });

        // todo: emit to show cart icon in the header menu
    }

    public permissionOptions$: Observable<SelectOption<NonNullable<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO>>[]> = this.patient$.pipe(
        switchMap(patient => this.masterDataManagementService.partnerGetSubContractNumbersForPartnerPost({
            patientId: patient.patientId
        })),
        map((res) => res?.businessObjectList ?? []),
        map((permissions) => permissions.map(permission => {
            return <SelectOption<NonNullable<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO>>> {
                name: permission.name! + " (" + permission.subNumber + ")",
                value: permission,
                idProperty: "subContractNumberId" as const,
            }
        })),
        shareReplay(1),
    );

    public resourceService = inject(ResourceService);
    public userDataService = inject(UserDataService);
    public editorModalConfig$ = new BehaviorSubject<ModalConfig | undefined | null>(undefined);
    public errorResourceKeyPrefix = "patient.form.errors";
    public config = {
        addToFilterBtnLabel: this.resourceService.resolve("general.action.label.add")
    };
    public filterData = this.activatedRoute.snapshot.data["init"];
    public DayEnum: DayEnum;
    public dayConfigs = $enum(DayEnum).getEntries().map(([key, value]) => {
        let index = 'general.weekday.' + key.toString().toLowerCase();
        return {
            dayId: value,
            resourceKeyPart: this.resourceService.resolve(index),
        };
    });
    public form = new FormGroup({
        clinicId: new FormControl<any>(null, { nonNullable: true, validators: [Validators.required] }),
        startDate: new FormControl<any>(undefined, { nonNullable: true, validators: [Validators.required, isBetweenDateRange(undefined, "endDate")] }),
        startTime: new FormControl<any>(undefined, { nonNullable: true, validators: [isBetweenDateRange(undefined, "endTime")] }),
        endDate: new FormControl<any>(undefined, { nonNullable: true, validators: [isBetweenDateRange("startDate", undefined)] }),
        endTime: new FormControl<any>(undefined, { nonNullable: true, validators: [isBetweenDateRange("startTime", undefined)] }),
        specialty: new FormControl<any>(undefined, { nonNullable: true, validators: [Validators.required]}),
        dC_LanguageId: new FormControl<any>(undefined, { nonNullable: true, validators: [] }),
        patientAge: new FormControl<any>(null, { nonNullable: true, validators: [] }),
        service: new FormControl<any>(undefined, { nonNullable: true, validators: [Validators.required]}),
        permissions: new FormControl<any>(undefined, { nonNullable: true, validators: []}),
        doctors: new FormControl<any>(undefined, { nonNullable: true, validators: [Validators.required]}),
        price: new FormControl<any>(undefined, { nonNullable: true, validators: []}),
        balance: new FormControl<any>({ value: null, disabled: true }, { nonNullable: true, validators: []}),
    });
    public dC_DayIdFg = new FormGroup({
        ...this.dayConfigs.map((opt) => (
                { [opt.dayId]: new FormControl<boolean>(false, { nonNullable: true, validators: []}) }
        )).reduce((pv, cv) => ({ ...pv, ...cv }), {}) }, { validators: [] });

    public clinicOptions: SelectOption[] = this.filterData.clinicList;
    public languageOptions: SelectOption[] = this.filterData.dC_LanguageList;
    public medicalOptions: SelectOption[] = this.filterData.medicalEmployeeList;
    public ages: number = this.filterData.patientAgeGroup;
    public specialty: SelectOption[] = this.filterData.specialtyList;
    public services: SelectOption[] = this.filterData.serviceList;

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
        searchFn: (value: string) => {
            return combineLatest([
                this.masterDataManagementService.servicePackageGetServicePackageByConditionPost({
                    servicePackageName: value,
                    needBookingArea: true,
                    needSpecialty: true,
                    needLabService: true,
                    needService: true,
                    needSubServicePackage: true,
                    needSubSerivePackageService: true,
                    needServicePackage: true
                }),
                this.masterDataManagementService.serviceGetServiceByConditionPost({ serviceName: value })
            ])
            .pipe(
                untilDestroyed(this),
                map(([serviceResponse, servicePackageResponse]) => {
                    const serviceList = serviceResponse?.businessObjectList ?? [];
                    const servicePackageList = servicePackageResponse?.businessObjectList ?? [];
                    return serviceList.concat(servicePackageList);
                }),
                shareReplay(1),
            );
        },
        getFormattedSelectText: (v: any) => v?.serviceName ?? v?.servicePackageName ?? "",
        getFormattedInputText: (v: any) => v?.serviceName ?? v?.servicePackageName ?? ""
    }


    resetForm(): void {
        this.form.reset();
        this.dC_DayIdFg.reset();
    }

    public patientServices: any = [];
    getService() {
        let formValues: SelectedService | null;
        let dayValues;
        const isEmpty: boolean = !Object.values(this.form.value).some(x => (x !== null && x !== ''));
        const noServiceSelected = (this.form.value.service == null) ? true : false;
        if (!this.form.invalid && !isEmpty && !noServiceSelected) {
            formValues = this.form.getRawValue();
            dayValues = this.dC_DayIdFg.getRawValue();
            formValues.days = dayValues;
            if (formValues.service.servicePackageName) {
                this.getSubPackages$(formValues.service.servicePackageName)
                .pipe(delay(1000))
                .pipe(take(1))
                .subscribe((res: any) => {
                    this.patientServices = res;
                });
            } else {
                this.patientServices = [];
            }
            formValues.packages = this.patientServices;
            return formValues;
        } else return;
    }

    getSubPackages$(serviceName: string): Observable<any> {
        return this.masterDataManagementService.servicePackageGetServicePackageByConditionPost({
            servicePackageName: serviceName,
            needBookingArea: true,
            needSpecialty: true,
            needLabService: true,
            needService: true,
            needSubServicePackage: true,
            needSubSerivePackageService: true,
            needServicePackage: true
        }).pipe(
            untilDestroyed(this),
            map(res => res?.businessObjectList ?? []),
            shareReplay(1),
        );
    }

    submitService(): void {
        this.patientServices = this.getService();
        const isEmpty: boolean = !Object.values(this.form.value).some(x => (x !== null && x !== ''));
        const noServiceSelected = (this.form.value.service == null) ? true : false;
        const noSpecialtySelected = (this.form.value.specialty == null) ? true : false;
        const noClinicSelected = (this.form.value.clinicId == null) ? true : false;
        if (!this.form.invalid && !isEmpty && !noServiceSelected && !noSpecialtySelected && !noClinicSelected) {
            this.serviceAdded.emit(this.patientServices);
        } else {
            return;
        }
    }

    private medicalManagementService = inject(MedicalManagementService);
    protected modalConfig$: Observable<ModalConfig> = this.ngAfterViewInit$.pipe(
        map(() => {
            return <ModalConfig>{
                hideDeleteButton: true,
                saveButtonLabel: this.resourceService.resolve("cc.modals.basket.finalize"),
                dismissButtonLabel: this.resourceService.resolve("general.action.label.back"),
                // modalTitle: this.resourceService.resolve("cc.modals.basket.title") + ': ' + this.activeAppointmentCart?.appointmentCartId,
                modalTitle: this.resourceService.resolve("cc.modals.sections.patient.results"),
                onDismiss: () => this.cartModal.close(),
                onSave: (cartModal) => {
                    //todo: idopontfoglalas veglegesito api hivas ide a timepicker-list -ben kivalasztott ertekkel
                    // FinalizeAppointmentsInCart
                    // CreateOrUpdateAppointments -ban statuszban appointmenthez "Előjegyezve" szukseges
                    // zarashoz CloseAppointmentCart hivas szukseges
                    // this.medicalManagementService.appointmentCartCreateOrUpdateAppointmentCartPost({
                    //     "appointmentCart": {
                    //         "appointmentCartId": this.activeAppointmentCart?.appointmentCartId,
                    //         "dC_AppointmentCartStatusId": AppointmentCartStatusEnum.INACTIVE
                    //     }
                    // }).subscribe(res => {
                    //     if (res.errorMessage == null) this.cartModal.close();
                    // })
                },
            };
        }),
        shareReplay(1),
    );

    public openModal() {
        let serviceArray: any[] = [];
        this.patientServices = this.getService();
        const isEmpty: boolean = !Object.values(this.form.value).some(x => (x !== null && x !== ''));
        const noServiceSelected = (this.form.value.service == null) ? true : false;
        const noSpecialtySelected = (this.form.value.specialty == null) ? true : false;
        const noClinicSelected = (this.form.value.clinicId == null) ? true : false;
        if (!this.form.invalid && !isEmpty && !noServiceSelected && !noSpecialtySelected && !noClinicSelected) {
            if (this.patientServices) serviceArray.push(this.patientServices);
            this.userDataService.getUserData$()
            .pipe(untilDestroyed(this))
            .pipe(take(1))
            .subscribe(res => {
                const name: string = res?.familyName + ' ' + res?.firstName;
                const data = {
                    cartId : this.activeAppointmentCart?.appointmentCartId,
                    cartTitle : this.resourceService.resolve("cc.modals.basket.title") + ': ' + this.activeAppointmentCart?.appointmentCartId,
                    cartStatus : this.activeAppointmentCart?.dC_AppointmentCartStatus?.isActive,
                    patientId : this.activeAppointmentCart?.patientId,
                    fullName : name,
                    birthday : this.birthDate?.toString().slice(0, 10).split('-').join('.'),
                    ssn: this.ssn,
                    patientServices : serviceArray
                } as AppointmentCart;
                this.cartData$.next(data as AppointmentCart);
                this.cartModal.open();
            });
        } else {
            return;
        }
    }

    constructor() {
        super();

        const serviceControl = this.form.controls.service;
        const priceControl = this.form.controls.price;

        serviceControl.valueChanges.pipe(
            untilDestroyed(this),
            distinctUntilChanged(), // Emit only when the current value is different from the last
            tap((value) => {
                const serviceBasePrice = value?.basePrice;
                if(serviceBasePrice) {
                    priceControl.setValue(serviceBasePrice, { emitEvent: false});
                }
            }),
        ).subscribe();
    }

}
