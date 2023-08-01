import { Component, ChangeDetectionStrategy, inject, Input } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { WithNgAfterViewInitSubject } from "src/app/modules/core/utility/mixins/with-ng-after-view-init-subject.mixin";
import { SelectedService } from "../models/selected-service.model";
import { MasterDataManagementService, MedicalManagementService, ResourceManagementService } from "src/api/services";
import { BehaviorSubject, Observable, combineLatest, debounceTime, map, of, pipe, switchMap, take } from "rxjs";
import { TableHeader } from "src/app/components/table/table/table-header";
import { ResourceService } from "src/app/modules/core/resource/services/resource.service";
import { ObserveInput } from "src/app/modules/core/utility/decorators/observe-input.decorator";
import { PaginationConfig } from "src/app/components/table/pagination/pagination.component";
import { Grid_Patient } from "src/app/modules/feature/master-data/patients/models/patient.model";
import { SelectedServiceRowModel } from "../models/selected-service-row.model";

type Grid_Model = Grid_Patient;
@UntilDestroy()
@Component({
    selector: "app-cc-filtered-services",
    templateUrl: "./filtered-services.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CcPatientFilteredServicesComponent extends WithNgAfterViewInitSubject(class {}) {
    @Input() data: any;
    @ObserveInput("data") data$!: BehaviorSubject<typeof this.data>;
    private masterDataManagementService = inject(MasterDataManagementService);
    private resourceManagementService = inject(ResourceManagementService);
    private medicalManagementService = inject(MedicalManagementService);
    private resourceService = inject(ResourceService);
    public baseResourceKey = "patient";
    public tableIdProperty = "patientId";
    public starting: any;
    public ending: any;
    public service: any;
    public specialty: any;
    public specName: string | undefined;
    public doctor: number | undefined;
    public searchAppointmentsFor: SelectedService[] = [];

    public checkValidity(date: Date, time: string) {
        const timePrefix = ':00';
        if (date == null) {
            return;
        } else {
            const timeValue = (time.includes('null')) ? '0' + timePrefix : time + timePrefix;
            const stringValue = [date, timeValue].join(' ');
            const dateValue = new Date(stringValue);
            const returnValue = dateValue.toISOString();
            return returnValue;
        }
    }

    // public getExpandedRowChildRows = (row: SelectedServiceRowModel): SelectedServiceRowModel[]  => {
    //     return row._children ?? [];
    // }

    // public getRowClasses = (row: SelectedServiceRowModel, expandedRows: SelectedServiceRowModel[]): string[] => {
    //     if (row._level === 1 && !expandedRows.includes(row)) {
    //         return [];
    //     } else {
    //         return [`expanded-row-bg-color-lvl-${row._level}`];
    //     }
    // }

    public totalRecordCount$ = new BehaviorSubject<number>(0);
    // private filterData$ = new BehaviorSubject<any>({});
    public getTableData$: (pageConfig: PaginationConfig) => Observable<any> = (pageConfig) => {
        // this.data$.forEach((service) => {
        //     console.log(typeof service);
        //     console.dir(service);
        // })
        return this.data$;
    }

    public tableHeaders: TableHeader[] = [  //todo: fix with formatters than fix with search
        {
            name: this.resourceService.resolve("cc.services.label.specialty")
        },
        {
            name: this.resourceService.resolve("cc.services.label.service")
        },
        {
            name: this.resourceService.resolve("cc.services.label.legals")
        },
        {
            name: this.resourceService.resolve("cc.services.label.price")
        },
        {
            name: this.resourceService.resolve("cc.services.label.balance")
        },
        {
            name: this.resourceService.resolve("cc.services.label.doctor")
        },
        {
            name: this.resourceService.resolve("cc.services.label.standartTime")
        },
        {
            name: this.resourceService.resolve("cc.services.label.delayTime")
        },
        {
            name: this.resourceService.resolve("cc.services.label.position")
        },
        {
            name: this.resourceService.resolve("cc.services.label.specialCare")
        }
    ];
}