import { Component, EventEmitter, Input, OnInit, ViewChild, inject } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { FullcalendarComponent } from 'src/app/components/fullcalendar/fullcalendar.component';
import { ResourceService } from 'src/app/modules/core/resource/services/resource.service';
import { PlannedSchedule } from '../../models/planned-schedule.model';
import { ModalConfig } from 'src/app/_metronic/partials';
import { SchedulePlannerCalendarEventModalComponent } from '../schedule-planner-calendar-event-modal/schedule-planner-calendar-event-modal.component';
import { MasterDataManagementService, ResourceManagementService } from 'src/api/services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MedicalEmployee } from 'src/app/modules/feature/master-data/medical-employee/models/medical-employee.model';
import { Clinic } from 'src/app/modules/feature/master-data/clinics/models/clinic.model';
import { UnArray } from 'src/app/modules/core/utility/types/un-array';
import { InitPageData } from 'src/app/modules/app-common/init-page-data-provider/models/init-page-data.model';
import { ActivatedRoute } from '@angular/router';
import { PublishedSchedule } from '../../models/published-schedule.model';


@UntilDestroy()
@Component({
    selector: 'app-schedule-planner-calendar',
    templateUrl: './schedule-planner-calendar.component.html',
    styleUrls: ['./schedule-planner-calendar.component.scss']
})
export class SchedulePlannerCalendarComponent implements OnInit {
    @ViewChild('fullcalendar') calendarComponent: FullcalendarComponent;
    @ViewChild('eventEditForm') eventEditForm: SchedulePlannerCalendarEventModalComponent;
    @Input() set plannedSchedule(plannedSchedules: PlannedSchedule[]) {
        this.plannedScheduleList$.next(plannedSchedules);
        this.lastCalledResourceFormatter();
        this.lastCalledDataFormatter();
    }

    @Input() set publishedSchedule(publishedSchedules: PublishedSchedule[]) {
        this.publishedScheduleList$.next(publishedSchedules);
        this.lastCalledResourceFormatter();
        this.lastCalledDataFormatter();
    }

    @Input() set filteredMedicalEmployeeIds(value: Array<Number>) {
        if (value?.length === 0) {
            this.filteredMedicalEmployeeList = this.medicalEmployeeList;
            return;
        }

        this.filteredMedicalEmployeeList = this.medicalEmployeeList.filter(x => value.includes(x.medicalEmployeeId ?? 0));
    }

    @Input() set filteredClinicIds(value: Array<Number>) {
        if (value?.length === 0) {
            this.filteredClinicList = this.clinicList;
            return;
        }

        this.filteredClinicList = this.clinicList.filter(x => value.includes(x.clinicId ?? 0));
    }

    // events

    private resourceService = inject(ResourceService);
    private resourceMenegmentService = inject(ResourceManagementService);
    private masterMenegmentService = inject(MasterDataManagementService);
    private toastrService = inject(ToastrService);
    private activatedRoute = inject(ActivatedRoute);
    private plannedScheduleList$ = new BehaviorSubject<PlannedSchedule[]>([]);
    private publishedScheduleList$ = new BehaviorSubject<PublishedSchedule[]>([]);
    private medicalEmployeeList: MedicalEmployee[] = [];
    private clinicList: Clinic[] = [];
    private resourceAreaColumnsToEmployee: CalendarOptions["resourceAreaColumns"] = [
        {
          field: 'employee',
          headerContent: this.resourceService.resolve('schedule.planner.resources.area.employee')
        }
    ];
    private resourceAreaColumnsToClinic: CalendarOptions["resourceAreaColumns"] = [
        {
            group: true,
            field: 'clinic',
            headerContent: this.resourceService.resolve('schedule.planner.resources.area.clinic')
        },
        {
            group: true,
            field: 'floor',
            headerContent: this.resourceService.resolve('schedule.planner.resources.area.floor')
        },
        {
            field: 'room',
            headerContent: this.resourceService.resolve('schedule.planner.resources.area.room')
        }
    ];

    private get plannedScheduleList(): PlannedSchedule[] {
        return this.plannedScheduleList$.value;
    }

