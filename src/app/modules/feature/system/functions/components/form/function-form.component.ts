import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Function } from "../../models/function.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, combineLatest, map, shareReplay } from "rxjs";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";


type Full_Model = Function;

@UntilDestroy()
@Component({
    selector: "app-function-form",
    templateUrl: "./function-form.component.html",
    styleUrls: ["./function-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FunctionFormComponent extends BaseFormComponent<Full_Model> {

    private editedFunctionId$ = new BehaviorSubject<Full_Model["functionId"]>(undefined);
    private allFunctions$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() set allFunctions(allFunctions: Full_Model[]) {
        this.allFunctions$.next(allFunctions);
    };

    parentFunctions$ = combineLatest([
        this.editedFunctionId$,
        this.allFunctions$,
    ]).pipe(
        map(([editedFunctionId, allFunctions]) => allFunctions.filter((item) => item.functionId !== editedFunctionId)),
        map((possibleParentFunctions) => possibleParentFunctions.map(item => ({ value: item.functionId!, name: item.functionName! }))),
        shareReplay(1),
    )

    public errorResourceKeyPrefix = "function.form.errors";

    public setFormValue(data: Full_Model | undefined | null) {
        this.form.reset();
        if (data != null) {
            this.form.patchValue(data);
        }
        this.editedFunctionId$.next(data?.functionId);
    };

    public form = new FormGroup({
        // Megnevezés
        functionName: new FormControl<Full_Model["functionName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Szülő
        parentFunctionId: new FormControl<Full_Model["parentFunctionId"]>(undefined, { nonNullable: true, validators: [] }),
        // Típus
        dC_FunctionTypeId: new FormControl<Full_Model["dC_FunctionTypeId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });
}
