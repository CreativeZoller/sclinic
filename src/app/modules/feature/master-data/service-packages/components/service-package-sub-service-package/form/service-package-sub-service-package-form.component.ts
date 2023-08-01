import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, shareReplay } from "rxjs";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { ServicePackageTypeEnum } from "../../../../../../../../api/enums";
import { ServicePackageXSubServicePackage, SubServicePackage } from "../../../models/service-package-x-sub-service-package.model";


type Full_Model = ServicePackageXSubServicePackage;
type Full_Model_SubServicePackage = SubServicePackage;

@UntilDestroy()
@Component({
    selector: "app-service-package-sub-service-package-form",
    templateUrl: "./service-package-sub-service-package-form.component.html",
    styleUrls: ["./service-package-sub-service-package-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicePackageSubServicePackageFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);
    @Input() public baseResourceKey = "service.package.sub.service.package";
    public get errorResourceKeyPrefix() { return this.baseResourceKey + ".form.errors"; }

    public form = new FormGroup({
        // Sorszám
        position: new FormControl<Full_Model["position"]>(0, { nonNullable: true, validators: [Validators.min(0)] }),

        // Kötelező
        required: new FormControl<Full_Model["required"]>(false, { nonNullable: true, validators: [] }),

        // Szolgáltatás alcsomag
        subServicePackage: new FormControl<Full_Model["subServicePackage"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
    });

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            subServicePackageId: value.subServicePackage?.servicePackageId ?? value.subServicePackageId,
        }
    };

    @Input() allSubServicePackages: NonNullable<Full_Model["subServicePackage"]>[] = [];
    @Output() refreshAllSubServicePackages = new EventEmitter<void>();

    protected allSelectedSubServicePackages$ = new BehaviorSubject<NonNullable<Full_Model["subServicePackage"]>[]>([]);
    @Input() set allSelectedSubServicePackages(list: NonNullable<Full_Model["subServicePackage"]>[] | null | undefined) {
        this.allSelectedSubServicePackages$.next(list ?? []);
    };

    protected allUnselectableSubServicePackages$ = combineLatest([
        this.allSelectedSubServicePackages$,
        this.initialEditorData$,
    ]).pipe(
        map(([allSelectedSubServicePackages, initialEditorData]) => {
            return allSelectedSubServicePackages.filter(s => s.servicePackageId !== initialEditorData?.subServicePackage?.servicePackageId);
        }),
        shareReplay(1),
    )
}