    private get publishedScheduleList(): PublishedSchedule[] {
        return this.publishedScheduleList$.value;
    }

    public filteredMedicalEmployeeList: MedicalEmployee[] = [];
    public filteredClinicList: Clinic[] = [];
    public initData = this.activatedRoute.snapshot.data["init"] as InitPageData;

    public resources$: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

    public resourceAreaColumns$: BehaviorSubject<CalendarOptions["resourceAreaColumns"]> = new BehaviorSubject<CalendarOptions["resourceAreaColumns"]>(this.resourceAreaColumnsToClinic);

    // custom view options
    public views: CalendarOptions["views"] = {
        resourceTimelineDay: {
            type: 'resourceTimelineDay',
            buttonText: 'Napi',
            slotDuration: { minutes: 15 },
            slotLabelInterval: { minutes: 15 },
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            slotLabelFormat: [
                { hour: 'numeric'},
                { minute: '2-digit'}
            ],
            displayEventEnd: true
        },
        resourceTimelineWeek: {
            type: 'resourceTimelineWeek',
            buttonText: 'Heti',
            slotDuration: { day: 1 },
            slotLabelFormat: {
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                omitCommas: true
            },

        },
        resourceTimelineMonth: {
            type: 'resourceTimelineMonth',
            buttonText: 'Havi',
            slotDuration: { day: 1 },
            slotLabelFormat: {
                day: 'numeric',
                weekday: 'long',
                omitCommas: true
            }
        }
    };

    // calendar header options
    public headerToolbar: CalendarOptions["headerToolbar"] = {
        left: 'prev,next today resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
        center: 'title',
        right: 'setResourceToEmployee,setClinicView'
    };

    // custom buttons in calendar header
    public customButtons: CalendarOptions["customButtons"] = {
        setResourceToEmployee: {
            text: this.resourceService.resolve('schedule.planner.button.colleagues'),
            click: () => {
                this.resourceAreaColumns$.next(this.resourceAreaColumnsToEmployee);
                this.setResourceToEmployee();
                this.setDataToEmployeeView();
            }
        },
        setClinicView: {
            text: this.resourceService.resolve('schedule.planner.button.clinics'),
            click: () => {
                this.resourceAreaColumns$.next(this.resourceAreaColumnsToClinic);
                this.setResourceToClinicView();
                this.setDataToClinicView();
            }
        }
    }

    public events$: BehaviorSubject<CalendarOptions["events"]> = new BehaviorSubject<CalendarOptions["events"]>([]);

    public editableEvent: any = {};

    public modalConfig: ModalConfig = {
        disableSaveButton: false,
        disableDeleteButton: false,
        onSave: () => {
            this.modalConfig.disableSaveButton = true;
            this.eventEditForm.save().subscribe((response) => {
                if (response.errorMessage === null) {
                    this.refreshData(response.plannedScheduleList);
                    this.calendarComponent.editModal.close();
                    this.modalConfig.disableSaveButton = false;
                }
                if (response.errorMessage !== null) {
                    this.toastrService.error(response.errorMessage);
                }
            });
        },
        onDelete: () => {
            this.modalConfig.disableDeleteButton = true;
            this.eventEditForm.delete().subscribe((response) => {
                if (response.errorMessage === null) {
                    this.removeData(response)
                    this.calendarComponent.editModal.close();
                    this.modalConfig.disableDeleteButton = false;
                }
            });
        },
        extraButtonsConfigs: [
            {
                component: ButtonComponent,
                initComponentBindingFn: (instance: ButtonComponent) => {
                    instance.label = this.resourceService.resolve('schedule.planner.modal.button.copy');
                    instance.click.pipe(untilDestroyed(this)).subscribe(() => this.eventEditForm.openCopyModal());
                }
            }
        ]
    };

    private lastCalledDataFormatter: () => void = this.setDataToClinicView;
    private lastCalledResourceFormatter: () => void = this.setResourceToClinicView;

    private datePipe = inject(DatePipe);

