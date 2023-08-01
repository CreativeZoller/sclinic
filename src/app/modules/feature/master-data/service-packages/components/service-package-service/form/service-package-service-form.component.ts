import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { ServicePackageXService } from "../../../models/service-package-x-service.model";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { BehaviorSubject, combineLatest, map, shareReplay } from "rxjs";


type Full_Model = ServicePackageXService;

@UntilDestroy()
@Component({
    selector: "app-service-package-service-form",
    templateUrl: "./service-package-service-form.component.html",
    styleUrls: ["./service-package-service-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePackageServiceFormComponent extends BaseFormComponent<Full_Model> {

    @Input() public baseResourceKey = "service.package.service";
    public get errorResourceKeyPrefix() { return this.baseResourceKey + ".form.errors"; }

    public form = new FormGroup({
        // Sorszám
        position: new FormControl<Full_Model["position"]>(0, { nonNullable: true, validators: [Validators.min(0)] }),
        // Maximum idő
        maxMinute: new FormControl<Full_Model["maxMinute"]>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
        // Kötelező
        required: new FormControl<Full_Model["required"]>(false, { nonNullable: true, validators: [] }),

        // Szolgáltatás
        service: new FormControl<Full_Model["service"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            serviceId: value.service?.serviceId ?? value.serviceId,
        }
    };

    @Input() allServices: NonNullable<Full_Model["service"]>[] = [];
    @Output() refreshAllServices = new EventEmitter<void>();

    protected allSelectedServices$ = new BehaviorSubject<NonNullable<Full_Model["service"]>[]>([]);
    @Input() set allSelectedServices(list: NonNullable<Full_Model["service"]>[] | null | undefined) {
        this.allSelectedServices$.next(list ?? []);
    };

    protected allUnselectableServices$ = combineLatest([
        this.allSelectedServices$,
        this.initialEditorData$,
    ]).pipe(
        map(([allSelectedServices, initialEditorData]) => {
            return allSelectedServices.filter(s => s.serviceId !== initialEditorData?.service?.serviceId);
        }),
        shareReplay(1),
    )
}
