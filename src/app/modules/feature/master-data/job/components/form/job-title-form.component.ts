import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { JobTitle, Full_Model_OccupationalHealth } from "../../models/job-title.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { HSCO_Data_Model } from "../../models/hsco.model";
import { map, shareReplay } from "rxjs";
import { MasterDataManagementService } from "../../../../../../../api/services";
import { UnArray } from "../../../../../core/utility/types/un-array";


interface Extend_JobTitle_Full_Model extends JobTitle {
    _occupationalHealth: UnArray<Extend_JobTitle_Full_Model["occupationalHealth"]> | undefined;
}

@UntilDestroy()
@Component({
    selector: "app-job-title-form",
    templateUrl: "./job-title-form.component.html",
    styleUrls: ["./job-title-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobTitleFormComponent extends BaseFormComponent<Extend_JobTitle_Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "job.title.form.errors";

    @Input() hscoLevel: number[] = [ 4 ];
    @Input() isGeneralFeorForm: boolean = false;

    public form = new FormGroup({
        // Marker név
        jobTitleId: new FormControl<Extend_JobTitle_Full_Model["jobTitleId"]>(0, { nonNullable: true, validators: [] }),
        titleName: new FormControl<Extend_JobTitle_Full_Model["titleName"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        hscoId: new FormControl<Extend_JobTitle_Full_Model["hscoId"]>(undefined, { nonNullable: true, validators: [] }),
        hsco: new FormControl<Extend_JobTitle_Full_Model["hsco"]>(undefined, { nonNullable: true, validators: [] }),
        completed: new FormControl<Extend_JobTitle_Full_Model["completed"]>(false, { nonNullable: true, validators: [] }),
        jobTitleXService: new FormControl<Extend_JobTitle_Full_Model["jobTitleXService"]>(undefined, { nonNullable: true, validators: [] }),
        companySiteXJobTitle: new FormControl<Extend_JobTitle_Full_Model["companySiteXJobTitle"]>(undefined, { nonNullable: true, validators: [] }),
        occupationalHealth: new FormControl<Extend_JobTitle_Full_Model["occupationalHealth"]>(undefined, { nonNullable: true, validators: [] }),
        _occupationalHealth:  new FormGroup({
            // Azonosító
            jobTitle: new FormControl<Full_Model_OccupationalHealth["jobTitle"]>(undefined, { nonNullable: true, validators: [] }),
            occupationalHealthId: new FormControl<Full_Model_OccupationalHealth["occupationalHealthId"]>(0, { nonNullable: true, validators: [] }),
            dC_OccupationalHealthClassificationId: new FormControl<Full_Model_OccupationalHealth["dC_OccupationalHealthClassificationId"]>(undefined, { nonNullable: true, validators: [] }),
            dC_OccupationalHealthPriceCategoryId: new FormControl<Full_Model_OccupationalHealth["dC_OccupationalHealthPriceCategoryId"]>(undefined, { nonNullable: true, validators: [] }),
            dC_OccupationalHealthTypeId: new FormControl<Full_Model_OccupationalHealth["dC_OccupationalHealthTypeId"]>(undefined, { nonNullable: true, validators: [] }),
        }),
    });

    constructor() {
        super();
        if(!this.isGeneralFeorForm) {
            if(this.form.controls.titleName.hasValidator(Validators.required)) {
                this.form.controls.titleName.removeValidators(Validators.required)
                this.form.controls.titleName.updateValueAndValidity();
            }
        }
    }

    hscoAutocomplete = {
        searchFn$: (value: string) => {
            return this.masterDataManagementService.hSCOGetHSCOByConditionPost({
                hscoNumber: value,
                hscoName: value,
                hscoLevel: this.hscoLevel,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (x: HSCO_Data_Model) =>
            x ? x?.hscoNumber + " - " + x?.hscoName ?? "" : "",

        getFormattedInputText: (x: HSCO_Data_Model) =>
            x ? x?.hscoNumber + " - " + x?.hscoName ?? "" : "",
        getFormattedInputValue: (x: HSCO_Data_Model) => x?.hscoId,
    };

    jobTitleAutocomplete = {
        searchFn$: (value: string) => {
            return this.masterDataManagementService.jobTitleGetJobTitleByConditionPost({
                titleName: value,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (x: JobTitle) =>
            x.titleName ?? "",

        getFormattedInputText: (x: JobTitle) =>
            x.titleName ?? "",
        getFormattedInputValue: (x: JobTitle) => x?.jobTitleId,
    };

    public formValueToRequestValue(value: Extend_JobTitle_Full_Model): Extend_JobTitle_Full_Model {
        // Get the hscoId from the value and extract _occupationalHealth and occupationalHealth from the form
        const hscoId = value.hsco?.hscoId;
        const { _occupationalHealth, occupationalHealth } = this.form.getRawValue();

        // Update the occupational health object based on the input occupational health
        const updateOccupationalHealth = (ochealth: Full_Model_OccupationalHealth) =>
            ochealth.occupationalHealthId === _occupationalHealth.occupationalHealthId ? {
                ...ochealth,
                ..._occupationalHealth,
                hscoId: hscoId,
                hsco: undefined,
                jobTitleId: _occupationalHealth.jobTitle?.jobTitleId,
                jobTitle: undefined,
            } : ochealth;

        // Insert or __occupationalHealth update occupational health objects based on the input _occupational health array
        const insertOccupationalHealth = (occupationalHealth?.length ?? 0 > 0)
            ? occupationalHealth?.map(updateOccupationalHealth)
            : [{
                ..._occupationalHealth,
                jobTitleId: _occupationalHealth.jobTitle?.jobTitleId,
                jobTitle: undefined,
                hscoId: hscoId,
            }];

        // Map jobTitleXService array and set the service property to undefined for each element
        const _jobTitleXService = value?.jobTitleXService?.map(x => ({ ...x, service: undefined }));

        return {
            ...value,
            hscoId: hscoId,
            hsco: undefined,
            occupationalHealth: insertOccupationalHealth,
            _occupationalHealth: undefined,
            jobTitleXService: _jobTitleXService,
        };
    }

    @Input() public set editorData(data: Extend_JobTitle_Full_Model | undefined | null) {
        const _occupationalHealth = data?.occupationalHealth?.at(0);

        const _extendData: Extend_JobTitle_Full_Model = {
            ...data,
            _occupationalHealth: _occupationalHealth,
        };

        this.initialEditorData$.next(_extendData);
        this.setFormValue(_extendData);
        this.cdr.markForCheck();
    };
}
