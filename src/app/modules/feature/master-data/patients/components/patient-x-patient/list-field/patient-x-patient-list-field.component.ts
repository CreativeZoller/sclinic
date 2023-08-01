import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BehaviorSubject, combineLatest, map, of, shareReplay, switchMap } from "rxjs";
import { DatePipe } from "@angular/common";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { PatientXPatient } from "../../../models/patient-x-patient.model";
import { MasterDataManagementService } from "../../../../../../../../api/services";


type Full_Model = PatientXPatient;

@UntilDestroy()
@Component({
    selector: "app-patient-x-patient-list-field",
    templateUrl: "./patient-x-patient-list-field.component.html",
    styleUrls: ["./patient-x-patient-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class PatientXPatientListFieldComponent extends BaseListFieldComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    private datePipe = inject(DatePipe);

    public baseResourceKey$ = new BehaviorSubject<string>("patient.x.patient");
    @Input() public set baseResourceKey(baseResourceKey: string) {
        this.baseResourceKey$.next(baseResourceKey);
    }
    @Input() public tableIdProperty = "patientXPatientId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders$ = this.baseResourceKey$.pipe(
        map((baseResourceKey) => {
            return <TableHeader[]>[
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.fullName`),
                    attributeName: "relatedPatient.fullName",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.dateOfBirth`),
                    attributeName: "relatedPatient.dateOfBirth",
                    formatterFn: (v) => this.datePipe.transform(v),
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.placeOfBirth`),
                    attributeName: "relatedPatient.placeOfBirth",
                },
                {
                    name: this.resourceService.resolve(`${baseResourceKey}.list.table.headers.motherName`),
                    attributeName: "relatedPatient.motherName",
                },
            ];
        }),
        shareReplay(1),
    )

    public allSelectedPatients$ = this.getValue$().pipe(
        map((list) => (list ?? []).map(v => v!).filter(v => v != null)),
        shareReplay(1),
    );

    protected currentPatientId$ = new BehaviorSubject<number | undefined>(undefined);
    @Input() set currentPatientId(patientId: number | undefined | null) {
        this.currentPatientId$.next(patientId ?? undefined);
    }

    protected refreshAllPatients$ = new BehaviorSubject<void>(void 0);
    protected allPatients$ = this.refreshAllPatients$.pipe(
        switchMap(() =>
            combineLatest([
                this.masterDataManagementService.patientGetPatientsByConditionPost({}),
                this.currentPatientId$,
            ]),
        ),
        map(([res, currentPatientId]) =>
            res?.businessObjectList?.filter(x => x.patientId !== currentPatientId) ?? [],
        ),
        shareReplay(1),
    );

    protected canCreate$ = combineLatest([
        this.allPatients$,
        this.allSelectedPatients$
    ]).pipe(
        map(([allPatients, allSelectedPatients]) => {
            return !(
                allPatients.length === allSelectedPatients.length
                && allPatients.every(s => allSelectedPatients.some(as => as.patientId === s.patientId))
            );
        }),
        shareReplay(1),
    )

    protected dragAndDropConfig = {
        enabled: true,
        onDrop: (event: CdkDragDrop<Full_Model[]>) => {
            if(event.currentIndex !== event.previousIndex) {
                const newListValue: Full_Model[] = [...this.listFieldComponent?.value] as any[];
                moveItemInArray(newListValue, event.previousIndex, event.currentIndex)

                const changedRow = newListValue[event.currentIndex];
                // In case we moved a row with "0" position

                this.listFieldComponent?.changeValue(newListValue);
            }
        },
    };

    protected handleSave$ = ({rowData, formValue}: ListHandlerCallbackData<Full_Model, Full_Model>) => {
        const value = this.listFieldComponent.value ?? [];

        const indexToUpdate = (rowData as any)?._index as number | undefined;
        if (indexToUpdate != null) value[indexToUpdate] = formValue;
        else value.push(formValue);

            moveItemInArray(value, indexToUpdate ?? value.length - 1, 0)

        this.listFieldComponent.changeValue([
            ...value,
        ]);

        return of(null);
    }

    protected handleDelete$ = ({rowData}: ListHandlerCallbackData<Full_Model, Full_Model>) => {
        const value = this.listFieldComponent.value ?? [];

        this.listFieldComponent.changeValue(
            value.filter((_, i) => i !== (rowData as any)?._index)
        );

        return of(null);
    }

    protected valueToFormValue: (value: Full_Model[]) => Full_Model[] = (value: Full_Model[]) => {
        if (!Array.isArray(value)) return [];
        if (this.listFieldComponent?.editorForm == null) return value as unknown as Full_Model[];

        return value.map((v) => {
                // Workaround: valamiért a "listFieldComponent.editorForm.form"-ra nem setteli rendesen a "relatedPatient"
                // property-t, így inkább nem is használjuk "setFormValue" és "getFormValue" metódusokat

                if(this.listFieldComponent == null) return v;

                const validProperties = Object.keys(this.listFieldComponent.editorForm.form.controls);

                const value: any = { ...v };
                for(const key of Object.keys(value)) {
                    if (!validProperties.includes(key)) delete value[key];
                }

                return value;
            })
    };
}
