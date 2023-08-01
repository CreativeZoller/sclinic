import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { MasterDataManagementService, ResourceManagementService } from 'src/api/services';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { BaseFormComponent } from 'src/app/modules/app-common/utility/base-form-component/base-form-component.directive';
import { ResourceService } from 'src/app/modules/core/resource/services/resource.service';
import { SelectOption } from 'src/app/modules/core/utility/types/select-option';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';
import { PlannedScheduleCreateOrUpdateRequestBody } from '../../models/planned-schedule-create-or-update-request-body.model';
import { PlannedSchedule } from '../../models/planned-schedule.model';
import { SchedulePlannerCalendarEventCopyModalComponent } from '../schedule-planner-calendar-event-copy-modal/schedule-planner-calendar-event-copy-modal.component';
import { MedicalalEmployeeScheduleTypeEnum } from '../../enums/MedicalEmployeeScheduleType.enum';
import { PublishedSchedule } from '../../models/published-schedule.model';


type Form_Model = UnArray<PlannedScheduleCreateOrUpdateRequestBody["plannedScheduleList"]>;

@Component({
    selector: 'app-schedule-planner-calendar-event-modal',
    templateUrl: './schedule-planner-calendar-event-modal.component.html',
    styleUrls: ['./schedule-planner-calendar-event-modal.component.scss']
})
export class SchedulePlannerCalendarEventModalComponent extends BaseFormComponent<any> implements OnInit {
    @ViewChild('clinicModal') clinicModalComponent: ModalComponent

    @ViewChild('copyModal') copyModal: ModalComponent;
    @ViewChild('copyForm') copyFormComponent: SchedulePlannerCalendarEventCopyModalComponent;

    @Input() set model(model: any) {
        if (this.isPlannedScheduleType(model)) {
            this.setFormValue({
                ...model,
                assistantList: model.plannedScheduleXMedicalEmployee?.filter((x: any) => x.dC_MedicalEmployeeScheduleTypeId === MedicalalEmployeeScheduleTypeEnum.ASSISTANT),
                substituteList: model.plannedScheduleXMedicalEmployee?.filter((x: any) => x.dC_MedicalEmployeeScheduleTypeId === MedicalalEmployeeScheduleTypeEnum.SUBSTITUDE_DOCTOR),
                doctorList: model.plannedScheduleXMedicalEmployee?.filter((x: any) => x.dC_MedicalEmployeeScheduleTypeId === MedicalalEmployeeScheduleTypeEnum.DOCTOR)
            });
            if (!!this.copyFormComponent) {
                this.copyFormComponent.plannedSchedule = model;
            }
        }

        if (this.isPublishedScheduleType(model)) {
            this.setFormValue({
                ...model,
                assistantList: model.publishedScheduleXMedicalEmployee?.filter((x: any) => x.dC_MedicalEmployeeScheduleTypeId === MedicalalEmployeeScheduleTypeEnum.ASSISTANT),
                substituteList: model.publishedScheduleXMedicalEmployee?.filter((x: any) => x.dC_MedicalEmployeeScheduleTypeId === MedicalalEmployeeScheduleTypeEnum.SUBSTITUDE_DOCTOR),
                doctorList: model.publishedScheduleXMedicalEmployee?.filter((x: any) => x.dC_MedicalEmployeeScheduleTypeId === MedicalalEmployeeScheduleTypeEnum.DOCTOR)
            });
            if (!!this.copyFormComponent) {
                this.copyFormComponent.plannedSchedule = model;
            }
        }

        this.changeClinicValue();
        this._model = model;
    }

    @Output() changeData = new EventEmitter<Array<PlannedSchedule>>();

    private resourceMenegmentService = inject(ResourceManagementService);
    private masterDataService = inject(MasterDataManagementService);
    private clinicList: Array<Clinic> = [];
    private toastrService = inject(ToastrService);
    private resourceService = inject(ResourceService);
    private _model: any = {};