    public selectDate = (arg: any) => {

        if (arg.end?.getHours() === 0) {
            arg.end.setHours(arg.end.getHours() - 1);
        }

        let employee: UnArray<PlannedSchedule["plannedScheduleXMedicalEmployee"]> = {};
        if (arg.resource.extendedProps.employeeId != 0) {
            const findedEmpoloyee = this.medicalEmployeeList.find((obj: MedicalEmployee) => obj.medicalEmployeeId === Number(arg.resource.extendedProps.employeeId)) ?? {};
            employee = {
                ...findedEmpoloyee,
                dC_MedicalEmployeeScheduleTypeId: findedEmpoloyee.dC_MedicalEmployeeTypeId ?? 0
            };
        }
        this.editableEvent = {
            plannedScheduleId: 0,
            startDate: this.datePipe.transform(arg.start, 'yyyy-MM-ddTHH:mm:ss') ?? '',
            endDate: this.datePipe.transform(arg.end, 'yyyy-MM-ddTHH:mm:ss') ?? '',
            clinicId: Number(arg.resource.extendedProps.clinicId ?? '0'),
            clinicRoomId: Number(arg.resource.extendedProps.clinicRoomId ?? '0'),
            plannedScheduleXMedicalEmployee: [employee],
            isClosedSchedule: false,
            isEmailDenied: false,
            isPending: false
        }
    }

    ngOnInit(): void {
        this.masterMenegmentService.medicalEmployeeGetMedicalEmployeeByConditionPost({}).pipe(untilDestroyed(this)).subscribe((response) => {
            this.medicalEmployeeList = response.businessObjectList ?? [];
            this.filteredMedicalEmployeeList = this.medicalEmployeeList;
        });

        this.masterMenegmentService.clinicGetClinicByConditionPost({needClinicRooms: true}).pipe(untilDestroyed(this)).subscribe((response) => {
            this.clinicList = response.businessObjectList ?? [];
            this.filteredClinicList = this.clinicList;
        });
    }

    // set resource data to calendar in clinic view
    setResourceToClinicView() {
        const resources: Array<any> = [{
            clinic: this.resourceService.resolve('schedule.planner.resources.area.no.clinic'),
            clinicId: 0,
            floor: '',
            floorId: 0,
            room: '',
            clinicRoomId: 0
        }];

        this.filteredClinicList.forEach(clinic => {
            clinic.clinicRooms?.forEach(room => {
                resources.push({
                    clinic: clinic.clinicName,
                    clinicId: clinic.clinicId,
                    floor: room.dC_Floor?.name ?? '',
                    floorId: room.dC_Floor?.dC_FloorId ?? '',
                    room: room.name,
                    clinicRoomId: room.clinicRoomId
                });
            });

            if (clinic.clinicRooms?.length === 0) {
                resources.push({
                    clinic: clinic.clinicName,
                    clinicId: clinic.clinicId,
                    floor: '',
                    floorId: 0,
                    room: '',
                    clinicRoomId: 0
                });
            }
        });

        this.resources$.next(resources);
        this.lastCalledResourceFormatter = this.setResourceToClinicView;
    }

    // set event data to calendar in clinic view
    setDataToClinicView() {
        const events = [];

        const resources = this.calendarComponent?.resources ?? [];

        events.push(
            ...this.plannedScheduleList.map(d => {
                const specialties = d.plannedScheduleXSpecialty?.map(s => s.specialtyData?.specialtyName ?? '').join(', ') ?? '';
                const resourceId = (resources as Array<any>).find(r =>
                    r.clinicId === (d.clinicId ?? 0) &&
                    r.clinicRoomId === (d.clinicRoomId ?? 0)
                )?.id ?? 0;
                const description = d.plannedScheduleXMedicalEmployee?.map(v => v.medicalEmployeeData?.fullName ?? '').join(', ') ?? '';

                return this.getEventDataModel(resourceId, specialties, description, d);
            })
        )

        events.push(
            ...this.publishedScheduleList.map(d => {
                const specialties = d.publishedScheduleXSpecialty?.map(s => s.specialtyData?.specialtyName ?? '').join(', ') ?? '';
                const resourceId = (resources as Array<any>).find(r =>
                    r.clinicId === (d.clinicId ?? 0) &&
                    r.clinicRoomId === (d.clinicRoomId ?? 0)
                )?.id ?? 0;
                const description = d.publishedScheduleXMedicalEmployee?.map(v => v.medicalEmployeeData?.fullName ?? '').join(', ') ?? '';

                return this.getEventDataModel(resourceId, specialties, description, d);
            })
        )

        this.events$.next(events);

        this.lastCalledDataFormatter = this.setDataToClinicView;
    }

