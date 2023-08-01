import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, map, shareReplay } from "rxjs";
import { InitPageData } from "src/app/modules/app-common/init-page-data-provider/models/init-page-data.model";
import { ResourceService } from "src/app/modules/core/resource/services/resource.service";
import { Grid_Patient } from "src/app/modules/feature/master-data/patients/models/patient.model";

type Grid_Model = Grid_Patient;
type TabConfig = {
    id: number,
    title: string
}
@UntilDestroy()
@Component({
    selector: "app-cc-appointments",
    templateUrl: "./appointments.component.html",
    styleUrls: ["./appointments.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CcAppointmentsComponent {
    pageTitle: string;
    loadText: string;
    initData: InitPageData;
    vipConfs: Array<any>;
    public isInitialMode: boolean = true; //only for the initial mode
    public selectedPatient: Grid_Model = {};
    public oldSelectedPatient: Grid_Model = {};
    public newSelection: boolean = false;

    public tabConfigs: TabConfig[] = [
        {
            id: 1,
            title: this.resourceService.resolve("cc.tabs.appointment.title")
        },
        {
            id: 2,
            title: this.resourceService.resolve("cc.tabs.overview.title")
        },
        {
            id: 3,
            title: this.resourceService.resolve("cc.tabs.notifications.title")
        },
        {
            id: 4,
            title: this.resourceService.resolve("cc.tabs.group-booking.title")
        }
    ];

    private _activeTabConfigIndex$ = new BehaviorSubject<number>(0);
    public activeTabConfigIndex$ = this._activeTabConfigIndex$.asObservable().pipe(
        shareReplay(1),
    )
    public activeTabConfig$ = this._activeTabConfigIndex$.asObservable().pipe(
        map((index) => this.tabConfigs[index]),
        shareReplay(1),
    )
    public setActiveTabConfigByIndex(index: number) {
        if (this.tabConfigs[index] != null && this._activeTabConfigIndex$.value !== index) {
            this._activeTabConfigIndex$.next(index);
        }
    }

    public showDetails(gridRowData: Grid_Model) {
        if (Object.keys(gridRowData).length != 0) {
            this.newSelection = true;
            this.selectedPatient = gridRowData;
            if (this.oldSelectedPatient !== this.selectedPatient) {
                this.newSelection = true;
                this.oldSelectedPatient = this.selectedPatient;
            } else {
                this.newSelection = false;
                this.oldSelectedPatient = {};
            }
        }
    }

    constructor(
        private resourceService: ResourceService,
        private activatedRoute: ActivatedRoute
    ) {
        this.pageTitle = this.resourceService.resolve("cc.page.title");
        this.loadText  = this.resourceService.resolve("general.tabs.loader");
        let patients = {
            ...this.activatedRoute.snapshot.data["init"],
            ...this.activatedRoute.snapshot.data["details"]
        };
        this.initData = patients;
        this.vipConfs = this.initData.dC_VIPList;
    }
    
}