    public loading = true;
    public errorResourceKeyPrefix: string;
    public form = new FormGroup({
        plannedScheduleId: new FormControl<Form_Model["plannedScheduleId"]>(undefined, {nonNullable: true, validators: []}),
        publishedScheduleId: new FormControl<Form_Model["plannedScheduleId"]>(undefined, {nonNullable: true, validators: []}),
        startDate: new FormControl<Form_Model["startDate"]>(undefined, {nonNullable: true, validators: []}),
        endDate: new FormControl<Form_Model["endDate"]>(undefined, {nonNullable: true, validators: []}),
        isPending: new FormControl<Form_Model["isPending"]>(undefined, {nonNullable: true, validators: []}),
        clinicId: new FormControl<Form_Model["clinicId"]>(undefined, {nonNullable: true, validators: []}),
        clinicFloorId: new FormControl<Number>(0, {nonNullable: true, validators: []}),
        clinicRoomId: new FormControl<Form_Model["clinicRoomId"]>(undefined, {nonNullable: true, validators: []}),
        plannedScheduleXMedicalEmployee: new FormControl<Form_Model["plannedScheduleXMedicalEmployee"]>([], {nonNullable: true, validators: []}),
        plannedScheduleXSpecialty: new FormControl<Form_Model["plannedScheduleXSpecialty"]>([], {nonNullable: true, validators: [Validators.minLength(1)]}),
        plannedScheduleXPartner: new FormControl<Form_Model["plannedScheduleXPartner"]>([], {nonNullable: true, validators: []}),
        plannedScheduleXDC_BookingArea: new FormControl<Form_Model["plannedScheduleXDC_BookingArea"]>([], {nonNullable: true, validators: []}),
        publishedScheduleXMedicalEmployee: new FormControl<Form_Model["plannedScheduleXMedicalEmployee"]>([], {nonNullable: true, validators: []}),
        publishedScheduleXSpecialty: new FormControl<Form_Model["plannedScheduleXSpecialty"]>([], {nonNullable: true, validators: [Validators.minLength(1)]}),
        publishedScheduleXPartner: new FormControl<Form_Model["plannedScheduleXPartner"]>([], {nonNullable: true, validators: []}),
        publishedScheduleXDC_BookingArea: new FormControl<Form_Model["plannedScheduleXDC_BookingArea"]>([], {nonNullable: true, validators: []}),
        isEmailDenied: new FormControl<Form_Model["isEmailDenied"]>(undefined, {nonNullable: true, validators: []}),
        isClosedSchedule: new FormControl<Form_Model["isClosedSchedule"]>(undefined, {nonNullable: true, validators: []}),
        remarks: new FormControl<Form_Model["remarks"]>(undefined, {nonNullable: true, validators: []}),
        editedBy: new FormControl<string>({value: 'Kiss Enikő', disabled: true}, {nonNullable: true, validators: []}),
        editedAt: new FormControl<string>({value: '2022.05.06. 17:14:40', disabled: true}, {nonNullable: true, validators: []}),

        assistantList: new FormControl<Form_Model["plannedScheduleXMedicalEmployee"]>([], {nonNullable: true, validators: []}),
        substituteList: new FormControl<Form_Model["plannedScheduleXMedicalEmployee"]>([], {nonNullable: true, validators: []}),
        doctorList: new FormControl<Form_Model["plannedScheduleXMedicalEmployee"]>([], {nonNullable: true, validators: []}),
        specialTimeList: new FormControl<Array<PlannedSchedule> | Array<PublishedSchedule>>([], {nonNullable: true, validators: []}),
    });

    public clinicOptions$ = this.masterDataService.clinicGetClinicByConditionPost({
        needClinicRooms: true,
    }).pipe(
        untilDestroyed(this),
        map(res => {
            this.clinicList = res.businessObjectList ?? [];
            return res.businessObjectList?.map(clinic => {
                return {
                    value: clinic.clinicId!,
                    name: clinic.clinicName ?? '',
                }
            }) ?? []
        })
    );
    public clinicFloorOptions$ = new BehaviorSubject<Array<SelectOption>>([]);
    public clinicRoomOptions$ = new BehaviorSubject<Array<SelectOption>>([]);
    public modalConfig: ModalConfig = {
        classSmall: true,
        modalTitle: this.resourceService.resolve('schedule.planner.modal.copy.title'),
        hideDeleteButton: true,
        disableSaveButton: false,
        onSave: () => {
            this.modalConfig.disableSaveButton = true;
            this.copyFormComponent.save().pipe(untilDestroyed(this)).subscribe(res => {
                if (res != null && res.errorMessage === null) {
                    this.changeData.emit(res.plannedScheduleList);
                    this.copyModal.close();
                    this.modalConfig.disableSaveButton = false;
                }
            });
        }
    };

