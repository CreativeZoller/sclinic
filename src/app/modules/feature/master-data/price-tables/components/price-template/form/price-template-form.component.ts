import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { isBetweenDateRange } from "../../../../../../core/utility/validators/date.validator";
import { PriceTemplate } from "../../../models/price-template.model";


type Full_Model = PriceTemplate;

@UntilDestroy()
@Component({
    selector: "app-price-template-form",
    templateUrl: "./price-template-form.component.html",
    styleUrls: ["./price-template-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceTemplateFormComponent extends BaseFormComponent<Full_Model> {

    public errorResourceKeyPrefix = "price.template.form.errors";

    public form = new FormGroup({
        // Azonosító
        priceTemplateId: new FormControl<Full_Model["priceTemplateId"]>(0, { nonNullable: true, validators: [Validators.required]}),

        // Ársablon neve
        priceTemplateName: new FormControl<Full_Model["priceTemplateName"]>("", { nonNullable: true, validators: [Validators.required]}),

        // Callcenteren látható?
        isAvailableForCC: new FormControl<Full_Model["isAvailableForCC"]>(false, { nonNullable: true, validators: [Validators.required]}),
        // Recepción látható?
        isAvailableForReception: new FormControl<Full_Model["isAvailableForReception"]>(false, { nonNullable: true, validators: [Validators.required]}),

        // Érvényesség kezdete
        startDate: new FormControl<Full_Model["startDate"]>(undefined, { nonNullable: true, validators: [isBetweenDateRange(undefined, "endDate")] }),
        // Érvényesség vége
        endDate: new FormControl<Full_Model["endDate"]>(undefined, { nonNullable: true, validators: [isBetweenDateRange("startDate", undefined)] }),
    });
}
