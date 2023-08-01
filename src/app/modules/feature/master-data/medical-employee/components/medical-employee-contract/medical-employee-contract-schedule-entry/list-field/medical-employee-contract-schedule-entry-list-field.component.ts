import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { TableHeader } from "../../../../../../../../components/table/table/table-header";
import { MedicalEmployeeXContractScheduleEntry } from "../../../../models/medical-employee-x-contract-schedule-entry.model";
import { BaseListFieldComponent } from "../../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { FormatTimePipe } from "../../../../../../../core/utility/pipes/format-time.pipe";
import { CurrencyPipe } from "@angular/common";


type Full_Model = MedicalEmployeeXContractScheduleEntry;

@UntilDestroy()
@Component({
    selector: "app-medical-employee-contract-schedule-entry-list-field",
    templateUrl: "./medical-employee-contract-schedule-entry-list-field.component.html",
    styleUrls: ["./medical-employee-contract-schedule-entry-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class MedicalEmployeeContractScheduleEntryListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private formatTimePipe = inject(FormatTimePipe);
    private currencyPipe = inject(CurrencyPipe);

    public baseResourceKey = "medical.employee.contract.schedule.entry";
    public tableIdProperty = "medicalContractPeriodId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("medical.employee.contract.schedule.entry.list.table.headers.dC_ScheduleSpecialTypeId"),
            attributeName: "dC_ScheduleSpecialTypeId",
            formatterFn: (v) => v == null ? "Műszak" : this.initData.dC_ScheduleSpecialTypeList.find((item) => item.value === v)?.name,
        },
        {
            id: 2,
            name: this.resourceService.resolve("medical.employee.contract.schedule.entry.list.table.headers.startTime"),
            attributeName: "startTime",
            formatterFn: (v) => this.formatTimePipe.transform(v),
        },
        {
            id: 3,
            name: this.resourceService.resolve("medical.employee.contract.schedule.entry.list.table.headers.endTime"),
            attributeName: "endTime",
            formatterFn: (v) => this.formatTimePipe.transform(v),
        },
        {
            id: 4,
            name: this.resourceService.resolve("medical.employee.contract.schedule.entry.list.table.headers.amount"),
            attributeName: "amount",
            formatterFn: (v) => this.currencyPipe.transform(v, "Ft", "code", "1.0-0", "hu"),
        },
    ];
}
