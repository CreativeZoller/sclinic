import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { JobTitleXService } from "../../../models/job-title-x-service.model";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { BehaviorSubject, combineLatest, map, of, shareReplay, switchMap, tap } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { CoreModelsDTOsMasterDataMainTablesServiceDTO } from "../../../../../../../../api/models";


type Full_Model = JobTitleXService;

@UntilDestroy()
@Component({
    selector: "app-job-title-service-form",
    templateUrl: "./job-title-service-form.component.html",
    styleUrls: ["./job-title-service-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobTitleServiceFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    @Input() public baseResourceKey = "job.title.service";
    public get errorResourceKeyPrefix() { return this.baseResourceKey + ".form.errors"; }

    public form = new FormGroup({
        // Szolgáltatás
        service: new FormControl<Full_Model["service"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

        // Gyakoriság
        dC_ExposureFrequencyId: new FormControl<Full_Model["dC_ExposureFrequencyId"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

        // Kötelező
        isMandatory: new FormControl<Full_Model["isMandatory"]>(false, { nonNullable: true, validators: [] }),

        // Ez lenne a 'hozott lelet'
        isPreviousResultAccepted: new FormControl<Full_Model["isPreviousResultAccepted"]>(false, { nonNullable: true, validators: [] }),

    });

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            serviceId: value.service?.serviceId ?? value.serviceId,
        }
    };

    @Input() allServices: NonNullable<JobTitleXService["service"]>[] = [];
    @Output() refreshAllServices = new EventEmitter<void>();

    protected allSelectedServices$ = new BehaviorSubject<NonNullable<JobTitleXService["service"]>[]>([]);
    @Input() set allSelectedServices(list: NonNullable<JobTitleXService["service"]>[] | null | undefined) {
        this.allSelectedServices$.next(list ?? []);
    };

    serviceAutocomplete = {
        searchFn$: (value: string) => {
            return this.masterDataManagementService.serviceGetServiceByConditionPost({
                serviceName: value,
            }).pipe(
                switchMap((res) => {
                    // Combine the search results with the list of selected services
                    return combineLatest([
                        of(res?.businessObjectList ?? []),
                        this.allSelectedServices$,
                    ]);
                }),
                map(([searchResults, selectedServices]) => {
                    // Filter out the search results that are already in the selected services list
                    return searchResults.filter(
                        (result) => !selectedServices.some(
                            (selectedService) => selectedService.serviceId === result.serviceId
                        )
                    );
                }),
                shareReplay(1),
            );
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesServiceDTO) => v?.serviceName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesServiceDTO) => v?.serviceName ?? "",
        getFormattedInputValue: (v: CoreModelsDTOsMasterDataMainTablesServiceDTO) => v?.serviceId,
    };

}
