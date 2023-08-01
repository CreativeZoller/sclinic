import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { BehaviorSubject, combineLatest, map, shareReplay } from "rxjs";
import { ServicePackageXLabService } from "../../../models/service-package-x-lab-service.model";


type Full_Model = ServicePackageXLabService;

@UntilDestroy()
@Component({
    selector: "app-service-package-lab-service-form",
    templateUrl: "./service-package-lab-service-form.component.html",
    styleUrls: ["./service-package-lab-service-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePackageLabServiceFormComponent extends BaseFormComponent<Full_Model> {

    @Input() public baseResourceKey = "service.package.lab.service";
    public get errorResourceKeyPrefix() { return this.baseResourceKey + ".form.errors"; }

    public form = new FormGroup({
        // Sorszám
        position: new FormControl<Full_Model["position"]>(0, { nonNullable: true, validators: [Validators.min(0)] }),
        // Maximum idő
        maxMinute: new FormControl<Full_Model["maxMinute"]>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
        // Kötelező
        required: new FormControl<Full_Model["required"]>(false, { nonNullable: true, validators: [] }),

        // Szolgáltatás
        labService: new FormControl<Full_Model["labService"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            labServiceId: value.labService?.serviceId ?? value.labServiceId,
        }
    };

    @Input() allLabServices: NonNullable<ServicePackageXLabService["labService"]>[] = [];
    @Output() refreshAllLabServices = new EventEmitter<void>();

    protected allSelectedLabServices$ = new BehaviorSubject<NonNullable<ServicePackageXLabService["labService"]>[]>([]);
    @Input() set allSelectedLabServices(list: NonNullable<ServicePackageXLabService["labService"]>[] | null | undefined) {
        this.allSelectedLabServices$.next(list ?? []);
    };

    protected allUnselectableLabServices$ = combineLatest([
        this.allSelectedLabServices$,
        this.initialEditorData$,
    ]).pipe(
        map(([allSelectedLabServices, initialEditorData]) => {
            return allSelectedLabServices.filter(s => s.serviceId !== initialEditorData?.labService?.serviceId);
        }),
        shareReplay(1),
    )
}
