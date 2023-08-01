import { Component, Input, inject } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ResourceService } from "src/app/modules/core/resource/services/resource.service";
import { Grid_Patient } from "src/app/modules/feature/master-data/patients/models/patient.model";
import { BehaviorSubject } from "rxjs";
import { WithNgAfterViewInitSubject } from "src/app/modules/core/utility/mixins/with-ng-after-view-init-subject.mixin";

type Grid_Model = Grid_Patient;

@UntilDestroy()
@Component({
    selector: "app-cc-patient-services",
    templateUrl: "./patient-services.component.html",
    styleUrls: ["./patient-services.component.scss"],
})
export class CcPatientServicesComponent {
    @Input() patient: Grid_Model;
    public gotData: boolean = false;
    public resourceService = inject(ResourceService);
    public config = {
        addToFilterBtnLabel: this.resourceService.resolve("general.action.label.add")
    };
    public services$ = new BehaviorSubject<any[]>([]);
    public refreshFilteredServices(serviceToFilter: any): void {
        if (serviceToFilter) {
            this.gotData = true;
            const data = {
                balance: serviceToFilter.balance,
                clinicId: serviceToFilter.clinicId,
                dC_LanguageId: serviceToFilter.dC_LanguageId,
                doctors: serviceToFilter.doctors,
                startDate: serviceToFilter.startDate,
                endDate: serviceToFilter.endDate,
                startTime: serviceToFilter.startTime,
                endTime: serviceToFilter.endTime,
                patientAge: serviceToFilter.patientAge,
                price: serviceToFilter.price,
                rights: serviceToFilter.rights,
                service: serviceToFilter.service,
                specialty: serviceToFilter.specialty,
                days: serviceToFilter.days
            } as any;
            this.services$.next(this.services$.getValue().concat([serviceToFilter]));
        }
    }
}