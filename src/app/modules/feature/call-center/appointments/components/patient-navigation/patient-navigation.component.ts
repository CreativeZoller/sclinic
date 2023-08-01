import { Component, Input, ChangeDetectionStrategy, inject } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, shareReplay, map } from "rxjs";
import { ResourceService } from "src/app/modules/core/resource/services/resource.service";
import { Grid_Patient } from "src/app/modules/feature/master-data/patients/models/patient.model";

type Grid_Model = Grid_Patient;
type TabConfig = {
    id: number,
    title: string
}

@UntilDestroy()
@Component({
    selector: "app-cc-patient-navigation",
    templateUrl: "./patient-navigation.component.html",
    styleUrls: ["./patient-navigation.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CcPatientNavigationComponent {
    @Input() patient: Grid_Model;

    pageTitle: string;
    loadText: string;
    public isInitialMode: boolean = true; //only for the initial mode

    private resourceService = inject(ResourceService);
    public tabConfigs: TabConfig[] = [
        {
            id: 1,
            title: this.resourceService.resolve("cc.tabs.appointment.services.ambulatory.title")
        },
        {
            id: 2,
            title: this.resourceService.resolve("cc.tabs.appointment.services.healthcare.title")
        },
        {
            id: 3,
            title: this.resourceService.resolve("cc.tabs.appointment.services.filtration.title")
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
    public setPatientSubNavigationByIndex(index: number) {
        if (this.tabConfigs[index] != null && this._activeTabConfigIndex$.value !== index) {
            this._activeTabConfigIndex$.next(index);
        }
    }
}