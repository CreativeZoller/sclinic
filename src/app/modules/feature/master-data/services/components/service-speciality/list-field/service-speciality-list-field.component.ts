import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServiceXSpecialty } from "../../../models/service-x-specialty.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { Observable, of, shareReplay } from "rxjs";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { FormModel } from "../selection-list-form/service-speciality-selection-list-form.component";


type Full_Model = ServiceXSpecialty;

@UntilDestroy()
@Component({
    selector: "app-service-speciality-list-field",
    templateUrl: "./service-speciality-list-field.component.html",
    styleUrls: ["./service-speciality-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceSpecialityListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public baseResourceKey = "service.speciality";
    public tableIdProperty = "specialtyXServiceId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.speciality.list.table.headers.specialty.specialtyName"),
            attributeName: "specialty.specialtyName",
        },
        {
            name: this.resourceService.resolve("service.speciality.list.table.headers.specialty.specialtyCode"),
            attributeName: "specialty.specialtyCode",
        },
    ];

    public allSelectedSpecialities$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(
            (formValue?.selectedSpecialities ?? []).map(s => ({
                specialtyId: s.specialtyId,
                specialty: s,
            })),
        );

        return of(null);
    }
}
