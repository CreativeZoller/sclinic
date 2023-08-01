import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { BehaviorSubject, combineLatest, map, shareReplay } from "rxjs";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BaseSingleSelectionListFieldComponent } from "../../../../../../app-common/utility/base-single-selection-list-field/base-single-selection-list-field.directive";
import { DatePipe } from "@angular/common";
import { PatientXPatient } from "../../../models/patient-x-patient.model";


type Full_Model = NonNullable<PatientXPatient["relatedPatient"]>;

@UntilDestroy()
@Component({
    selector: "app-patient-single-selection-list-field",
    templateUrl: "./patient-single-selection-list-field.component.html",
    styleUrls: ["./patient-single-selection-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class PatientSingleSelectionListFieldComponent extends BaseSingleSelectionListFieldComponent<Full_Model> {

    private datePipe = inject(DatePipe);

    public baseResourceKey$ = new BehaviorSubject<string>("patient.x.patient");
    @Input() public set baseResourceKey(baseResourceKey: string) {
        this.baseResourceKey$.next(baseResourceKey);
    }
    public tableIdProperty = "patientId";

    public tableHeaders$ = this.baseResourceKey$.pipe(
        map((baseResourceKey) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.fullName`),
                    attributeName: "fullName",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.dateOfBirth`),
                    attributeName: "dateOfBirth",
                    formatterFn: (v) => this.datePipe.transform(v),
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.placeOfBirth`),
                    attributeName: "placeOfBirth",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.motherName`),
                    attributeName: "motherName",
                },
            ];
        }),
        shareReplay(1),
    )

    protected allUnselectablePatients$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() public set allUnselectablePatients(list: Full_Model[] | null | undefined) {
        this.allUnselectablePatients$.next(list ?? []);
    }

    protected allPatients$ = new BehaviorSubject<Full_Model[]>([]);
    @Input() public set allPatients(list: Full_Model[] | null | undefined) {
        this.allPatients$.next(list ?? []);
    }
    @Output() refreshAllPatients = new EventEmitter<void>();

    private isInitialGetTableData = true;
    public getTableData$ = () => {
        if (!this.isInitialGetTableData) this.refreshAllPatients.next();
        this.isInitialGetTableData = false;

        return combineLatest([
            this.allUnselectablePatients$,
            this.allPatients$,
        ]).pipe(
            map(([allUnselectablePatients, allPatients]) => allPatients.filter(s => {
                return !allUnselectablePatients.some((us) => us.patientId === s.patientId);
            })),
            shareReplay(1),
        );
    }
}
