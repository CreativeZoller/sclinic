import { ChangeDetectionStrategy, Component, inject, OnInit, TrackByFunction } from '@angular/core';
import { BaseControlValueAccessor } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, take } from "rxjs";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { ClinicXSpecialtyService } from '../../../models/clinic-x-specialty-service.model';
import { controlExtractTouchedChanges$ } from "../../../../../../core/utility/methods/control-extract-touched-changes";
import { controlExtractDirtyChanges$ } from "../../../../../../core/utility/methods/control-extract-dirty-changes";


type TreeNode<
    TModel extends { [K in keyof TModel]: AbstractControl<any> } = {},
    TKey extends string | undefined = string,
> = FormGroup<Record<NonNullable<TKey>, FormGroup<{
    _expanded: FormControl<boolean>;
    _label: FormControl<string | undefined>;
    _childrenFg?: TreeNode<TModel, TKey>;
    _visible: FormControl<boolean>;
} & TModel>>>;

type UnFormGroup<T> = T extends FormGroup<infer U> ? U : never;
type UnRecordValue<T> = T extends Record<infer K, infer V> ? V : never;

type FormModel = TreeNode<{
    selected: FormControl<boolean>;
    type: FormControl<"SPECIALTY">;
} | {
    selected: FormControl<boolean>;
    type: FormControl<"SERVICE">;
}>;
type NodeFormModel = UnRecordValue<UnFormGroup<FormModel>>;

type InnerModel = FormModel["value"] | undefined;
type OuterModel = ClinicXSpecialtyService[] | undefined;

