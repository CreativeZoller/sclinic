import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { map, Observable, shareReplay, pairwise } from "rxjs";
import {
    CoreModelsDTOsMasterDataMainTablesCompanyDTO,
    CoreModelsDTOsMasterDataMainTablesCompanySiteDTO,
    CoreModelsDTOsMasterDataMainTablesHSCODTO,
    CoreModelsDTOsMasterDataMainTablesJobTitleDTO,
} from "../../../../../../../../api/models";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { SelectOptionWithDto } from "../../../../../../app-common/utility/models/select-option-with-dto.model";
import { isBetweenDateRange } from "../../../../../../core/utility/validators/date.validator";
import { PatientXEmployment } from "../../../models/patient-x-employment.model";


type Full_Model = PatientXEmployment;

@UntilDestroy()
@Component({
    selector: "app-patient-employment-form",
    templateUrl: "./patient-employment-form.component.html",
    styleUrls: ["./patient-employment-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientEmploymentFormComponent extends BaseFormComponent<Full_Model> {

    private masterDataManagementService = inject(MasterDataManagementService);

    public errorResourceKeyPrefix = "patient.employment.form.errors";

    dc_DefaultStatus = (this.initData.dC_StatusList.find(x => x.dto.isDefault)?.value || undefined);

    public form = new FormGroup({
        // Munkáltató
        company: new FormControl<Full_Model["company"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Telephely
        companySite: new FormControl<Full_Model["companySite"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // // Üzem
        // TODO: new FormControl<Full_Model["TODO"]>(undefined, { nonNullable: true, validators: [] }),
        // FEOR kód
        hsco: new FormControl<Full_Model["hsco"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Munkakör
        jobTitle: new FormControl<Full_Model["jobTitle"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Exp.mátrix szerinti munkakör
        jobTitleExpozition: new FormControl<Full_Model["jobTitleExpozition"]>(undefined, { nonNullable: true, validators: [Validators.required] }),
        // Kezdete
        startDate: new FormControl<Full_Model["startDate"]>(undefined, { nonNullable: true, validators: [Validators.required, isBetweenDateRange(undefined, 'endDate')] }),
        // Vége
        endDate: new FormControl<Full_Model["endDate"]>(undefined, { nonNullable: true, validators: [Validators.required, isBetweenDateRange('startDate', undefined)] }),
        // Törzsszám
        number: new FormControl<Full_Model["number"]>(undefined, { nonNullable: true, validators: [] }),
        // Státusz
        dC_StatusId: new FormControl<Full_Model["dC_StatusId"]>(this.dc_DefaultStatus, { nonNullable: true, validators: [] }),
        // FEÜ kategória
        dC_OccupationalHealthClassificationId: new FormControl<Full_Model["dC_OccupationalHealthClassificationId"]>(undefined, { nonNullable: true, validators: [] }),
    });

    constructor() {
        super();

        this.form.valueChanges.pipe(
            untilDestroyed(this),
            pairwise()
        ).subscribe(([prev, curr]) => {
            if(prev.company !== curr.company) {
                if (!this.skipResetingFields) this.form.controls.companySite.reset();
            }
        });
    }

    companyAutocomplete = {
        searhcFn$: (value: string) => {
            return this.masterDataManagementService.partnerGetPartnerByConditionPost({
                needPartnerData: true,
                needPartnerXAddressDTO: true,
                companyName: value || "",
                needBisnode: false,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                map((partnerList) => partnerList.map((partner) => partner.company!).filter(c => c != null)),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesCompanyDTO) => v?.fullName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesCompanyDTO) => v?.fullName ?? "",
    };

    companySiteOptions$: Observable<SelectOptionWithDto<
        CoreModelsDTOsMasterDataMainTablesCompanySiteDTO,
        CoreModelsDTOsMasterDataMainTablesCompanySiteDTO
    >[]> = this.form.controls.company.valueChanges.pipe(
        map((company) => company?.companySite ?? []),
        map((list) => list.map((item) => {
            return {
                dto: item,
                value: item,
                name: item.siteName!,
                idProperty: "companySiteId" as const,
            }
        })),
        shareReplay(1),
    )

    hscoAutocomplete = {
        searhcFn$: (value: string) => {
            return this.masterDataManagementService.hSCOGetHSCOByConditionPost({
                hscoNumber: value,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesHSCODTO) => v?.hscoNumber ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesHSCODTO) => v?.hscoNumber ?? "",
    };

    jobTitleAutocomplete = {
        searhcFn$: (value: string) => {
            return this.masterDataManagementService.jobTitleGetJobTitleByConditionPost({
                titleName: value,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            )
        },

        getFormattedSelectText: (v: CoreModelsDTOsMasterDataMainTablesJobTitleDTO) => v?.titleName ?? "",

        getFormattedInputText: (v: CoreModelsDTOsMasterDataMainTablesJobTitleDTO) => v?.titleName ?? "",
    };

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            company: undefined,
            companyId: value?.company?.companyId,
            companySite: undefined,
            companySiteId: value?.companySite?.companySiteId,
            hsco: undefined,
            hscoId: value?.hsco?.hscoId,
            jobTitle: undefined,
            jobTitleId: value?.jobTitle?.jobTitleId,
            jobTitleExpozition: undefined,
            jobTitleExpozitionId: value?.jobTitleExpozition?.jobTitleId,
        };
    }
}