    // set resource data to calendar in employee view
    setResourceToEmployee() {
        this.resources$.next([
            {
                employee: this.resourceService.resolve('schedule.planner.resources.area.no.employee'),
                employeeId: 0
            },
            ...this.filteredMedicalEmployeeList.map((d) => {
                return {
                    employee: d.fullName ?? '',
                    employeeId: d.medicalEmployeeId
                };
            })
        ]);

        this.lastCalledResourceFormatter = this.setResourceToEmployee;
    }

    // set event data to calendar in employee view
    setDataToEmployeeView() {
        const events = [];

        const resources = this.calendarComponent?.resources ?? [];

        events.push(
            ...this.plannedScheduleList.map(d => {
                const medicalEmployeeIds = d.plannedScheduleXMedicalEmployee?.map(v => v.medicalEmployeeId ?? 0);
                const resourceId = (resources as Array<any>).find(r => medicalEmployeeIds?.includes(r.employeeId))?.id ?? 0;
                const specialties = d.plannedScheduleXSpecialty?.map(s => s.specialtyData?.specialtyName ?? '').join(', ') ?? '';
                const description = d.clinicRoomData?.dC_Floor?.name ?? '';

                return this.getEventDataModel(resourceId, specialties, description, d)
            })
        )

        events.push(
            ...this.publishedScheduleList.map(d => {
                const medicalEmployeeIds = d.publishedScheduleXMedicalEmployee?.map(v => v.medicalEmployeeId ?? 0);
                const resourceId = (resources as Array<any>).find(r => medicalEmployeeIds?.includes(r.employeeId))?.id ?? 0;
                const specialties = d.publishedScheduleXSpecialty?.map(s => s.specialtyData?.specialtyName ?? '').join(', ') ?? '';
                const description = d.clinicRoomData?.dC_Floor?.name ?? '';

                return this.getEventDataModel(resourceId, specialties, description, d)
            })
        )
        this.events$.next(events);

        this.lastCalledDataFormatter = this.setDataToEmployeeView;
    }

    getEventDataModel(resourceId: number, title: string, description: string, obj: PlannedSchedule | PublishedSchedule): any {
            const isSpecialTime = obj.dC_ScheduleSpecialTypeId != null;

            let medicalEmployeeIds = [];
            let specialties = '';
            let backgroundColor = '';
            let specialTimeName = '';
            let id = 0;
            let start = '';
            let end = '';
            let type = '';
            let borderColor = '';

            if (this.isPlannedScheduleType(obj)) {
                const _obj = obj as PlannedSchedule;
                medicalEmployeeIds = _obj.plannedScheduleXMedicalEmployee?.map(v => v.medicalEmployeeId ?? 0) ?? [];
                specialties = _obj.plannedScheduleXSpecialty?.map(s => s.specialtyData?.specialtyName ?? '').join(', ') ?? '';
                backgroundColor = isSpecialTime ? '#eeeeee' : this.getSpecialtyColor(_obj.plannedScheduleXSpecialty?.[0]?.specialtyId ?? 0);
                specialTimeName = this.initData.dC_ScheduleSpecialTypeList.find(obj => obj.value === _obj.dC_ScheduleSpecialTypeId)?.name ?? '';
                id = _obj.plannedScheduleId ?? 0;
                start = _obj.startDate ?? '';
                end = _obj.endDate ?? '';
                type = 'PlannedSchedule';
                borderColor = '#eeeeee';
            }

            if (this.isPublishedScheduleType(obj)) {
                const _obj = obj as PublishedSchedule;
                medicalEmployeeIds = _obj.publishedScheduleXMedicalEmployee?.map(v => v.medicalEmployeeId ?? 0) ?? [];
                specialties = _obj.publishedScheduleXSpecialty?.map(s => s.specialtyData?.specialtyName ?? '').join(', ') ?? '';
                backgroundColor = isSpecialTime ? '#eeeeee' : this.getSpecialtyColor(_obj.publishedScheduleXSpecialty?.[0]?.specialtyId ?? 0);
                specialTimeName = this.initData.dC_ScheduleSpecialTypeList.find(obj => obj.value === _obj.dC_ScheduleSpecialTypeId)?.name ?? '';
                id = _obj.publishedScheduleId ?? 0;
                start = _obj.startDate ?? '';
                end = _obj.endDate ?? '';
                type = 'PublishedSchedule';
                borderColor = '#222222';
            }

            return {
                id: id,
                resourceId: resourceId,
                start: start,
                end: end,
                title: [(!!specialTimeName ? specialTimeName + ' /' : ''), title].join(' '),
                description: description,
                editable: true,
                resourceEditable: true,
                backgroundColor: backgroundColor,
                textColor: isSpecialTime ? '#000000' : '#ffffff',
                borderColor: borderColor,
                type: type,
            };
    }

