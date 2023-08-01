import { AfterViewInit, ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ServiceXSpecialty } from "../../../models/service-x-specialty.model";
import { Service_MedicalEmployee } from "../../../models/service-x-medical-emplyoee.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { BehaviorSubject, distinctUntilChanged, map, Observable, of, shareReplay, switchMap } from "rxjs";
import { ListHandlerCallbackData } from "../../../../../../app-common/list/components/list/list.component";
import { FormModel } from "../selection-list-form/service-specialty-doctor-selection-list-form.component";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { MedicalEmployeeTypeEnum } from "../../../../../../../../api/enums";


type Full_Model = Service_MedicalEmployee;

@UntilDestroy()
@Component({
    selector: "app-service-specialty-doctor-list-field",
    templateUrl: "./service-specialty-doctor-list-field.component.html",
    styleUrls: ["./service-specialty-doctor-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class ServiceSpecialtyDoctorListFieldComponent extends BaseListFieldComponent<Full_Model> implements AfterViewInit {

    private masterDataManagementService = inject(MasterDataManagementService);

    public baseResourceKey = "service.specialty.doctor";
    public tableIdProperty = "medicalEmployeeId";

    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            name: this.resourceService.resolve("service.specialty.doctor.list.table.headers.dC_TitleTypeId"),
            attributeName: "dC_TitleTypeId",
            formatterFn: (v) => this.initData.dC_TitleTypeList.find((item) => item.value === v)?.name,
        },
        {
            name: this.resourceService.resolve("service.specialty.doctor.list.table.headers.lastName"),
            attributeName: "lastName",
        },
        {
            name: this.resourceService.resolve("service.specialty.doctor.list.table.headers.firstName"),
            attributeName: "firstName",
        },
        {
            name: this.resourceService.resolve("service.specialty.doctor.list.table.headers.stampNumber"),
            attributeName: "stampNumber",
        },
    ];

    public valueToFormValue = (value: any[]) => value;

    public handleSave$: (data: ListHandlerCallbackData<unknown, FormModel>) => Observable<any> = ({formValue}) => {
        this.listFieldComponent.changeValue(formValue?.selectedSpecialtyDoctors ?? []);

        return of(null);
    }

    protected selectedSpecialties$ = new BehaviorSubject<ServiceXSpecialty[]>([]);
    @Input() set selectedSpecialties(list: ServiceXSpecialty[] | undefined | null) {
        this.selectedSpecialties$.next(list ?? []);
    }

    protected allSpecialtyDoctors$ = this.selectedSpecialties$.pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),// Deep-equals
        switchMap(selectedSpecialties => {
            if (selectedSpecialties.length === 0) return of([]);

            return this.masterDataManagementService.medicalEmployeeGetMedicalEmployeeByConditionPost({
                specialtyIdList: selectedSpecialties.map(s => s.specialtyId!),
                dC_MedicalEmployeeTypeId: MedicalEmployeeTypeEnum.DOCTOR,
            }).pipe(
                map((res) => res?.businessObjectList ?? []),
            );
        }),
        shareReplay(1),
    )

    public allSelectedSpecialtyDoctors$ = this.getValue$().pipe(
        shareReplay(1),
    );

    public ngAfterViewInit() {
        super.ngAfterViewInit();

        this.allSpecialtyDoctors$.pipe(
            untilDestroyed(this),
        ).subscribe((doctorList) => {
            const allowedDoctorIdList = doctorList
                .map(d => d.medicalEmployeeId!)
                .filter((v, i, arr) => arr.indexOf(v) === i);

            const currentDoctorIdList = this.listFieldComponent.value
                .map(v => v.medicalEmployeeId!)
                .filter((v, i, arr) => arr.indexOf(v) === i);

            const doctorIdListToRemove = currentDoctorIdList.filter(id => !allowedDoctorIdList.includes(id));

            if (doctorIdListToRemove.length > 0) {
                this.listFieldComponent.changeValue(
                    this.listFieldComponent.value.filter(v => !doctorIdListToRemove.includes(v.medicalEmployeeId!)),
                );
            }
        })
    }
}
