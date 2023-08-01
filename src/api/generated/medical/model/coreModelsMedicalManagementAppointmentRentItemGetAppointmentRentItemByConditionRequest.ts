/**
 * MedicalManagementController
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface CoreModelsMedicalManagementAppointmentRentItemGetAppointmentRentItemByConditionRequest { 
    executingUserId?: number;
    page?: number;
    pageSize?: number;
    appointmentRentItemIdList?: Array<number>;
    appointmenIdList?: Array<number>;
    itemIdList?: Array<number>;
    patientIdList?: Array<number>;
    clinicIdList?: Array<number>;
    clinicInventoryItemIdList?: Array<number>;
    exceptedReturnDate?: string;
    realReturnDate?: string;
    takeAwayDate?: string;
    reservationDate?: string;
    needAppointmentServiceExtension?: boolean;
    needClinicInventoryItem?: boolean;
    needItem?: boolean;
}