import { ChangeDetectionStrategy, Component, inject, OnInit, TrackByFunction } from '@angular/core';
import { BaseControlValueAccessor } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { MedicalEmployeeXSpecialityService } from "../../../models/medical-employee-x-speciality-service.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, combineLatest, filter, map, switchMap, take } from "rxjs";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { controlExtractDirtyChanges$ } from "../../../../../../core/utility/methods/control-extract-dirty-changes";
import { controlExtractTouchedChanges$ } from "../../../../../../core/utility/methods/control-extract-touched-changes";
import { divisibleByValidator } from '../../../../../../core/utility/validators/number-divisible-by.validator';


type TreeNode<
    TModel extends { [K in keyof TModel]: AbstractControl<any> } = {},
    TKey extends string | undefined = string,
> = FormGroup<Record<NonNullable<TKey>, FormGroup<{
    _expanded: FormControl<boolean>;
    _label: FormControl<string | undefined>;
    _childrenFg?: TreeNode<TModel, TKey>;
} & TModel>>>;

type UnFormGroup<T> = T extends FormGroup<infer U> ? U : never;
type UnRecordValue<T> = T extends Record<infer K, infer V> ? V : never;

type FormModel = TreeNode<{
    selected: FormControl<boolean>;
    type: FormControl<"SPECIALITY">;
    ageFrom: FormControl<MedicalEmployeeXSpecialityService["ageFrom"]>;
    ageTo: FormControl<MedicalEmployeeXSpecialityService["ageTo"]>;
} | {
    selected: FormControl<boolean>;
    type: FormControl<"SERVICE">;
    duration: FormControl<MedicalEmployeeXSpecialityService["duration"]>;
}>;
type NodeFormModel = UnRecordValue<UnFormGroup<FormModel>>;

type InnerModel = FormModel["value"] | undefined;
type OuterModel = MedicalEmployeeXSpecialityService[] | undefined;

