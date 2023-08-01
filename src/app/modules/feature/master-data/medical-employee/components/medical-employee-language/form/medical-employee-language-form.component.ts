import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { combineLatest, distinctUntilChanged, map, Observable, of, shareReplay } from "rxjs";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { SelectOption } from "../../../../../../core/utility/types/select-option";
import { MedicalEmployeeXLanguage } from "../../../models/medical-employee-x-language.model";


type Full_Model = MedicalEmployeeXLanguage;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-language-form",
    templateUrl: "./medical-employee-language-form.component.html",
    styleUrls: ["./medical-employee-language-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalEmployeeLanguageFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    public errorResourceKeyPrefix = "medical.employee.language.form.errors";

    @Input() public allSelectedLanguageIds$: Observable<NonNullable<Full_Model["dC_LanguageId"]>[]> = of([]);

    public languageOptions$: Observable<SelectOption<NonNullable<Full_Model["dC_LanguageId"]>>[]> = of([]);

    public ngOnInit(): void {
        this.languageOptions$ = combineLatest([
            (this.allSelectedLanguageIds$ ?? of([])),
            this.initialEditorData$,
        ]).pipe(
            map(([allSelectedLanguageIds, initialEditorData]) => {
                return this.initData.dC_LanguageList.filter((opt) => {
                    return !allSelectedLanguageIds.includes(opt.value)
                        || initialEditorData?.dC_LanguageId === opt.value
                })
            }),
            distinctUntilChanged(),
            shareReplay(1),
        )
    }

    public form = new FormGroup({
        // Nyelv
        dC_LanguageId: new FormControl<Full_Model["dC_LanguageId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });
}
