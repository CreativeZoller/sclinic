import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Observable, Subscription, map, of, shareReplay, take } from "rxjs";
import { CoreModelsDTOsMasterDataMainTablesSelfDTO, CoreModelsDTOsMasterDataMainTablesSpecialtyDTO } from "../../../../../../../../api/models";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { BaseFormComponent } from "../../../../../../app-common/utility/base-form-component/base-form-component.directive";
import { Full_Model_ClinicSelf } from "../../../models/clinic-x-self.mode";


type Full_Model = Full_Model_ClinicSelf;

@UntilDestroy()
@Component({
    selector: "app-clinic-self-form",
    templateUrl: "./clinic-self-form.component.html",
    styleUrls: ["./clinic-self-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicSelfFormComponent extends BaseFormComponent<Full_Model> implements OnInit {

    private masterDataManagementService = inject(MasterDataManagementService);
    public errorResourceKeyPrefix = "clinic.self.form.errors";

    @Input() public allClinicSelf$: Observable<NonNullable<Full_Model>[]> = of([]);
    private allClinicSelfSubscription: Subscription;
    public allClinicSelf: NonNullable<Full_Model>[] = [];

    selfAutocomplete = {
        searhcFn: (value: string) => {
            return this.masterDataManagementService.selfGetSelfByConditionPost({
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            );
        },
        formatSelfForAutocompleteResult(v: CoreModelsDTOsMasterDataMainTablesSelfDTO) {
            return v?.selfName ?? "";
        },
        getSelfName(v: CoreModelsDTOsMasterDataMainTablesSelfDTO): string {
            return v?.selfName ?? "";
        },
        getSelectedSelfId(v?: CoreModelsDTOsMasterDataMainTablesSelfDTO): number {
            return v?.selfId!;
        }
    }

    specialtyAutocomplete = {
        searhcFn: (value: string) => {
            return this.masterDataManagementService.specialtyGetSpecialtyByConditionPost({
                specialtyName: value,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
                shareReplay(1),
            );
        },
        formatSpecialtyForAutocompleteResult(v: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO) {
            return v?.specialtyName ?? "";
        },
        getSpecialtyName(v: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO): string {
            return v?.specialtyName ?? "";
        },
        getSelectedSpecialtyId(v?: CoreModelsDTOsMasterDataMainTablesSpecialtyDTO): number {
            return v?.specialtyId!;
        }
    }

    public form = new FormGroup({
        clinicXSelfId: new FormControl<Full_Model["clinicXSelfId"]>(undefined, { nonNullable: true, validators: [] }),
        selfId: new FormControl<Full_Model["selfId"]>(undefined, { nonNullable: true, validators: [] }),
        self: new FormControl<Full_Model["self"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

        specialtyId: new FormControl<Full_Model["specialtyId"]>(undefined, { nonNullable: true, validators: [] }),
        specialty: new FormControl<Full_Model["specialty"]>(undefined, { nonNullable: true, validators: [Validators.required] }),

        clinicOrganizationUniteCode: new FormControl<Full_Model["clinicOrganizationUniteCode"]>(undefined, { nonNullable: true, validators: [Validators.required, Validators.maxLength(9)] }),
    }, [
        (control) => {
            const fg = control as typeof this.form;

            const found = this.allClinicSelf.some(
                y => y.selfId === fg.value?.self?.selfId && y.specialtyId === fg.value?.specialty?.specialtyId && fg.value.clinicXSelfId !== y.clinicXSelfId
            );
            if (found) {
                return { 'selfSpecialtyCombinationAlreadyExists': true };
            }
            return null;
        }
    ]);

    public formValueToRequestValue(value: Full_Model): Full_Model {
        return {
            ...value,
            selfId: value?.self?.selfId,
            specialtyId: value?.specialty?.specialtyId,
        };
    }

    ngOnInit(): void {
        this.allClinicSelfSubscription = this.allClinicSelf$.subscribe(value => {
          this.allClinicSelf = value;
        });
    }
}
