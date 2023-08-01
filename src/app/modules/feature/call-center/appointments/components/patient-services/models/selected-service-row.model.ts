import { CoreModelsMedicalManagementAppointmentAppointmentWithDataCheckDTO, CoreModelsDTOsMasterDataMainTablesServicePackageDTO } from "src/api/models";

export type AppointmentModel = CoreModelsMedicalManagementAppointmentAppointmentWithDataCheckDTO["appointment"]
    & Pick<CoreModelsMedicalManagementAppointmentAppointmentWithDataCheckDTO, "isMissingPatientData">;

export type PatientModel = AppointmentModel["patient"]
    & Pick<CoreModelsMedicalManagementAppointmentAppointmentWithDataCheckDTO, "isMissingPatientData">;

export type SelectedServiceRowModel = {
    _rowId: string;
    _type: "PACKAGE" | "SUB_PACKAGE" | "SERVICE";
    _level: number;
    _children: SelectedServiceRowModel[];
    _parent?: SelectedServiceRowModel;
    _originalAppointmentList: AppointmentModel[];
    patient?: PatientModel;
    appointment?: AppointmentModel;
    package?: CoreModelsDTOsMasterDataMainTablesServicePackageDTO;
    subPackage?: CoreModelsDTOsMasterDataMainTablesServicePackageDTO;
};