import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormControl, FormGroup, AbstractControl, ValidatorFn, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { PriceTable, PriceTableStatus } from "../../models/price-table.model";
import { PriceTableStatusEnum } from "../../../../../../../api/enums";
import { ResourceService } from "../../../../../core/resource/services/resource.service";
import { isBetweenDateRange, isGreaterThanDateTime } from "../../../../../core/utility/validators/date.validator";
import { BehaviorSubject, distinctUntilChanged, filter, withLatestFrom } from "rxjs";
import { SelectOptionWithDto } from "../../../../../app-common/utility/models/select-option-with-dto.model";


type Full_Model = PriceTable;

@UntilDestroy()
@Component({
    selector: "app-price-table-form-update",
    templateUrl: "./price-table-form-update.component.html",
    styleUrls: ["./price-table-form-update.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTableFormUpdateComponent extends BaseFormComponent<Full_Model> {

    public resourceService = inject(ResourceService);
    public errorResourceKeyPrefix = "price.table.form.update.errors";
    public newPriceTable: boolean;

    private pendingActivePriceTable$ = new BehaviorSubject<Full_Model | undefined>(undefined);
    @Input() set pendingActivePriceTable(activePriceTable: Full_Model | undefined) {
        this.pendingActivePriceTable$.next(activePriceTable);
    };

    get pendingActivePriceTable(): Full_Model | undefined {
        return this.pendingActivePriceTable$.value;
    };

    private activePriceTable$ = new BehaviorSubject<Full_Model | undefined>(undefined);
    @Input() set activePriceTable(activePriceTable: Full_Model | undefined) {
        this.activePriceTable$.next(activePriceTable);
    };

    get activePriceTable(): Full_Model | undefined {
        return this.activePriceTable$.value;
    };

    public form = new FormGroup({
        priceTableId: new FormControl<Full_Model["priceTableId"]>(0, { nonNullable: true, validators: [] }),
        // Ártábla neve
        priceTableName: new FormControl<Full_Model["priceTableName"]>(undefined, { nonNullable: true, validators: [] }),
        // Ártábla azonosítója (Automatikusan Generált nem szerkeszthető)
        priceTableIdentifier: new FormControl<Full_Model["priceTableIdentifier"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [], }),
        // Forrás ártábla (Szülő Azonosító)
        parentPriceTableId: new FormControl<Full_Model["parentPriceTableId"]>(undefined, { nonNullable: true, validators: [] }),

        // Forrás ártábla (Szülő)
        parentPriceTable: new FormGroup({
            priceTableId: new FormControl<Full_Model["priceTableId"]>(0, { nonNullable: true, validators: [] }),
            // Ártábla neve
            priceTableName: new FormControl<NonNullable<Full_Model["parentPriceTable"]>["priceTableName"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [] }),
            // Ártábla azonosítója (Automatikusan Generált nem szerkeszthető)
            priceTableIdentifier: new FormControl<NonNullable<Full_Model["parentPriceTable"]>["priceTableIdentifier"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [], }),
        }),

        // Érvényesség kezdete
        startDate: new FormControl<Full_Model["startDate"]>(undefined, { nonNullable: true, validators: [isBetweenDateRange(undefined, "endDate")] }),
        // Érvényesség vége
        endDate: new FormControl<Full_Model["endDate"]>(undefined, { nonNullable: true, validators: [isBetweenDateRange("startDate", undefined)] }),
        // Folyamatos
        continuous: new FormControl<Full_Model["continuous"]>(false, { nonNullable: true, validators: [] }),
        // Státusz
        dC_PriceTableStatusId: new FormControl<Full_Model["dC_PriceTableStatusId"]>(PriceTableStatusEnum.DRAFT, { nonNullable: true, validators: [Validators.required] }),
        // Ártábla leírása
        description: new FormControl<Full_Model["description"]>(undefined, { nonNullable: true, validators: [] }),
        // Ársablonok
        priceTemplate: new FormControl<Full_Model["priceTemplate"]>([], { nonNullable: true, validators: [] }),
    });

    public filteredPriceTableStatusOptions: SelectOptionWithDto<PriceTableStatus, number>[];

    constructor() {
        super();
        this.monitorPriceTableStatusChanges();
        this.monitorStartDateChanges();
        this.monitorPriceTableContinuousChange();
        this.monitorPriceTableIdChange();
    }

    private monitorPriceTableIdChange() {
        this.form.controls.dC_PriceTableStatusId.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            withLatestFrom(this.pendingActivePriceTable$, this.activePriceTable$),
            untilDestroyed(this)
        ).subscribe(([currentPriceTableId, pendingActivePriceTable, activePriceTable]) => this.handleStartDateMin(activePriceTable, pendingActivePriceTable));
    }

    startDateMin: string | undefined;
    private handleStartDateMin(pendingActivePriceTable: Full_Model | undefined, activePriceTable: Full_Model | undefined) {
        const { priceTableId } = this.form.value;
        // set startDateMin to the greater endDate value
        if (activePriceTable && pendingActivePriceTable && activePriceTable?.endDate && pendingActivePriceTable?.endDate && priceTableId != activePriceTable?.priceTableId) {
            this.startDateMin = (activePriceTable.endDate > pendingActivePriceTable.endDate)
                ? activePriceTable.endDate
                : pendingActivePriceTable.endDate;
        } else if (pendingActivePriceTable && pendingActivePriceTable.endDate && priceTableId != pendingActivePriceTable?.priceTableId && priceTableId != activePriceTable?.priceTableId) {
            this.startDateMin = pendingActivePriceTable.endDate;
        } else if (activePriceTable && activePriceTable.endDate) {
            this.startDateMin = activePriceTable.endDate;
        }
    }


    private monitorPriceTableStatusChanges() {
        this.form.controls.dC_PriceTableStatusId.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            withLatestFrom(this.pendingActivePriceTable$, this.activePriceTable$),
            filter(([currPriceTableStatusId, _, __]) => currPriceTableStatusId !== undefined),
            untilDestroyed(this),
        ).subscribe(([currPriceTableStatusId, pendingActivePriceTable, activePriceTable]) => this.handlePriceTableStatusChange(currPriceTableStatusId!, pendingActivePriceTable, activePriceTable));

        this.form.controls.dC_PriceTableStatusId.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            withLatestFrom(this.pendingActivePriceTable$, this.activePriceTable$),
            filter(([currPriceTableStatusId, _, __]) => currPriceTableStatusId !== undefined),
            untilDestroyed(this)
        ).subscribe(([currentPriceTableId, pendingActivePriceTable, activePriceTable]) => this.handleValidators(currentPriceTableId, activePriceTable, pendingActivePriceTable));
    }

    // Check if the status is PREVIOUS_ACTIVE or INACTIVE (or ACTIVE  TODO szűréshez hozzáadás amikor a BE automatikus státusz váltás elérhető lesz)
    private handlePriceTableStatusChange(currPriceTableStatusId: number, pendingActivePriceTable: Full_Model | undefined, activePriceTable: Full_Model | undefined) {
        if (currPriceTableStatusId === PriceTableStatusEnum.INACTIVE
            || currPriceTableStatusId === PriceTableStatusEnum.PREVIOUS_ACTIVE) {

            this.handleActiveStatus();

            const disabledPriceTableStatus = this.initData.dC_PriceTableStatusList.find(x => x.value == currPriceTableStatusId);

            if (disabledPriceTableStatus) {
                this.setDisabledPriceTableStatus(disabledPriceTableStatus);
            }
        } else {
            this.handleDraftOrPendingActivationStatus(currPriceTableStatusId, pendingActivePriceTable);
        }

        this.handleRequiredStartDateValidator(currPriceTableStatusId);
    }

    private setDisabledPriceTableStatus(disabledPriceTableStatus: any) {
        this.filteredPriceTableStatusOptions = [disabledPriceTableStatus];
        this.form.controls.dC_PriceTableStatusId.setValue(disabledPriceTableStatus?.value, { emitEvent: false });
    }

    // If the status is DRAFT and there's a pending active price table, it disables startDate.
    // Otherwise, if it's ACTIVE or PENDING_ACTIVATION it enables startDate.
    private handleDraftOrPendingActivationStatus(currPriceTableStatusId: number, pendingActivePriceTable: Full_Model | undefined) {
        const { priceTableId } = this.form.value
        const isCurrentPendingActive = priceTableId === pendingActivePriceTable?.priceTableId ?? false;

        if (currPriceTableStatusId === PriceTableStatusEnum.DRAFT && pendingActivePriceTable && !isCurrentPendingActive) {
            this.disableControls(["startDate"]);
            this.enableControls(["dC_PriceTableStatusId"]);
            this.form.controls.startDate.setValue(undefined, { emitEvent: false });
            this.form.controls.endDate.setValue(undefined, { emitEvent: false });
        } else if (currPriceTableStatusId === PriceTableStatusEnum.ACTIVE || currPriceTableStatusId === PriceTableStatusEnum.PENDING_ACTIVATION) {

            this.enableControls(["startDate"]);
        }

        // Set disabled control (Status selector) when DRAFT or PENDING_ACTIVATION
        this.filteredPriceTableStatusOptions = this.initData.dC_PriceTableStatusList
            .filter(x => x.value === PriceTableStatusEnum.DRAFT ||
                x.value === PriceTableStatusEnum.PENDING_ACTIVATION ||
                x.value === PriceTableStatusEnum.ACTIVE /*TODO törlés ha a BE automata státusz váltás elérhető lesz */
            );
    }

    private monitorStartDateChanges() {
        this.form.controls.startDate.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            untilDestroyed(this),
        ).subscribe(date => this.handleStartDateChange(date));
    }

    // Enable the endDate control when the price table is not continuous and startDate is a valid date string
    // Otherwise, it disables the endDate control.
    private handleStartDateChange(_startDate: string | undefined) {
        const { continuous } = this.form.value;

        const date = Date.parse(_startDate ?? "");
        const startDateIsValid = !isNaN(date);

        if (startDateIsValid && !continuous) {
            this.enableControls(["endDate"]);
        } else {
            this.disableControls(["endDate"]);
        }
    }

    // If the new ID doesn't match the active or pending active price table, it adds validators to certain form controls.
    // Otherwise, it removes these validators.
    private handleValidators(dC_PriceTableStatusId: number | undefined, activePriceTable: Full_Model | undefined, pendingActivePriceTable: Full_Model | undefined) {

        const { priceTableId } = this.form.value;
        const isStatusActive = dC_PriceTableStatusId === PriceTableStatusEnum.ACTIVE;
        const isStatusPendingActivation = dC_PriceTableStatusId === PriceTableStatusEnum.PENDING_ACTIVATION;
        const isStatusDraft = dC_PriceTableStatusId === PriceTableStatusEnum.DRAFT;

        if(isStatusActive) {
            const activePriceTableId = activePriceTable?.priceTableId;
            const isGreaterThanActivePriceTableDateTimeInstance = isGreaterThanDateTime(activePriceTable?.endDate, true);

            const statusValidatorInstance = this.handleUniqStatusValidator(activePriceTableId, undefined);

            this.removeValidator("dC_PriceTableStatusId", statusValidatorInstance);
            this.addValidator("dC_PriceTableStatusId", statusValidatorInstance);
            if (priceTableId != activePriceTableId) {
                this.addValidator("startDate", isGreaterThanActivePriceTableDateTimeInstance);
            } else {
                this.removeValidator("startDate", isGreaterThanActivePriceTableDateTimeInstance);
            }
        } else if(isStatusPendingActivation) {
            const pendingActivePriceTableId = pendingActivePriceTable?.priceTableId;
            const statusValidatorInstance = this.handleUniqStatusValidator(undefined, pendingActivePriceTableId);
            const isGreaterThanPendingActivePriceTableDateTimeInstance = isGreaterThanDateTime(pendingActivePriceTable?.endDate, true);
            const isGreaterThanActivePriceTableDateTimeInstance = isGreaterThanDateTime(activePriceTable?.endDate, true);

            this.removeValidator("dC_PriceTableStatusId", statusValidatorInstance);
            this.addValidator("dC_PriceTableStatusId", statusValidatorInstance);

            if (priceTableId != pendingActivePriceTableId) {
                this.addValidator("startDate", isGreaterThanActivePriceTableDateTimeInstance);
                this.addValidator("startDate", isGreaterThanPendingActivePriceTableDateTimeInstance);
            } else {
                this.removeValidator("startDate", isGreaterThanActivePriceTableDateTimeInstance);
                this.removeValidator("startDate", isGreaterThanPendingActivePriceTableDateTimeInstance);
            }
        } else {
            // default validators
            this.form.controls.dC_PriceTableStatusId.clearValidators();
            this.form.controls.dC_PriceTableStatusId.addValidators(isBetweenDateRange(undefined, "endDate"));

            this.form.controls.startDate.clearValidators();
        }
        this.updateView();
    }

    private monitorPriceTableContinuousChange() {
        this.form.controls.continuous.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
            untilDestroyed(this),
        ).subscribe(value => this.handlePriceTableContinuousChange(value));
    }

    // If the price table is not continuous and the start date is valid, it enables the endDate control.
    // Otherwise, if it's _continuous and startDate is valid control and sets the end date to a maximum value.
    // Otherwise, endDate is undefined and disabled
    private handlePriceTableContinuousChange(_continuous: boolean | undefined) {
        const { startDate } = this.form.value;

        const date = Date.parse(startDate ?? "");
        const startDateIsValid = !isNaN(date);

        if (!_continuous && startDateIsValid) {
            this.enableControls(["endDate"]);
        } else if (_continuous && startDateIsValid) {
            this.form.controls.endDate.setValue("9999.12.31", { emitEvent: false });
            this.disableControls(["endDate"]);
        } else {
            this.form.controls.endDate.setValue(undefined, { emitEvent: false });
            this.disableControls(["endDate"]);
        }
    }

    // Disables form controls depending on the price table status.
    // If the status is ACTIVE, it disables dC_PriceTableStatusId and startDate. (TODO after BE fix)
    // If the status is INACTIVE or PREVIOUS_ACTIVE, it disables all controls.
    private handleActiveStatus() {
        const { dC_PriceTableStatusId } = this.form.value;
        if (dC_PriceTableStatusId === PriceTableStatusEnum.ACTIVE) {
            this.disableControls(["dC_PriceTableStatusId", "startDate"]);
        } else {
            this.disableControls();
        }
    }

    // Adds or removes a required validator from startDate depending on the price table status.
    // If the status is ACTIVE or PENDING_ACTIVATION, it adds the required validator.
    // If the status is DRAFT, it removes the required validator.
    private handleRequiredStartDateValidator(currPriceTableStatusId: PriceTableStatusEnum) {
        if (currPriceTableStatusId === PriceTableStatusEnum.ACTIVE
            || currPriceTableStatusId === PriceTableStatusEnum.PENDING_ACTIVATION
        ) {
            this.addValidator("startDate", Validators.required);
        } else if (currPriceTableStatusId === PriceTableStatusEnum.DRAFT) {
            this.removeValidator("startDate", Validators.required);
        }
    }

    // Returns a validator that checks whether the price table status is unique.
    // Only to ACTIVE and PENDING_ACTIVATION status
    private handleUniqStatusValidator(
        activePriceTableId: number | undefined,
        pendingActivePriceTableId: number | undefined,
    ): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const { priceTableId } = this.form.value;
            const isStatusActive = control.value === PriceTableStatusEnum.ACTIVE;
            const isStatusPendingActivation = control.value === PriceTableStatusEnum.PENDING_ACTIVATION;

            const isCurrentActive = priceTableId === activePriceTableId;
            const isCurrentPendingActive = priceTableId === pendingActivePriceTableId;

            if (isStatusActive && !!activePriceTableId && !isCurrentActive) {
                return {
                    activeNotUnique: true,
                };
            }

            if (isStatusPendingActivation && !!pendingActivePriceTableId && !isCurrentPendingActive) {
                return {
                    pendingActiveNotUnique: true,
                };
            }
            return null;
        };
    }

    // remove a validator from a form control
    removeValidator<K extends keyof PriceTableFormUpdateComponent["form"]["controls"]>(control: K, validator: ValidatorFn): void {
        if (this.form.controls[control]?.hasValidator(validator)) {
            this.form.controls[control].removeValidators(validator);
            this.form.controls[control].updateValueAndValidity();
        }
    }

    // add a validator to a form control
    addValidator<K extends keyof PriceTableFormUpdateComponent["form"]["controls"]>(control: K, validator: ValidatorFn): void {
        if (this.form.controls[control] && !this.form.controls[control].hasValidator(validator)) {
            this.form.controls[control].addValidators(validator);
            this.form.controls[control].updateValueAndValidity();
        }
    }

    // disable form controls
    disableControls<K extends keyof PriceTableFormUpdateComponent["form"]["controls"]>(controls?: K[]): void {
        if (controls && controls.length > 0) {
            // Specific controls have been passed, disable only these
            controls.forEach((control) => {
                if (!this.form.controls[control]?.disabled) {
                    this.form.controls[control].disable();
                }
            });
        } else {
            this.form.disable();
        }
    }

    // enable form controls
    enableControls<K extends keyof PriceTableFormUpdateComponent["form"]["controls"]>(controls?: K[]): void {
        if (controls && controls.length > 0) {
            // Specific controls have been passed, enable only these
            controls.forEach((control) => {
                if (this.form.controls[control]?.disabled) {
                    this.form.controls[control].enable();
                }
            });
        } else {
            this.form.enable();
        }
    }
}
