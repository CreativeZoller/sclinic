import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { combineLatest, distinctUntilChanged, map, Observable, of, shareReplay, startWith } from "rxjs";
import { ContactTypeEnum } from "../../../../../../../../api/enums";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { SelectOption } from "../../../../../../core/utility/types/select-option";
import { fullEmailValidator } from "../../../../../../core/utility/validators/full-email.validator";
import { MedicalEmployeeXContact } from "../../../models/medical-employee-x-contact.model";


type Full_Model = MedicalEmployeeXContact;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-contact-form",
    templateUrl: "./medical-employee-contact-form.component.html",
    styleUrls: ["./medical-employee-contact-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalEmployeeContactFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    public errorResourceKeyPrefix = "medical.employee.contact.form.errors";

    @Input() public allSelectedContactTypeIds$: Observable<NonNullable<Full_Model["dC_ContactTypeId"]>[]> = of([]);

    public contactTypeOptions$: Observable<SelectOption<NonNullable<Full_Model["dC_ContactTypeId"]>>[]> = of([]);

    public ngOnInit(): void {
        this.contactTypeOptions$ = combineLatest([
            (this.allSelectedContactTypeIds$ ?? of([])),
            this.initialEditorData$,
        ]).pipe(
            map(([allSelectedContactTypeIds, initialEditorData]) => {
                return this.initData.dC_ContactTypeList.filter((opt) => {
                    return !allSelectedContactTypeIds.includes(opt.value)
                        || initialEditorData?.dC_ContactTypeId === opt.value
                })
            }),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }

    public form = new FormGroup({
        // Elérhetőség típusa
        dC_ContactTypeId: new FormControl<Full_Model["dC_ContactTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Elérhetőség értéke
        contactValue: new FormControl<Full_Model["contactValue"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });

    private selectedContactType$ = this.form.controls.dC_ContactTypeId.valueChanges.pipe(
        startWith(this.form.controls.dC_ContactTypeId.value),
    );

    protected contactValueType$: Observable<"EMAIL" | "PHONE_NUMBER"> = this.selectedContactType$.pipe(
        map((type) => {
            return type === ContactTypeEnum.PHONE_NUMBER_1 || type === ContactTypeEnum.PHONE_NUMBER_2
                ? "PHONE_NUMBER"
                : "EMAIL";
        }),
    );

    constructor() {
        super();

        this.contactValueType$.pipe(
            untilDestroyed(this),
        ).subscribe((type) => {
            const contactValueCtrl = this.form.controls.contactValue;

            if (type === "EMAIL") {
                if (!contactValueCtrl.hasValidator(fullEmailValidator)) {
                    contactValueCtrl.addValidators(fullEmailValidator);
                    contactValueCtrl.reset();
                }
            } else {
                if (contactValueCtrl.hasValidator(fullEmailValidator)) {
                    contactValueCtrl.removeValidators(fullEmailValidator);
                    contactValueCtrl.reset();
                }
            }
        })
    }
}
