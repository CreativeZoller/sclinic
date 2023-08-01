import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { PatientXEmployment } from "../../../models/patient-x-employment.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { DatePipe } from "@angular/common";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";


type Full_Model = PatientXEmployment;

@UntilDestroy()
@Component({
    selector: "app-patient-employment-list-field",
    templateUrl: "./patient-employment-list-field.component.html",
    styleUrls: ["./patient-employment-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class PatientEmploymentListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private datePipe = inject(DatePipe);

    public baseResourceKey = "patient.employment";
    public tableIdProperty = "patientXEmploymentId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("patient.employment.list.table.headers.company.fullName"),
            attributeName: "company.fullName",
        },
        {
            id: 2,
            name: this.resourceService.resolve("patient.employment.list.table.headers.companySite.siteName"),
            attributeName: "companySite.siteName",
        },
        {
            // TODO bekötni: üzem mező
            id: 3,
            name: this.resourceService.resolve("patient.employment.list.table.headers.TODO"),
            attributeName: "TODO",
        },
        {
            id: 4,
            name: this.resourceService.resolve("patient.employment.list.table.headers.hsco.hscoNumber"),
            attributeName: "hsco.hscoNumber",
        },
        {
            id: 5,
            name: this.resourceService.resolve("patient.employment.list.table.headers.jobTitle.titleName"),
            attributeName: "jobTitle.titleName",
        },
        {
            id: 6,
            name: this.resourceService.resolve("patient.employment.list.table.headers.jobTitleExpozition.titleName"),
            attributeName: "jobTitleExpozition.titleName",
        },
        {
            id: 7,
            name: this.resourceService.resolve("patient.employment.list.table.headers.startDate"),
            attributeName: "startDate",
            formatterFn: (v) => this.datePipe.transform(v),
        },
        {
            id: 8,
            name: this.resourceService.resolve("patient.employment.list.table.headers.endDate"),
            attributeName: "endDate",
            formatterFn: (v) => this.datePipe.transform(v),
        },
        {
            id: 9,
            name: this.resourceService.resolve("patient.employment.list.table.headers.number"),
            attributeName: "number",
        },
        {
            id: 10,
            name: this.resourceService.resolve("patient.employment.list.table.headers.dC_StatusId"),
            attributeName: "dC_StatusId",
            formatterFn: (value) => this.initData.dC_StatusList.find(o => o.value === value)?.name,
        },
        {
            id: 11,
            name: this.resourceService.resolve("patient.employment.list.table.headers.dC_OccupationalHealthClassificationId"),
            attributeName: "dC_OccupationalHealthClassificationId",
            formatterFn: (value) => this.initData.dC_OccupationalHealthClassificationList.find(o => o.value === value)?.name,
        },
    ];
}
