import { Component, ChangeDetectionStrategy, Input, inject } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BaseFormComponent } from "src/app/modules/app-common/utility/base-form-component/base-form-component.directive";
import { TimePickerList } from "../models/timepicker-list.model";
import { FormControl, FormGroup } from "@angular/forms";
import { AppointmentCart } from "../../appointments-cart/models/appointments-cart-data.model";
import { ServiceDateTime } from "../models/service-for-datetime.model";
import { BehaviorSubject } from "rxjs";
import { MedicalManagementService } from "src/api/services";
import { AppointmentAssignmentStatus } from "src/api/enums/appointment-assignments.enum";

@UntilDestroy()
@Component({
    selector: "app-cc-appointments-cart-times",
    templateUrl: "./timepicker-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CcAppointmentTimepickerComponent extends BaseFormComponent<TimePickerList> {
    private medicalManagementService = inject(MedicalManagementService);
    public errorResourceKeyPrefix: string;
    public servicesData = <any>[];
    public form = new FormGroup({
        fullName: new FormControl('', { nonNullable: true, validators: [] }),
        birthday: new FormControl('', { nonNullable: true, validators: [] }),
        ssn: new FormControl('', { nonNullable: true, validators: [] }),
    });
    public patientId: number;
    public subServiceDetails = <any>[];
    public serviceForAppointment: ServiceDateTime;
    public toIsoString(date: any) {
        var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num: number) {
            return (num < 10 ? '0' : '') + num;
        };

        return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60);
    }
    public checkValidity(date: Date, time: string, morning: boolean = true) {
        const timePrefix = ':00';
        const timeMin = '08';
        const timeMax = '22';
        let timeValue;
        if (date == null) {
            return;
        } else {
            if (time === null && morning === true) {
                timeValue = timeMin + timePrefix;
            } else if (time === null && morning === false) {
                timeValue = timeMax + timePrefix;
            } else {
                timeValue = time + timePrefix;
            }
            const stringValue = [date, timeValue].join(' ');
            const dateValue = new Date(stringValue);
            const returnValue = this.toIsoString(dateValue);
            return returnValue;
        }
    }

    public trimServiceArray(services: Array<any>, maxLength: number) {
        const servicesLength: number = services.length;
        const elementsToDelete: number = servicesLength - maxLength;
        if (maxLength != 0 && (servicesLength > maxLength)) {
            return this.subServiceDetails.filter((index: number) => index + elementsToDelete < this.subServiceDetails.length)
        } else {
            return this.subServiceDetails;
        }
    }

    public getPackageServiceDetails(service: any) {
        // const subServiceDetail = {
        //     serviceId: service.serviceId,
        //     servicePackageId: service.servicePackageId,
        //    // specialtyId: service.service.specialtyId,
        //     medicalEmployeeId: service.service.medicalEmployeeXService,
        //     duration: service.service.duration
        // };
        // return subServiceDetail;
    }

    public getSubPackageServiceDetails(service: any) {
        // const subPackageServiceDetail = {
        //     serviceId: service.serviceId,
        //     servicePackageId: service.servicePackageId,
        //    // specialtyId: service.service.specialtyId,
        //     medicalEmployeeId: service.service.medicalEmployeeXService,
        //     duration: service.service.duration
        // };
        // return subPackageServiceDetail;
    }

    public getServiceDetails(service: any) {
        const serviceDetail = {
            serviceId: service.service.serviceId,
            servicePackageId: null,
            specialtyId: service.specialty.specialtyId,
            medicalEmployeeId: service.doctors,
            duration: service.service.duration
        };
        return serviceDetail;
    }

    @Input() set data (value: AppointmentCart) {
        if (value) {
            this.form.get('fullName')?.disable();
            this.form.get('birthday')?.disable();
            this.form.get('ssn')?.disable();
            this.form.reset();
            this.form.patchValue({
                fullName: value.fullName,
                birthday: value.birthday,
                ssn: value.ssn
            });
            this.patientId = value.patientId;
            // legelso szuresi talaltbol szedi a csomagok es alszolgaltatasok kivetelevel a szuresi felteteleket
            // be nem kepes jelenleg tobb tetel megfelelo merelesere ezekre az attributumokra
            if(value?.patientServices && value?.patientServices.length > 0) {
                const selectedService = value.patientServices[0];
                if (selectedService.service['servicePackageXService']
                    && selectedService.service['servicePackageXService'].length > 0) {
                    // test with 'alcsomag'
                    const maxServices: number = (selectedService.service.maxServiceCount !== null) ? selectedService.service.maxServiceCount : 0;
                    const subServices = selectedService.service['servicePackageXService'];
                    subServices.forEach((subService: any) => {
                        console.dir(subService);
                        // this.subServiceDetails.push(this.getPackageServiceDetails(subService));
                    });
                    this.subServiceDetails = this.trimServiceArray(this.subServiceDetails, maxServices);
                }
                else if (selectedService.service['servicePackageXSubServicePackage'] 
                    && selectedService.service['servicePackageXSubServicePackage'].length > 0) {
                    // test with 'csomag 1'
                    const maxServices: number = (selectedService.service.maxServiceCount !== null) ? selectedService.service.maxServiceCount : 0;
                    const mainService = selectedService.service['servicePackageXSubServicePackage'];
                    mainService.forEach((servicePackages: any) => {
                        const subServices = servicePackages.subServicePackage['servicePackageXService'];
                        subServices.forEach((subService: any) => {
                            console.dir(subService);
                            // this.subServiceDetails.push(this.getSubPackageServiceDetails(subService));
                        })
                    });
                    this.subServiceDetails = this.trimServiceArray(this.subServiceDetails, maxServices);
                }
                else if (selectedService.service && Object.keys(selectedService.service).length > 0) {
                    // test with 'neuro'
                    this.subServiceDetails.push(this.getServiceDetails(selectedService));
                }
                let startDate = (selectedService.startDate) ? this.checkValidity(selectedService.startDate, selectedService.startTime) : 0;
                let endDate = (selectedService.endDate) ? this.checkValidity(selectedService.endDate, selectedService.endTime, false) : 0;
                let data = {
                    clinicId: (selectedService.clinicId) ? selectedService.clinicId : 0,
                    startDate: startDate,
                    endDate: endDate,
                    startTime: startDate,
                    endTime: endDate,
                    patientAge: (selectedService.patientAge) ? selectedService.patientAge : null,
                    patientId: (this.patientId) ? this.patientId : 0,
                    dC_LanguageId: (selectedService.dC_LanguageId) ? selectedService.dC_LanguageId : null,
                    dC_BookingAreaId: 1,
                    isMonday: selectedService.days[1] ?? false,
                    isTuesday: selectedService.days[2] ?? false,
                    isWednesday: selectedService.days[3] ?? false,
                    isThursday: selectedService.days[4] ?? false,
                    isFriday: selectedService.days[5] ?? false,
                    isSaturday: selectedService.days[6] ?? false,
                    isSunday: selectedService.days[7] ?? false,
                    serviceDetails: [{
                        serviceId: (selectedService?.service) ? selectedService?.service['serviceId'] : 0,
                        servicePackageId: (selectedService?.service) ? selectedService?.service['servicePackageId'] : 0,
                        specialtyId: (selectedService?.specialty) ? selectedService?.specialty['specialtyId'] : 0,
                        medicalEmployeeId: selectedService.doctors ?? 0,
                        duration: (selectedService?.service) ? selectedService?.service['duration'] : 0
                    }],
                    variationCount: 4
                };
                this.servicesData = data;
                console.log(this.servicesData);

                this.medicalManagementService.appointmentFindAvailableAppointmentsPost(this.servicesData)
                .subscribe(res => {
                    console.dir(res);
                    // amig ures, addig nem megytovabb, nem tud tablaba menni
                        if (res.errorMessage == null || res.errorMessage == AppointmentAssignmentStatus.NO_RESULT) {
                            return;
                        } else {
                            // transfer data to observable like with filtered services
                        }
                    })
            }
        }
    };
}