import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { MedicalEmployeeXLanguage } from "../../../models/medical-employee-x-language.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { filter, map, shareReplay } from "rxjs";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = MedicalEmployeeXLanguage;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-language-list-field",
    templateUrl: "./medical-employee-language-list-field.component.html",
    styleUrls: ["./medical-employee-language-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class MedicalEmployeeLanguageListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "medical.employee.language";
    public tableIdProperty = "medicalEmployeeXDC_LanguageId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("medical.employee.language.list.table.headers.dC_LanguageId"),
            attributeName: "dC_LanguageId",
            formatterFn: (value) => this.initData.dC_LanguageList.find(o => o.value === value)?.name,
        },
    ];

    public allSelectedLanguageIds$ = this.getValue$().pipe(
        map((value) => value?.map(v => v.dC_LanguageId!) ?? []),
        filter(v => v != null),
        shareReplay(1),
    )
}
