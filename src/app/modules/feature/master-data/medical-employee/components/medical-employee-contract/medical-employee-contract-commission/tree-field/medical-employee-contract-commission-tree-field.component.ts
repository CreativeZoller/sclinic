import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BaseControlValueAccessor } from "../../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { MedicalEmployeeXContractCommission } from "../../../../models/medical-employee-x-contract-commission.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, switchMap, take } from "rxjs";
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { MasterDataManagementService } from "../../../../../../../../../api/services";
import {
    CoreModelsDTOsMasterDataMainTablesServiceDTO,
    CoreModelsDTOsMasterDataMainTablesSpecialtyDTO,
    CoreModelsDTOsMasterDataMainTablesServicePackageDTO,
} from "../../../../../../../../../api/models";
import { ServicePackageTypeEnum } from "../../../../../../../../../api/enums";
import { ResourceService } from "../../../../../../../core/resource/services/resource.service";
import { formUpdateValueAndValidityRecursively } from "../../../../../../../core/utility/methods/form-update-value-and-validity-recursively";
import { controlExtractTouchedChanges$ } from "../../../../../../../core/utility/methods/control-extract-touched-changes";
import { controlExtractDirtyChanges$ } from "../../../../../../../core/utility/methods/control-extract-dirty-changes";


type TreeNode<
    TModel extends { [K in keyof TModel]: AbstractControl<any> } = {},
    TKey extends string | undefined = string,
> = FormArray<FormGroup<{
    _expanded: FormControl<boolean>;
    _label: FormControl<string | undefined>;
    _children: TreeNode<TModel, TKey>;
} & TModel>>;

type UnFormGroup<T> = T extends FormGroup<infer U> ? U : never;
type UnFormArray<T> = T extends FormArray<infer U> ? U : never;

type FormModel = TreeNode<{
    type: FormControl<"ROOT" | "SERVICE_PACKAGE" | "SUB_SERVICE_PACKAGE" | "SPECIALITY" | "SERVICE">;
    id: FormControl<any>;
    selected: FormControl<boolean>;
    commissionPercentage?: FormControl<MedicalEmployeeXContractCommission["commissionPercentage"]>;
    commissionAmount?: FormControl<MedicalEmployeeXContractCommission["commissionAmount"]>;
    cancelPercentage?: FormControl<MedicalEmployeeXContractCommission["cancelPercentage"]>;
    cancelAmount?: FormControl<MedicalEmployeeXContractCommission["cancelAmount"]>;
}>;
type NodeFormModel = UnFormArray<FormModel>;
type NodeModel = NodeFormModel["value"];

type InnerModel = FormModel["value"] | undefined;
type OuterModel = MedicalEmployeeXContractCommission[] | undefined;