    onEventClick(event: any) {

        if (event._def.extendedProps.type === 'PlannedSchedule') {
            this.editableEvent = this.plannedScheduleList.find(d => d.plannedScheduleId === Number(event._def.publicId)) ?? {};
            const medicalEmployeeIds: Array<number> = this.editableEvent.plannedScheduleXMedicalEmployee?.map((v: any) => v.medicalEmployeeId ?? 0);
            const specialTimes = this.plannedScheduleList.filter(obj => {
                const isSpecialTime = obj.dC_ScheduleSpecialTypeId !== null;
                const filteredSameMedicalEmployee = obj.plannedScheduleXMedicalEmployee?.filter((v: any) => medicalEmployeeIds.includes(v.medicalEmployeeId))
                return isSpecialTime && filteredSameMedicalEmployee?.length != 0;
            });
            this.editableEvent.specialTimeList = specialTimes;
        }

        if (event._def.extendedProps.type === 'PublishedSchedule') {
            this.editableEvent = this.publishedScheduleList.find(d => d.publishedScheduleId ===  Number(event._def.publicId)) ?? {};
            const medicalEmployeeIds: Array<number> = this.editableEvent.publishedScheduleXMedicalEmployee?.map((v: any) => v.medicalEmployeeId ?? 0);
            const specialTimes = this.publishedScheduleList.filter(obj => {
                const isSpecialTime = obj.dC_ScheduleSpecialTypeId !== null;
                const filteredSameMedicalEmployee = obj.publishedScheduleXMedicalEmployee?.filter((v: any) => medicalEmployeeIds.includes(v.medicalEmployeeId))
                return isSpecialTime && filteredSameMedicalEmployee?.length != 0;
            });
            this.editableEvent.specialTimeList = specialTimes;
        }
    }

    refreshData(data: Array<PlannedSchedule> | Array<PublishedSchedule>) {
        if (data.length == 0) {
            return;
        }

        if (this.isPlannedScheduleType(data[0])) {
            data.forEach((obj: PlannedSchedule) => {
                const index = this.plannedScheduleList.findIndex(d => d.plannedScheduleId === obj.plannedScheduleId);
                const list = this.plannedScheduleList;
                if (index != -1) {
                    list[index] = obj;
                } else {
                    list.push(obj);
                }
                this.plannedScheduleList$.next(list);
            });
        }

        if (this.isPublishedScheduleType(data[0])) {
            data.forEach((obj: PublishedSchedule) => {
                const index = this.publishedScheduleList.findIndex(d => d.publishedScheduleId === obj.publishedScheduleId);
                const list = this.publishedScheduleList;
                if (index != -1) {
                    list[index] = obj;
                } else {
                    list.push(obj);
                }
                this.publishedScheduleList$.next(list);
            });
        }
        this.lastCalledResourceFormatter();
        this.lastCalledDataFormatter();
    }