    ngOnInit(): void {
        this.form.get('clinicId')?.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.changeClinicValue());
        this.form.get('clinicFloorId')?.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.changeClinicFloorValue());
    }

    changeClinicValue() {
        this.clinicFloorOptions$.next(
            this.clinicList.find(clinic => clinic.clinicId === this.form.value.clinicId)?.clinicRooms?.map(clinicRoom => {
                return {
                    value: clinicRoom.dC_Floor?.dC_FloorId!,
                    name: clinicRoom.dC_Floor?.name ?? '',
                };
            }
        ) ?? []);

        this.clinicRoomOptions$.next(
            this.clinicList.find(clinic => clinic.clinicId === this.form.value.clinicId)?.clinicRooms?.map(clinicRoom => {
                return {
                    value: clinicRoom.clinicRoomId!,
                    name: clinicRoom.name ?? '',
                };
            }
        ) ?? []);
    }

    changeClinicFloorValue() {
        this.clinicRoomOptions$.next(
            this.clinicList.find(clinic => clinic.clinicId === this.form.value.clinicId)?.clinicRooms
                ?.filter(room => room.dC_FloorId === this.form.value.clinicFloorId)
                .map(clinicRoom => {
                    return {
                    value: clinicRoom.clinicRoomId!,
                    name: clinicRoom.name ?? '',
                    };
            }) ?? []
        );
    }

    save(): Observable<any> {
        if (!!this.form.value.publishedScheduleId) {
            return this.savePublishedSchedule();
        }

        return this.savePlannedSchedule();
    }


    savePlannedSchedule(): Observable<any> {
        this.form.markAllAsTouched();
        if (this.form.invalid || this.form.value.plannedScheduleXSpecialty?.length === 0) {
            return of({errorMessage: this.resourceService.resolve('schedule.planner.modal.form.error.empty.specialty')});
        }
        return this.resourceMenegmentService.plannedScheduleCreateOrUpdatePlannedSchedulePost({
            plannedScheduleList: [{
                ...this.getFormValue(),
                plannedScheduleXMedicalEmployee: [
                    ...this.form.value.doctorList as Array<any>,
                    ...this.form.value.assistantList as Array<any>,
                    ...this.form.value.substituteList as Array<any>,
                ]
            },
            ...this.getFormValue().specialTimeList?.map(value => {
                return {
                    ...this.getFormValue(),
                    plannedScheduleId: value.plannedScheduleId === this.getFormValue().plannedScheduleId ? 0 : value.plannedScheduleId,
                    startDate: this.getFormValue().startDate?.split('T')[0] + 'T' + value.startDate?.split('T')[1],
                    endDate: this.getFormValue().endDate?.split('T')[0] + 'T' + value.endDate?.split('T')[1],
                    dC_ScheduleSpecialTypeId: value.dC_ScheduleSpecialTypeId,
                    plannedScheduleXMedicalEmployee: [
                        ...this.form.value.doctorList as Array<any>,
                        ...this.form.value.assistantList as Array<any>,
                        ...this.form.value.substituteList as Array<any>,
                    ]
                }
            }) ?? []
        ],
        }).pipe(untilDestroyed(this), map(response => {
            if (response.errorMessage === null) {
                this.toastrService.success(this.resourceService.resolve('schedule.planner.modal.form.success'));
            }
            return response;
        }), switchMap((response) => this.resourceMenegmentService.plannedScheduleGetPlannedScheduleByConditionPost({
            needBookingArea: true,
            needSpecialty: true,
            needSpecialtyData: true,
            needMedicalEmployee: true,
            needMedicalEmployeeData: true,
            needPartner: true,
            needPartnerData: true,
            needClinic: true,
            needRoom: true,
            plannedScheduleIdList: response.plannedScheduleList?.map(value => value.plannedScheduleId ?? 0) ?? [],
        }).pipe(map(res => {
            return {
                ...response,
                plannedScheduleList: res.plannedScheduleList ?? [],
            }
        }))));
    }

    savePublishedSchedule(): Observable<any> {
        this.form.markAllAsTouched();
        if (this.form.invalid || this.form.value.publishedScheduleXSpecialty?.length === 0) {
            return of({errorMessage: this.resourceService.resolve('schedule.planner.modal.form.error.empty.specialty')});
        }
        return this.resourceMenegmentService.publishedScheduleCreateOrUpdatePublishedSchedulePost({
            publishedScheduleList: [{
                ...this.getFormValue(),
                publishedScheduleXMedicalEmployee: [
                    ...this.form.value.doctorList as Array<any>,
                    ...this.form.value.assistantList as Array<any>,
                    ...this.form.value.substituteList as Array<any>,
                ]
            },
            ...this.getFormValue().specialTimeList?.map(value => {
                return {
                    ...this.getFormValue(),
                    publishedScheduleId: (value as PublishedSchedule).publishedScheduleId === this.getFormValue().publishedScheduleId ? 0 : (value as PublishedSchedule).publishedScheduleId,
                    startDate: this.getFormValue().startDate?.split('T')[0] + 'T' + value.startDate?.split('T')[1],
                    endDate: this.getFormValue().endDate?.split('T')[0] + 'T' + value.endDate?.split('T')[1],
                    dC_ScheduleSpecialTypeId: value.dC_ScheduleSpecialTypeId,
                    publishedScheduleXMedicalEmployee: [
                        ...this.form.value.doctorList as Array<any>,
                        ...this.form.value.assistantList as Array<any>,
                        ...this.form.value.substituteList as Array<any>,
                    ]
                }
            }) ?? []
        ],
        }).pipe(untilDestroyed(this), map(response => {
            if (response.errorMessage === null) {
                this.toastrService.success(this.resourceService.resolve('schedule.planner.modal.form.success'));
            }
            return response;
        }), switchMap((response) => this.resourceMenegmentService.publishedScheduleGetPublishedScheduleByConditionPost({
            needBookingArea: true,
            needSpecialty: true,
            needSpecialtyData: true,
            needMedicalEmployee: true,
            needMedicalEmployeeData: true,
            needPartner: true,
            needPartnerData: true,
            needClinic: true,
            needRoom: true,
            publishedScheduleIdList: response.publishedScheduleList?.map(value => value.publishedScheduleId ?? 0) ?? [],
        }).pipe(map(res => {
            return {
                ...response,
                publishedScheduleList: res.publishedScheduleList ?? [],
            }
        }))));
    }

    delete(): Observable<any> {
        if (!!this.form.value.publishedScheduleId) {
            return this.resourceMenegmentService.publishedScheduleDeletePublishedScheduleDelete({
                publishedScheduleIdList: [this.form.value.publishedScheduleId ?? 0],
            }).pipe(untilDestroyed(this), map(response => {
                if (response.errorMessage === null) {
                    this.toastrService.success(this.resourceService.resolve('schedule.planner.modal.form.success.delete'));
                }
                return response;
            }));
        }

        return this.resourceMenegmentService.plannedScheduleDeletePlannedScheduleDelete({
            plannedScheduleIdList: [this.form.value.plannedScheduleId ?? 0],
        }).pipe(untilDestroyed(this), map(response => {
            if (response.errorMessage === null) {
                this.toastrService.success(this.resourceService.resolve('schedule.planner.modal.form.success.delete'));
            }
            return response;
        }));
    }

    openCopyModal() {
        this.copyModal.open();
    }

    openClinicFormModal() {
        this.clinicModalComponent.open();
    }

    public getFormValue(raw?: boolean | undefined) {
        const formValue = this.form.value;

        const startDate = this._model.startDate?.split('T')[0] ?? '';
        const endDate = this._model.endDate?.split('T')[0] ?? '';

        const formStartDate = formValue.startDate?.split('T')[1] ?? '';
        const formEndDate = formValue.endDate?.split('T')[1] ?? '';

        formValue.endDate = `${endDate}T${formEndDate}`;
        formValue.startDate = `${startDate}T${formStartDate}`;

        return formValue;
    }

    private isPlannedScheduleType(obj: object): boolean {
        return obj.hasOwnProperty('plannedScheduleId');
    }

    private isPublishedScheduleType(obj: object): boolean {
        return obj.hasOwnProperty('publishedScheduleId');
    }
}
