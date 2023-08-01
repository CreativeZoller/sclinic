import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, filter, map, shareReplay, skip, startWith, switchMap, takeUntil } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { ServiceXItem } from "../../../models/service-x-item.model";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseControlValueAccessor, SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSelectionListFieldComponent } from "../../../../../../app-common/utility/base-selection-list-field/base-selection-list-field.directive";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { CheckboxFieldComponent } from "../../../../../../app-common/checkbox-field/components/checkbox-field/checkbox-field.component";
import { controlExtractTouchedChanges$ } from "../../../../../../core/utility/methods/control-extract-touched-changes";
import { NumberFieldComponent } from "../../../../../../app-common/number-field/components/number-field/number-field.component";
import { SelectFieldComponent } from "../../../../../../app-common/select-field/components/select-field/select-field.component";

type ModelToFormGroup<T extends Object> = FormGroup<{
    [key in keyof T]: FormControl<T[key]>;
}>

type Full_Model = ServiceXItem & {
    _rowFg: ModelToFormGroup<ServiceXItem>,
};

@UntilDestroy()
@Component({
    selector: "app-service-item-selection-list-field",
    templateUrl: "./service-item-selection-list-field.component.html",
    styleUrls: ["./service-item-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceItemSelectionListFieldComponent extends BaseSelectionListFieldComponent<Full_Model> implements OnInit, AfterViewInit {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "service.item";
    public tableIdProperty = "itemId";

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.item.list.table.headers.item.itemNumber"),
            attributeName: "item.itemNumber",
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.item.itemName"),
            attributeName: "item.itemName",
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.itemConsumption"),
            cellComponent: NumberFieldComponent,
            initCellComponentBindingsFactoryFn: (_, row) => {
                return (comp: NumberFieldComponent) => {
                    comp.hideLabel = true;
                    this.syncComponentToControl(comp, row._rowFg.controls.itemConsumption);
                }
            },
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.isRetailable"),
            cellComponent: CheckboxFieldComponent,
            initCellComponentBindingsFactoryFn: (_, row) => {
                return (comp: CheckboxFieldComponent) => {
                    this.syncComponentToControl(comp, row._rowFg.controls.isRetailable);
                }
            },
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.item.dC_ItemTypeId"),
            attributeName: "item.dC_ItemTypeId",
            formatterFn: (v) => this.initData.dC_ItemTypeList.find((item) => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.item.list.table.headers.dC_ItemConsumerTypeId"),
            cellComponent: SelectFieldComponent,
            initCellComponentBindingsFactoryFn: (_, row) => {
                return (comp: SelectFieldComponent) => {
                    comp.hideLabel = true;
                    comp.options = this.initData.dC_ItemConsumerTypeList;
                    this.syncComponentToControl(comp, row._rowFg.controls.dC_ItemConsumerTypeId);
                }
            },
        },
    ];

    private syncComponentToControl(comp: BaseControlValueAccessor, ctrl: AbstractControl) {
        comp.control = ctrl;

        comp.registerOnChange((value) => ctrl.setValue(value));
        comp.registerOnTouched(() => ctrl.markAllAsTouched());

        ctrl.valueChanges.pipe(
            untilDestroyed(this),
            takeUntil(this.tableData$.pipe(skip(1))),
            startWith(ctrl.value),
        ).subscribe((value) => {
            comp.writeValue(value);
        });

        ctrl.statusChanges.pipe(
            untilDestroyed(this),
            takeUntil(this.tableData$.pipe(skip(1))),
            startWith(ctrl.status),
            map((status) => status === "DISABLED"),
        ).subscribe((isDisabled) => {
            comp.setDisabledState(isDisabled);
        })
    }

    private refreshTableData$ = new BehaviorSubject<void>(void 0);
    private tableData$ = this.refreshTableData$.pipe(
        switchMap(() => this.masterDataManagementService.itemGetItemByConditionPost({})),
        map(res => res?.businessObjectList ?? []),
        map(itemList => itemList.map(item => (<Full_Model>{
            item: item,
            itemId: item.itemId,
            _rowFg: new FormGroup({
                itemConsumption: new FormControl<Full_Model["itemConsumption"]>(1, { nonNullable: true, validators: [Validators.min(1)]}),
                isRetailable: new FormControl<Full_Model["isRetailable"]>(false, { nonNullable: true, validators: []}),
                dC_ItemConsumerTypeId: new FormControl<Full_Model["dC_ItemConsumerTypeId"]>(undefined, { nonNullable: true, validators: []}),
            }),
        }))),
        shareReplay(1),
    );

    public getTableData$ = () => {
        this.refreshTableData$.next();
        return this.tableData$;
    }

    protected rowTransformerFn(row: ServiceXItem): ServiceXItem {
        const { _rowFg, ...rest } = row as Full_Model;
        return {...rest, ..._rowFg?.value};
    }

    protected formArray = new FormArray<Full_Model["_rowFg"]>([]);

    private validatorFn = () => this.formArray.valid ? null : { invalid: true };

    public ngOnInit(): void {
        const outerCtrl = this.ngControl?.control;
        if (outerCtrl != null) {
            if (!outerCtrl.hasValidator(this.validatorFn)) {
                outerCtrl.addValidators(this.validatorFn);
            }
            outerCtrl.updateValueAndValidity();

            this.formArray.statusChanges.pipe(untilDestroyed(this)).subscribe(() => {
                outerCtrl.updateValueAndValidity();
            });

            controlExtractTouchedChanges$(outerCtrl, false).pipe(untilDestroyed(this)).subscribe((isTouched) => {
                if (isTouched) this.formArray.markAllAsTouched();
                else this.formArray.markAsUntouched();
            });
        }
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.tableData$.pipe(untilDestroyed(this)).subscribe((rows) => {
            this.formArray.clear({ emitEvent: false});
            for(const row of rows) this.formArray.push(row._rowFg, { emitEvent: false });

            this.formArray.reset();
        });

        this.selectionListFieldComponent.initialData$.pipe(untilDestroyed(this)).subscribe((initData) => {
            this.formArray.reset(initData);
        });

        this.selectionListFieldComponent.selectedRowIds$.pipe(
            untilDestroyed(this),
        ).subscribe((selectedRowIds) => {
            this.tableData$.pipe(
                untilDestroyed(this),
                takeUntil(this.selectionListFieldComponent.selectedRowIds$.pipe(skip(1))),
            ).subscribe(rows => {
                for(const row of rows) {
                    const isRowSelected = selectedRowIds.includes(row[this.tableIdProperty as keyof Full_Model]);

                    const ctrlList = [
                        row._rowFg.controls.itemConsumption!,
                        row._rowFg.controls.dC_ItemConsumerTypeId!,
                    ];
                    for (const ctrl of ctrlList) {
                        if (isRowSelected) {
                            if (!ctrl.hasValidator(Validators.required)) {
                                ctrl.addValidators(Validators.required);
                                ctrl.updateValueAndValidity();
                            }
                        } else {
                            if (ctrl.hasValidator(Validators.required)) {
                                ctrl.removeValidators(Validators.required)
                                ctrl.updateValueAndValidity();
                            }
                        }
                    }
                }
            });
        })

        this.formArray.valueChanges.pipe(
            startWith(this.formArray.value),
            untilDestroyed(this),
        ).subscribe(() => {
            // Trigger change in app-selection-list-field, so `rowTransformerFn` will run
            this.selectionListFieldComponent.selectedRowIds$.next(
                this.selectionListFieldComponent.selectedRowIds$.value,
            );
        })
    }
}