    removeData(obj: PlannedSchedule | PublishedSchedule) {
        if (this.isPlannedScheduleType(obj)) {
            const index = this.plannedSchedule.findIndex(d => d.plannedScheduleId === obj.plannedScheduleId);
            if (index != -1) {
                this.plannedSchedule.splice(index, 1);
            }
        }

        if (this.isPublishedScheduleType(obj)) {
            const index = this.publishedSchedule.findIndex(d => d.publishedScheduleId === (obj as PublishedSchedule).publishedScheduleId);
            if (index != -1) {
                this.publishedSchedule.splice(index, 1);
            }
        }

        this.lastCalledResourceFormatter();
        this.lastCalledDataFormatter();
    }

    onEventDrop(event: any) {
        if (event.event._def.extendedProps.type === 'PlannedSchedule') {
            const plannedSchedule = this.plannedScheduleList.find(d => d.plannedScheduleId == event.event._def.publicId);
            if (plannedSchedule) {
                if (event.newResource != null) {
                    if (event.newResource.extendedProps.hasOwnProperty('employeeId')) {
                        plannedSchedule.plannedScheduleXMedicalEmployee?.push({medicalEmployeeId: event.newResource.extendedProps.employeeId, dC_MedicalEmployeeScheduleTypeId: 1});
                    } else {
                        plannedSchedule.clinicRoomId = event.newResource.extendedProps.clinicRoomId;
                        plannedSchedule.clinicId = event.newResource.extendedProps.clinicId;
                    }
                }
                plannedSchedule.startDate = this.datePipe.transform(event.event.start, 'YYYY-MM-dd HH:mm:ss') ?? '';
                plannedSchedule.endDate = this.datePipe.transform(event.event.end, 'YYYY-MM-dd HH:mm:ss') ?? '';
                this.save(plannedSchedule);
            }
        }

        if (event.event._def.extendedProps.type === 'PublishedSchedule') {
            const publishedSchedule = this.publishedScheduleList.find(d => d.publishedScheduleId == event.event._def.publicId);
            if (publishedSchedule) {
                if (event.newResource != null) {
                    if (event.newResource.extendedProps.hasOwnProperty('employeeId')) {
                        publishedSchedule.publishedScheduleXMedicalEmployee?.push({medicalEmployeeId: event.newResource.extendedProps.employeeId, dC_MedicalEmployeeScheduleTypeId: 1});
                    } else {
                        publishedSchedule.clinicRoomId = event.newResource.extendedProps.clinicRoomId;
                        publishedSchedule.clinicId = event.newResource.extendedProps.clinicId;
                    }
                }
                publishedSchedule.startDate = this.datePipe.transform(event.event.start, 'YYYY-MM-dd HH:mm:ss') ?? '';
                publishedSchedule.endDate = this.datePipe.transform(event.event.end, 'YYYY-MM-dd HH:mm:ss') ?? '';
                this.save(publishedSchedule);
            }
        }
    }

    save(obj: PlannedSchedule | PublishedSchedule) {
        if (this.isPlannedScheduleType(obj)) {
            this.savePlannedSchedule(obj);
        }

        if (this.isPublishedScheduleType(obj)) {
            this.savePublishedSchedule(obj);
        }
    }

    savePlannedSchedule(plannedSchedule: PlannedSchedule) {
        this.resourceMenegmentService.plannedScheduleCreateOrUpdatePlannedSchedulePost({plannedScheduleList: [plannedSchedule]}).pipe(
            untilDestroyed(this),
            switchMap((response: any) => this.resourceMenegmentService.plannedScheduleGetPlannedScheduleByConditionPost({
                needBookingArea: true,
                needSpecialty: true,
                needSpecialtyData: true,
                needMedicalEmployee: true,
                needMedicalEmployeeData: true,
                needPartner: true,
                needPartnerData: true,
                needClinic: true,
                needRoom: true,
                plannedScheduleIdList: response.plannedScheduleList?.map((value: any) => value.plannedScheduleId ?? 0) ?? [],
            }).pipe(map(res => {
                return {
                    ...response,
                    plannedScheduleList: res.plannedScheduleList ?? [],
                }
            })))
        ).subscribe((response) => {
            if (response.errorMessage === null) {
                this.refreshData(response.plannedScheduleList ?? []);
                this.lastCalledDataFormatter();
                this.toastrService.success(this.resourceService.resolve('schedule.planner.modal.form.success'));
            }
        });
    }

