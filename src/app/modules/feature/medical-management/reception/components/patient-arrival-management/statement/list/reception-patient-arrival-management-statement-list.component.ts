import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, map, Observable } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../../../api/services";
import { TableBulkAction } from "../../../../../../../../components/table/table/table-bulk-action";
import { TableHeader } from "../../../../../../../../components/table/table/table-header";
import { ResourceService } from "../../../../../../../core/resource/services/resource.service";
import { PatientArrivalManagementStatementTableRowModel } from "../../../../models/patient-arrival-management-statement-table-row.model";
import { PatientManagementTableRowModel } from "../../../../models/patient-management-table-row.model";


@UntilDestroy()
@Component({
    selector: "app-reception-patient-arrival-management-statement-list",
    templateUrl: "./reception-patient-arrival-management-statement-list.component.html",
    styleUrls: ["./reception-patient-arrival-management-statement-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionPatientArrivalManagementStatementListComponent {

    private resourceService = inject(ResourceService);
    private datePipe = inject(DatePipe);

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "reception.tabs.patient.management.arrival.management.statement";
    public tableIdProperty = "id";

    protected bulkActions: TableBulkAction[] = [
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.statement.list.table.bulk.actions.send.to.tablet"),
            onClick: ({ selectedRows }) => {
                // TODO tabletre küldés
            },
        },
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.statement.list.table.bulk.actions.print"),
            onClick: ({ selectedRows }) => {
                // TODO print
            },
        },
        {
            label: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.statement.list.table.bulk.actions.scan"),
            onClick: ({ selectedRowIds }) => {
                if (selectedRowIds?.length === 1) {
                    // TODO szkennelés
                        // this.masterDataManagementService.documentCreateOrUpdateDocumentPost({
                        //     businessObjectList: [{
                        //         documentId: 0,
                        //         documentJSON: undefined,// TODO scanned doc/img data
                        //         documentTemplateId: selectedRowIds[0],
                        //     }],
                        // }).pipe(
                        //     untilDestroyed(this),
                        // ).subscribe();
                }
            },
        },
    ];

    tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.statement.list.table.headers.isSigned"),
            formatterFn: (row: PatientArrivalManagementStatementTableRowModel) => `<div class="form-check form-check-custom form-check-solid form-check-sm">
                <input type="checkbox" ${row?.isSigned ? "checked" : ""} disabled class="form-check-input">
            </div>`,
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.statement.list.table.headers.name"),
            formatterFn: (row: PatientArrivalManagementStatementTableRowModel) => row?.name ?? "",
        },
        {
            name: this.resourceService.resolve("reception.tabs.patient.management.arrival.management.statement.list.table.headers.dateOfSignature"),
            formatterFn: (row: PatientArrivalManagementStatementTableRowModel) => this.datePipe.transform(row?.dateOfSignature ?? ""),
        },
    ];

    private patientManagementTableRowModel$ = new BehaviorSubject<PatientManagementTableRowModel | undefined>(undefined);
    @Input() set patientManagementTableRowModel(patientManagementTableRowModel: PatientManagementTableRowModel | null | undefined) {
        this.patientManagementTableRowModel$.next(patientManagementTableRowModel ?? undefined);
    }

    public getTableData$: () => Observable<PatientArrivalManagementStatementTableRowModel[]> = () => {
        return this.patientManagementTableRowModel$.pipe(
            map((patientManagementTableRowModel) => {
                const appointmentDocumentList = patientManagementTableRowModel?._children
                    ?.flatMap(row => row?.appointment?.appointmentDocument)
                    ?? [];

                return patientManagementTableRowModel?._children
                    ?.flatMap(row => row?.appointment?.appointmentServiceExtension)
                    ?.flatMap(se => se?.service?.serviceXDocumentTemplate ?? [])
                    ?.filter((dt, i, arr) => arr.findIndex(dt2 => dt2?.documentTemplateId === dt?.documentTemplateId) === i)
                    ?.map(dt => {
                        // TODO missing appointmentDocumentDetails
                        // const mathcingAppointmentDocumentDetails = appointmentDocumentList
                        //     .find(ad => ad?.appointmentDocumentDetails?.documentTemplateId === dt.documentTemplateId)
                        //     ?.appointmentDocumentDetails;

                        return <PatientArrivalManagementStatementTableRowModel>{
                            id: dt.documentTemplateId,
                            name: dt.documentTemplate?.name,
                            // isSigned: mathcingAppointmentDocumentDetails != null,
                            // dateOfSignature: mathcingAppointmentDocumentDetails?.creationDate,
                        };
                    })
                    ?? [];
            }),
        );
    }
}
