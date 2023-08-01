import { CoreModelsDTOsMasterDataMainTablesServicePackageDTO, CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO, CoreModelsMedicalManagementAppointmentAppointmentWithDataCheckDTO } from "../../../../../../api/models";

export type AppointmentModel = CoreModelsMedicalManagementAppointmentAppointmentWithDataCheckDTO["appointment"]
    & Pick<CoreModelsMedicalManagementAppointmentAppointmentWithDataCheckDTO, "isMissingPatientData">;

export type PatientModel = AppointmentModel["patient"]
    & Pick<CoreModelsMedicalManagementAppointmentAppointmentWithDataCheckDTO, "isMissingPatientData">;

export type PatientManagementTableRowModel = {
    _rowId: string;
    _type: "PATIENT" | "PACKAGE" | "SUB_PACKAGE" | "SERVICE";
    _level: number;
    _children: PatientManagementTableRowModel[];
    _parent?: PatientManagementTableRowModel;
    _originalAppointmentList: AppointmentModel[];
    patient?: PatientModel;
    appointment?: AppointmentModel;
    package?: CoreModelsDTOsMasterDataMainTablesServicePackageDTO;
    subPackage?: CoreModelsDTOsMasterDataMainTablesServicePackageDTO;
    serviceExtension?: CoreModelsDTOsMedicalManagementMainTablesAppointmentServiceExtensionDTO;
};