    savePublishedSchedule(publishedSchedule: PublishedSchedule) {
        this.resourceMenegmentService.publishedScheduleCreateOrUpdatePublishedSchedulePost({publishedScheduleList: [publishedSchedule]}).pipe(
            untilDestroyed(this),
            switchMap((response: any) => this.resourceMenegmentService.publishedScheduleGetPublishedScheduleByConditionPost({
                needBookingArea: true,
                needSpecialty: true,
                needSpecialtyData: true,
                needMedicalEmployee: true,
                needMedicalEmployeeData: true,
                needPartner: true,
                needPartnerData: true,
                needClinic: true,
                needRoom: true,
                plannedScheduleIdList: response.plannedScheduleList?.map((value: any) => value.plannedScheduleId ?? 0) ?? [],
            }).pipe(map(res => {
                return {
                    ...response,
                    publishedScheduleList: res.publishedScheduleList ?? [],
                }
            })))
        ).subscribe((response) => {
            if (response.errorMessage === null) {
                this.refreshData(response.publishedScheduleList ?? []);
                this.lastCalledDataFormatter();
                this.toastrService.success(this.resourceService.resolve('schedule.planner.modal.form.success'));
            }
        });
    }

    deleteEvent(event: any) {
        if (event._def.extendedProps.type === 'PlannedSchedule') {
            const plannedSchedule = this.plannedScheduleList.find(d => d.plannedScheduleId == event.id);
            if (plannedSchedule) {
                this.delete(plannedSchedule);
            }
        }

        if (event._def.extendedProps.type === 'PublishedSchedule') {
            const publishedSchedule = this.publishedScheduleList.find(d => d.publishedScheduleId == event.id);
            if (publishedSchedule) {
                this.delete(publishedSchedule);
            }
        }
    }

    delete(obj: PlannedSchedule | PublishedSchedule) {
        if (this.isPlannedScheduleType(obj)) {
            this.deletePlannedSchedule(obj);
        }

        if (this.isPublishedScheduleType(obj)) {
            this.deletePublishedSchedule(obj);
        }
    }

    deletePlannedSchedule(plannedSchedule: PlannedSchedule) {
        this.resourceMenegmentService.plannedScheduleDeletePlannedScheduleDelete({
            plannedScheduleIdList: [plannedSchedule.plannedScheduleId ?? 0]
        }).pipe(untilDestroyed(this)).subscribe((response) => {
            if (response.isSuccessful) {
                this.removeData(plannedSchedule);
            }
        });
    }

    deletePublishedSchedule(publishedSchedule: PublishedSchedule) {
        this.resourceMenegmentService.publishedScheduleDeletePublishedScheduleDelete({
            publishedScheduleIdList: [publishedSchedule.publishedScheduleId ?? 0]
        }).pipe(untilDestroyed(this)).subscribe((response) => {
            if (response.isSuccessful) {
                this.removeData(publishedSchedule);
            }
        });
    }

    private getSpecialtyColor(specialtyId: number): string {
        switch (specialtyId) {
            case 1:
                return '#3699FF';
            case 2:
                return '#EE8586';
            case 3:
                return '#FFDF36';
            case 4:
                return '#85EEA9';
            case 5:
                return '#F269ED';
            case 6:
                return '#74F269';
            case 7:
                return '#aa5500';
            case 8:
                return '#aa00aa';
            case 9:
                return '#aa00aa';
            case 10:
                return '#aa00aa';
            default:
                return '#6977F2';
        }
    }

    private isPlannedScheduleType(obj: object): boolean {
        return !obj.hasOwnProperty('publishedScheduleId');
    }

    private isPublishedScheduleType(obj: object): boolean {
        return obj.hasOwnProperty('publishedScheduleId');
    }
}

@Component({
    standalone: true,
    template: `
        <button
            type="button"
            class="btn customBtn"
            [disabled]="disabled"
            (click)="click.emit()"
            >
            {{ label }}
        </button>
    `,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        class: "order-2"
    }
})
class ButtonComponent {
    label: string = "";
    click = new EventEmitter<void>();
    disabled = false;
}