@UntilDestroy()
@Component({
    selector: 'app-clinic-specialty-service-tree-field',
    templateUrl: './clinic-specialty-service-tree-field.component.html',
    styleUrls: ['./clinic-specialty-service-tree-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicSpecialtyServiceTreeFieldComponent extends BaseControlValueAccessor<OuterModel, InnerModel> implements OnInit {

    private masterDataManagementService = inject(MasterDataManagementService);

    forceSyncModelWithControl = false;

    form$: BehaviorSubject<FormModel | undefined> = new BehaviorSubject<FormModel | undefined>(undefined);
    public searchInput: FormControl = new FormControl('');

    constructor() {
        super();

        this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({
            needsServices: true,
        }).pipe(
            map(res => res?.businessObjectList ?? []),
            untilDestroyed(this),
        ).subscribe((specialtyList) => {
            const specialtyFg: FormModel = new FormGroup<UnFormGroup<FormModel>>({});
            for (const specialty of specialtyList) {
                if (specialty.specialtyId != null) {
                    if (specialtyFg.controls[`${specialty.specialtyId}`] == null) {
                        specialtyFg.setControl(`${specialty.specialtyId}`, <NodeFormModel>new FormGroup({
                            _expanded: new FormControl<boolean>(true, { nonNullable: true }),
                            _label: new FormControl<string | undefined>(specialty.specialtyName, { nonNullable: true }),
                            _childrenFg: new FormGroup({}),
                            type: new FormControl<"SPECIALTY">("SPECIALTY", { nonNullable: true }),
                            selected: new FormControl<boolean>(false, { nonNullable: true }),
                            _visible: new FormControl<boolean>(true, { nonNullable: true }),
                        }))



                        const serviceFg = specialtyFg.controls[`${specialty.specialtyId}`].controls._childrenFg!
                        for (const service of specialty.specialtyXService ?? []) {
                            if (service.serviceId != null) {
                                if (serviceFg.controls[`${service.serviceId}`] == null) {
                                    serviceFg.setControl(`${service.serviceId}`, <NodeFormModel>new FormGroup({
                                        _expanded: new FormControl<boolean>(false, { nonNullable: true }),
                                        _label: new FormControl<string | undefined>(service.service?.serviceName, { nonNullable: true }),
                                        selected: new FormControl<boolean>(false, { nonNullable: true }),
                                        type: new FormControl<"SERVICE">("SERVICE", { nonNullable: true }),
                                        _visible: new FormControl<boolean>(true, { nonNullable: true }),
                                    }))
                                }
                            }
                        }

                        // Handle fg changes
                        specialtyFg.controls[`${specialty.specialtyId}`].controls.selected.valueChanges.pipe(
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

                            const specialtySelectedCtrl = specialtyFg.controls[`${specialty.specialtyId}`].controls.selected;

                            const allSelected = specialtySelectedCtrl.value;
                            const allShouldBeSelected = Object.values(serviceFgState).some(s => s?.selected)
                            if (allSelected !== allShouldBeSelected) {
                                specialtySelectedCtrl.setValue(allShouldBeSelected, { emitEvent: false });
                            }
                        });
                    }

                }
            }

            this.form$.next(specialtyFg);
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

        combineLatest([
            this.searchInput.valueChanges.pipe(
                debounceTime(300), // Add a debounce to reduce the number of emitted events
                distinctUntilChanged(), // Emit only when the current value is different from the last
            ),
            this.form$.pipe(filter(form => form instanceof FormGroup)),
        ]).pipe(
            map(([searchQuery, form]) => {
                this.setFormVisibility(form!, searchQuery);
            }),
            untilDestroyed(this),
        ).subscribe(() => {
            this.cdr.markForCheck();
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

            for (const row of value ?? []) {
                if (row != null && row.specialtyId != null && row.serviceId != null) {
                    const specialtyValue = formValue?.[row.specialtyId];
                    if (specialtyValue != null && specialtyValue.type === "SPECIALTY") {
                        const serviceValue = specialtyValue?._childrenFg?.[row.serviceId];
                        if (serviceValue != null && serviceValue?.type === "SERVICE") {
                            serviceValue.selected = true;
                        }
                    }
                }
            }

            // Aggregate outer selected value
            for (const specialtyId of Object.keys(formValue)) {
                formValue[specialtyId].selected = Object.values(formValue[specialtyId]._childrenFg!).some(v => v.selected);
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

        for (const [specialtyId, specialtyNode] of Object.entries(value ?? {})) {
            if (specialtyNode?.type === "SPECIALTY") {
                for (const [serviceId, serviceNode] of Object.entries(specialtyNode._childrenFg ?? {})) {
                    if (serviceNode?.type === "SERVICE" && serviceNode?.selected) {
                        resultList.push({
                            specialtyId: Number.parseFloat(specialtyId),
                            serviceId: Number.parseFloat(serviceId),
                        });
                    }
                }
            }
        }

        return resultList;
    }

    protected stableKeyValueNgForTrackByFn: TrackByFunction<{ key: string; value: any; }> = (i, v) => v.key;

    private setFormVisibility(form: FormGroup, searchInput: string): Observable<FormModel> {
        const setNodeVisibility = (node: AbstractControl, isVisible: boolean) => {
            node?.get('_visible')?.setValue(isVisible, { emitEvent: false });
        };

        const searchInNode = (node: AbstractControl, forceVisible: boolean = false) => {
            if (node) {
                const label = node.get('_label')?.value;
                const isVisible = forceVisible || label.toLowerCase().includes(searchInput.toLowerCase()) || searchInput.length === 0;

                setNodeVisibility(node, isVisible);

                const childrenFg = node.get('_childrenFg');
                if (childrenFg instanceof FormGroup) searchInChildren(childrenFg, isVisible);
            }
        };

        const searchInChildren = (childrenFg: FormGroup, forceVisible: boolean = false) => {
            let hasVisibleChild = false;
            for (const ctrl of Object.values(childrenFg.controls)) {
                searchInNode(ctrl, forceVisible);
                if (ctrl.get('_visible')?.value) hasVisibleChild = true;
            }
            if (hasVisibleChild) setNodeVisibility(childrenFg.parent!, true);
        };

        // Beállítja az összes láthatósági értéket a form-ban
        searchInChildren(form);

        // Visszaadja a beállított form értékét
        return of(form);
    }
}