@UntilDestroy()
@Component({
    selector: 'app-medical-employee-speciality-service-tree-field',
    templateUrl: './medical-employee-speciality-service-tree-field.component.html',
    styleUrls: ['./medical-employee-speciality-service-tree-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalEmployeeSpecialityServiceTreeFieldComponent extends BaseControlValueAccessor<OuterModel, InnerModel> implements OnInit {

    private masterDataManagementService = inject(MasterDataManagementService);

    forceSyncModelWithControl = false;

    form$: BehaviorSubject<FormModel | undefined> = new BehaviorSubject<FormModel | undefined>(undefined);

    constructor() {
        super();

        this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({
            needsServices: true,
        }).pipe(
            map(res => res?.businessObjectList ?? []),
            untilDestroyed(this),
        ).subscribe((specialityList) => {
            const specialityFg: FormModel = new FormGroup<UnFormGroup<FormModel>>({});
            for (const speciality of specialityList) {
                if (speciality.specialtyId != null) {
                    if (specialityFg.controls[`${speciality.specialtyId}`] == null) {
                        specialityFg.setControl(`${speciality.specialtyId}`, <NodeFormModel>new FormGroup({
                            _expanded: new FormControl<boolean>(true, { nonNullable: true }),
                            _label: new FormControl<string | undefined>(speciality.specialtyName, { nonNullable: true }),
                            _childrenFg: new FormGroup({}),
                            type: new FormControl<"SPECIALITY">("SPECIALITY", { nonNullable: true }),
                            selected: new FormControl<boolean>(false, { nonNullable: true }),
                            ageFrom: new FormControl<MedicalEmployeeXSpecialityService["ageFrom"]>(undefined, { nonNullable: true, validators:[ Validators.min(0), Validators.max(99) ] }),
                            ageTo: new FormControl<MedicalEmployeeXSpecialityService["ageTo"]>(undefined, { nonNullable: true, validators:[ Validators.min(0), Validators.max(99) ] }),
                        }))

                        const serviceFg = specialityFg.controls[`${speciality.specialtyId}`].controls._childrenFg!
                        for (const service of speciality.specialtyXService ?? []) {
                            if (service.serviceId != null) {
                                if (serviceFg.controls[`${service.serviceId}`] == null) {
                                    serviceFg.setControl(`${service.serviceId}`, <NodeFormModel>new FormGroup({
                                        _expanded: new FormControl<boolean>(false, { nonNullable: true }),
                                        _label: new FormControl<string | undefined>(service.service?.serviceName, { nonNullable: true }),
                                        selected: new FormControl<boolean>(false, { nonNullable: true }),
                                        type: new FormControl<"SERVICE">("SERVICE", { nonNullable: true }),
                                        duration: new FormControl<MedicalEmployeeXSpecialityService["duration"]>(undefined, { nonNullable: true, validators:[ Validators.min(0), divisibleByValidator(5, "divisibleBy") ] }),
                                    }))
                                }
                            }
                        }

                        // Handle fg changes
                        specialityFg.controls[`${speciality.specialtyId}`].controls.selected.valueChanges.pipe(
                            untilDestroyed(this),
                        ).subscribe((isSelected) => {
                            if (this.skipUpdatingFields) return;

                            for (const ctrl of Object.values(serviceFg.controls)) {
                                ctrl.controls.selected.setValue(isSelected, { emitEvent: false });
                            }
                        });

                        serviceFg.valueChanges.pipe(
                            untilDestroyed(this),
                        ).subscribe((serviceFgState) => {
                            if (this.skipUpdatingFields) return;

                            const specialitySelectedCtrl = specialityFg.controls[`${speciality.specialtyId}`].controls.selected;

                            const allSelected = specialitySelectedCtrl.value;
                            const allShouldBeSelected = Object.values(serviceFgState).some(s => s?.selected)
                            if (allSelected !== allShouldBeSelected) {
                                specialitySelectedCtrl.setValue(allShouldBeSelected, { emitEvent: false });
                            }
                        });
                    }

                }
            }

            this.form$.next(specialityFg);
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
            form!.reset();
            const formValue = form!.getRawValue()!;

            for(const row of value ?? []) {
                if (row.specialtyId != null && row.serviceId != null) {
                    const specialityValue = formValue[row.specialtyId];
                    if (specialityValue.type === "SPECIALITY") {
                        specialityValue.ageFrom = row.ageFrom;
                        specialityValue.ageTo = row.ageTo;

                        const serviceValue = specialityValue._childrenFg![row.serviceId];
                        if (serviceValue.type === "SERVICE") {
                            serviceValue.selected = true;
                            serviceValue.duration = row.duration;
                        }
                    }
                }
            }

            // Aggregate outer selected value
            for(const specialityId of Object.keys(formValue)) {
                formValue[specialityId].selected = Object.values(formValue[specialityId]._childrenFg!).some(v => v.selected);
            }

            this.skipUpdatingFields = true;
            form!.patchValue(formValue);
            this.skipUpdatingFields = false;
            this.cdr.markForCheck();
        })
    }

    public readValue(value: InnerModel): OuterModel {
        const valid = this.form$.value?.valid ?? false;
        if (value == null || !valid) return undefined;

        const resultList: OuterModel = [];

        for (const [specialityId, specialityNode] of Object.entries(value ?? {})) {
            if (specialityNode?.type === "SPECIALITY") {
                for (const [serviceId, serviceNode] of Object.entries(specialityNode._childrenFg ?? {})) {
                    if (serviceNode?.type === "SERVICE" && serviceNode?.selected) {
                        resultList.push({
                            specialtyId: Number.parseFloat(specialityId),
                            serviceId: Number.parseFloat(serviceId),
                            ageFrom: specialityNode?.ageFrom ?? null as any,
                            ageTo: specialityNode?.ageTo ?? null as any,
                            duration: serviceNode?.duration ?? null as any,
                        });
                    }
                }
            }
        }

        return resultList;
    }

    protected stableKeyValueNgForTrackByFn: TrackByFunction<{ key: string; value: any; }> = (i, v) => v.key;
}
