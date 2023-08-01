import { AfterViewInit, Component, Input, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ResourceService } from "src/app/modules/core/resource/services/resource.service";
import { Grid_Patient, Patient } from "src/app/modules/feature/master-data/patients/models/patient.model";

type Grid_Model = Grid_Patient;

@UntilDestroy()
@Component({
    selector: "app-cc-patient-details",
    templateUrl: "./patient-details.component.html"
})
export class CcPatientDetailsComponent implements OnInit {
    @Input() patient: Grid_Model;
    @Input() vip: Array<any>;
    public filtered: any[];
    public patientComment: string | undefined;
    public patientVipStatus: string | undefined;
    public patientVipId: number | undefined;
    public form = new FormGroup({
        publicComment: new FormControl<Patient["publicComment"]>({ value: undefined, disabled: true }, { nonNullable: true, validators: [] }),
        vipStatus: new FormControl<string>({ value: '', disabled: true}, { nonNullable: true, validators: [] }),
    });

    public resourceService = inject(ResourceService);
    public config = {
        historyBtnLabel: this.resourceService.resolve("cc.action.label.history"),
        legalBtnLabel: this.resourceService.resolve("cc.action.label.legal")
    };

    ngOnInit() {
        if (this.patient) {
            this.patientComment = this.patient.publicComment;
            this.patientVipId   = this.patient.dC_VIPId;
            this.filtered = this.vip.filter((obj) => {
                return obj.value == this.patient.dC_VIPId;
            });
            if(this.filtered) this.patientVipStatus = this.filtered[0]?.name;
            this.form.patchValue({
                publicComment: this.patientComment,
                vipStatus: this.patientVipStatus
            });
        }
    }
}
