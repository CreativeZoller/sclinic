/**
 * AuthenticationWebService
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CoreModelsDTOsMasterDataDCTablesDCTitleTypeDTO } from './coreModelsDTOsMasterDataDCTablesDCTitleTypeDTO';

export interface CoreModelsDTOsMasterDataSmallDTOsSmallPatientDTO { 
    executingUserId?: number;
    patientId?: number;
    dC_GenderId?: number;
    dC_TitleTypeId?: number;
    dC_TitleType?: CoreModelsDTOsMasterDataDCTablesDCTitleTypeDTO;
    surname?: string;
    firstname?: string;
    fullName?: string;
    ssn?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    deathTime?: string;
}