@UntilDestroy()
@Component({
    selector: 'app-medical-employee-contract-commission-tree-field',
    templateUrl: './medical-employee-contract-commission-tree-field.component.html',
    styleUrls: ['./medical-employee-contract-commission-tree-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalEmployeeContractCommissionTreeFieldComponent extends BaseControlValueAccessor<OuterModel, InnerModel> implements OnInit {

    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceService = inject(ResourceService);

    forceSyncModelWithControl = false;

    form$: BehaviorSubject<FormModel | undefined> = new BehaviorSubject<FormModel | undefined>(undefined);

    constructor() {
        super();

        combineLatest([
            this.masterDataManagementService.servicePackageGetServicePackageByConditionPost({
                needBookingArea: false,
                needExposureXExposureItemXService: false,
                needJobTitle: false,
                needOccupationalHealth: false,
                needPriceTemplateItem: false,
                needRole: false,
                needOnlyActive: false,
                needSpecialty: true,
                needService: true,
                needLabService: true,
                needSubSerivePackageService: true,
                needSubServicePackage: true,
            }).pipe(
                map(res => res?.businessObjectList ?? []),
            ),
            this.masterDataManagementService.serviceGetServiceByConditionPost({
                needBookingArea: false,
                needConnectedService: false,
                needExposureXExposureItemXService: false,
                needIncompatibleService: false,
                needItem: false,
                needJobTitle: false,
                needLab: false,
                needMedicalEmployee: false,
                needOccupationalHealth: false,
                needPriceTemplateItem: false,
                needRole: false,
                needServicePackageXDC_BookingArea: false,
                needServicePackageXService: false,
                needSpecialty: true,
            }).pipe(
                map(res => res?.businessObjectList ?? []),
            ),
        ]).pipe(
            untilDestroyed(this),
        ).subscribe(([_servicePackageList, serviceList]) => {
            const servicePackageList = _servicePackageList.filter(pkg => pkg.dC_ServicePackageTypeId === ServicePackageTypeEnum.PACKAGE);
            const subServicePackageList = _servicePackageList.filter(pkg => pkg.dC_ServicePackageTypeId === ServicePackageTypeEnum.SUB_PACKAGE);

            const createNodeFormGroup = (
                type: NodeModel["type"],
                id: NodeModel["id"],
                label: NodeModel["_label"],
                _children?: UnFormGroup<NodeFormModel>["_children"]
            ): NodeFormModel => {
                const fg = <NodeFormModel>new FormGroup({
                    _expanded: new FormControl(true, { nonNullable: true }),
                    _label: new FormControl(label, { nonNullable: true }),
                    _children: _children || new FormArray<any>([]),

                    type: new FormControl(type, { nonNullable: true }),
                    id: new FormControl(id, { nonNullable: true }),
                    selected: new FormControl(false, { nonNullable: true }),
                    commissionPercentage: new FormControl<number | undefined>(undefined, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
                    commissionAmount: new FormControl<number | undefined>(undefined, { nonNullable: true, validators: [Validators.min(0)] }),
                    cancelPercentage: new FormControl<number | undefined>(undefined, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
                    cancelAmount: new FormControl<number | undefined>(undefined, { nonNullable: true, validators: [Validators.min(0)] }),
                });

                let skipChildrenUpdate = false;

                // If parent "selected" changes update child "selected" values (recursively)
                fg.controls.selected.valueChanges.pipe(
                    distinctUntilChanged(),
                    untilDestroyed(this),
                ).subscribe((isSelected) => {
                    if (this.skipUpdatingFields || skipChildrenUpdate) return;

                    for (const childFg of fg.controls._children.controls) {
                        if (childFg.controls.selected.value !== isSelected) {
                            childFg.controls.selected.setValue(isSelected);
                        }
                    }
                });

                // If child "selected" value changes update parent "selected" value if necessary
                fg.valueChanges.pipe(
                    untilDestroyed(this),
                ).subscribe((value) => {
                    if (this.skipUpdatingFields) return;

                    if (fg.controls._children.length > 0) {
                        const isSelected = value.selected ?? false;
                        const isAnyChildSelected = value._children?.some(child => child.selected) ?? true;

                        if (isSelected != isAnyChildSelected) {
                            skipChildrenUpdate = true;
                            fg.controls.selected.setValue(isAnyChildSelected);
                            skipChildrenUpdate = false;
                        }
                    }
                });

                return fg;
            }

            const createServicesFormArray = (
                services: CoreModelsDTOsMasterDataMainTablesServiceDTO[],
            ): FormModel => {
                const specialitiesFgMap = new Map<
                    CoreModelsDTOsMasterDataMainTablesSpecialtyDTO["specialtyId"],
                    NodeFormModel
                >();

                for(const service of services) {
                    for (const speciality of service.specialtyXService?.map(s => s.specialty!) ?? []) {
                        const specialityFg = specialitiesFgMap.get(speciality.specialtyId!) ?? createNodeFormGroup(
                            "SPECIALITY",
                            speciality.specialtyId,
                            speciality.specialtyName,
                        );

                        specialityFg.controls._children.push(createNodeFormGroup(
                            "SERVICE",
                            service.serviceId,
                            service.serviceName,
                        ));

                        specialitiesFgMap.set(speciality.specialtyId!, specialityFg);
                    }
                }

                return new FormArray([ ...specialitiesFgMap.values() ]);
            }

            const createServicePackagesFormArray = (
                servicePackages: CoreModelsDTOsMasterDataMainTablesServicePackageDTO[],
                isSubPackage: boolean = false,
            ): FormModel => {
                return new FormArray([
                    ...servicePackages.map((servicePackage) => {
                        const allowedSubServicePackageIds = servicePackage.servicePackageXSubServicePackage?.map(spkg => spkg.subServicePackageId) ?? [];

                        return createNodeFormGroup(
                            isSubPackage ? "SUB_SERVICE_PACKAGE" : "SERVICE_PACKAGE",
                            servicePackage.servicePackageId,
                            servicePackage.servicePackageName,
                            new FormArray([
                                ...createServicePackagesFormArray(
                                    subServicePackageList.filter(spkg => allowedSubServicePackageIds.includes(spkg.servicePackageId)),
                                    true,
                                ).controls,
                                ...createServicesFormArray([
                                    ...(servicePackage.servicePackageXService?.map(svc => svc?.service!) ?? []),
                                    ...(servicePackage.servicePackageXLabService?.map(lab => lab?.labService!) ?? []),
                                ]).controls,
                            ]),
                        );
                    }),
                ])
            }

            this.form$.next(
                new FormArray<NodeFormModel>([
                    createNodeFormGroup(
                        "ROOT",
                        null,
                        this.resourceService.resolve("medical.employee.contract.commission.tree.all.services.row.name"),
                        new FormArray([
                            ...createServicePackagesFormArray(servicePackageList).controls,
                            ...createServicesFormArray(serviceList).controls,
                        ]),
                    ),
            ]));
        });

        this.form$.pipe(
            filter(f => f != null),
            take(1),
            untilDestroyed(this),
            switchMap((form) => combineLatest([
                form!.valueChanges,
                form!.statusChanges,
            ])),
        ).subscribe(([value, status]) => {
            this.changeValue(
                (status === "VALID") ? value : undefined,
                false,// Do not call onTouched() for this value change
            );
        });
    }

    public ngOnInit(): void {
        const outerCtrl = this.ngControl?.control
        if (outerCtrl != null) {
            this.form$.pipe(
                filter(form => form != null),
                switchMap(form => controlExtractTouchedChanges$(outerCtrl, false).pipe(
                    map((isTouched) => ([isTouched, form] as const)),
                )),
            ).pipe(
                untilDestroyed(this),
            ).subscribe(([isTouched, form]) => {
                if (isTouched) form!.markAllAsTouched();
                else form!.markAsUntouched();

                this.cdr.markForCheck();
            });

            this.form$.pipe(
                untilDestroyed(this),
                filter(form => form != null),
                switchMap((form) => controlExtractTouchedChanges$(form!)),
            ).subscribe((isTouched) => {
                if (outerCtrl.touched !== isTouched) {
                    if (isTouched) outerCtrl.markAsTouched();
                    else outerCtrl.markAsUntouched();
                }

                this.cdr.markForCheck();
            })

            this.form$.pipe(
                filter(form => form != null),
                switchMap(form => controlExtractDirtyChanges$(outerCtrl, false).pipe(
                    map((isDirty) => ([isDirty, form] as const)),
                )),
            ).pipe(
                untilDestroyed(this),
            ).subscribe(([isDirty, form]) => {
                if (isDirty) form!.markAsDirty();
                else form!.markAsPristine();

                this.cdr.markForCheck();
            });

            this.form$.pipe(
                untilDestroyed(this),
                filter(form => form != null),
                switchMap((form) => controlExtractDirtyChanges$(form!)),
            ).subscribe((isDirty) => {
                if (outerCtrl.dirty !== isDirty) {
                    if (isDirty) outerCtrl.markAsDirty();
                    else outerCtrl.markAsPristine();
                }

                this.cdr.markForCheck();
            })
        }
    }

    private skipUpdatingFields: boolean = false;

    public writeValue(value: OuterModel): void {
        this.form$.pipe(
            filter(form => form != null),
            take(1),
            untilDestroyed(this),
        ).subscribe((form) => {
            form!.reset(undefined, { emitEvent: false });
            const formValue = form!.getRawValue()!;
            const rootFormValue = formValue[0];

            for (const row of value ?? []) {
                const {
                    servicePackageId,
                    subServicePackageId,
                    specialtyId,
                    serviceId,
                } = row;

                const servicePackageFormValue = rootFormValue?._children?.find(node => node.type === "SERVICE_PACKAGE" && node.id === servicePackageId);
                const subServicePackageFormValue = servicePackageFormValue?._children?.find(node => node.type === "SUB_SERVICE_PACKAGE" && node.id === subServicePackageId);
                const specialityFormValue = (subServicePackageFormValue ?? servicePackageFormValue ?? rootFormValue)?._children?.find(node => node.type === "SPECIALITY" && node.id === specialtyId);
                const serviceFormValue = specialityFormValue?._children?.find(node => node.type === "SERVICE" && node.id === serviceId);

                if (servicePackageFormValue != null) {
                    delete (servicePackageFormValue as any).selected;
                    servicePackageFormValue.commissionPercentage = row.servicePackageCommissionPercentage;
                    servicePackageFormValue.commissionAmount = row.servicePackageCommissionAmount;
                    servicePackageFormValue.cancelPercentage = row.servicePackageCancelPercentage;
                    servicePackageFormValue.cancelAmount = row.servicePackageCancelAmount;
                }

                if (subServicePackageFormValue != null) {
                    delete (subServicePackageFormValue as any).selected;
                    subServicePackageFormValue.commissionPercentage = row.subServicePackageCommissionPercentage;
                    subServicePackageFormValue.commissionAmount = row.subServicePackageCommissionAmount;
                    subServicePackageFormValue.cancelPercentage = row.subServicePackageCancelPercentage;
                    subServicePackageFormValue.cancelAmount = row.subServicePackageCancelAmount;
                }

                if (specialityFormValue != null) {
                    delete (specialityFormValue as any).selected;
                }

                if (serviceFormValue != null) {
                    serviceFormValue.selected = true;
                    serviceFormValue.commissionPercentage = row.commissionPercentage;
                    serviceFormValue.commissionAmount = row.commissionAmount;
                    serviceFormValue.cancelPercentage = row.cancelPercentage;
                    serviceFormValue.cancelAmount = row.cancelAmount;
                }
            }

            this.skipUpdatingFields = true;
            form!.patchValue(formValue);
            this.skipUpdatingFields = false;
            formUpdateValueAndValidityRecursively(form!)

            this.cdr.markForCheck();
        })
    }

    public readValue(value: InnerModel): OuterModel {
        const valid = this.form$.value?.valid ?? false;
        if (value == null || !valid) return undefined;

        const convertRows = (rows: NodeModel[] | undefined, parents: NodeModel[] = []) => {
            const resultList: OuterModel = [];

            for (const row of rows ?? []) {
                if (row.type === "SERVICE") {
                    if (!!row.selected) {
                        const service = row;
                        const speciality = parents.find(p => p.type === "SPECIALITY");
                        const subServicePackage = parents.find(p => p.type === "SUB_SERVICE_PACKAGE");
                        const servicePackage = parents.find(p => p.type === "SERVICE_PACKAGE");

                        resultList.push({
                            serviceId: service?.id ?? undefined,
                            commissionPercentage: service?.commissionPercentage ?? undefined,
                            commissionAmount: service?.commissionAmount ?? undefined,
                            cancelPercentage: service?.cancelPercentage ?? undefined,
                            cancelAmount: service?.cancelAmount ?? undefined,

                            specialtyId: speciality?.id ?? undefined,

                            subServicePackageId: subServicePackage?.id ?? undefined,
                            subServicePackageCommissionPercentage: subServicePackage?.commissionPercentage ?? undefined,
                            subServicePackageCommissionAmount: subServicePackage?.commissionAmount ?? undefined,
                            subServicePackageCancelPercentage: subServicePackage?.cancelPercentage ?? undefined,
                            subServicePackageCancelAmount: subServicePackage?.cancelAmount ?? undefined,

                            servicePackageId: servicePackage?.id ?? undefined,
                            servicePackageCommissionPercentage: servicePackage?.commissionPercentage ?? undefined,
                            servicePackageCommissionAmount: servicePackage?.commissionAmount ?? undefined,
                            servicePackageCancelPercentage: servicePackage?.cancelPercentage ?? undefined,
                            servicePackageCancelAmount: servicePackage?.cancelAmount ?? undefined,
                        });
                    }
                } else {
                    resultList.push( ...convertRows(row._children, [row, ...parents]) );
                }
            }

            return resultList;
        };

        return convertRows(value);
    }
}
