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
import { CoreModelsDTOsFinanceManagementJunctionTablesSubContractNumberXDCAdditionalCostDTO } from './coreModelsDTOsFinanceManagementJunctionTablesSubContractNumberXDCAdditionalCostDTO';
import { CoreModelsDTOsFinanceManagementMainTablesAccountDTO } from './coreModelsDTOsFinanceManagementMainTablesAccountDTO';
import { CoreModelsDTOsFinanceManagementMainTablesContractHeaderDTO } from './coreModelsDTOsFinanceManagementMainTablesContractHeaderDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSentEventDataDTO } from './coreModelsDTOsFinanceManagementMainTablesSentEventDataDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberCompanyExtensionDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberCompanyExtensionDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberInsideContactDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberInsideContactDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberMemberDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberMemberDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberOutsideContactDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberOutsideContactDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberPriceDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberPriceDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberScriptDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberScriptDTO';
import { CoreModelsDTOsFinanceManagementMainTablesSubContractNumberServiceDTO } from './coreModelsDTOsFinanceManagementMainTablesSubContractNumberServiceDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallPartnerExtendedDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallPartnerExtendedDTO';
import { CoreModelsDTOsMasterDataSmallDTOsSmallSelfDTO } from './coreModelsDTOsMasterDataSmallDTOsSmallSelfDTO';

export interface CoreModelsDTOsFinanceManagementMainTablesSubContractNumberDTO { 
    subContractNumberId?: number;
    contractHeaderId?: number;
    contractHeader?: CoreModelsDTOsFinanceManagementMainTablesContractHeaderDTO;
    subNumber?: string;
    validFrom?: string;
    validUntil?: string;
    dC_SubContractNumberTypeId?: number;
    name?: string;
    dC_ContractStatusId?: number;
    dC_ContractTemplateTypeId?: number;
    dC_ContractTemplateNameId?: number;
    remarks?: string;
    preambulum?: string;
    selfId?: number;
    self?: CoreModelsDTOsMasterDataSmallDTOsSmallSelfDTO;
    customerPartnerId?: number;
    customerPartner?: CoreModelsDTOsMasterDataSmallDTOsSmallPartnerExtendedDTO;
    isIncludeRelativeOrAcquaintance?: boolean;
    priceTemplateId?: number;
    isCustomerEnableContract?: boolean;
    dC_TurnoverDayTypeId?: number;
    dC_MonthId?: number;
    dC_DayNumberId?: number;
    dC_InvoiceIssueTypeId?: number;
    invoiceIssueDay?: number;
    paymentDeadline?: number;
    dC_PaymentMethodId?: number;
    dC_ContractPaymentTypeId?: number;
    amount?: number;
    poNumber?: string;
    isEInvoice?: boolean;
    email?: string;
    isAskAnalitic?: boolean;
    dC_InvoiceCustomerTypeId?: number;
    invoicePartnerId?: number;
    invoicePartner?: CoreModelsDTOsMasterDataSmallDTOsSmallPartnerExtendedDTO;
    healthFundPartnerId?: number;
    healthFundPartner?: CoreModelsDTOsMasterDataSmallDTOsSmallPartnerExtendedDTO;
    healthFundCustomerId?: string;
    dC_PayerTypeId?: number;
    payerPartnerId?: number;
    payerPartner?: CoreModelsDTOsMasterDataSmallDTOsSmallPartnerExtendedDTO;
    dC_ContractPriceModeId?: number;
    summaPieceOrPrice?: number;
    contractPriceTemplateId?: number;
    isFixPrice?: boolean;
    isDiscount?: boolean;
    amountOfDiscount?: number;
    isMaxHeadCount?: boolean;
    maxHeadCount?: number;
    isEGate?: boolean;
    dC_ContractTypeId?: number;
    dC_ContractServiceTypeId?: number;
    selectedOfferdPriceId?: number;
    occupationalHealthId?: number;
    freeQuantity?: number;
    subContractNumberMember?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberMemberDTO>;
    subContractNumberInsideContact?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberInsideContactDTO>;
    subContractNumberOutsideContact?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberOutsideContactDTO>;
    subContractNumberService?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberServiceDTO>;
    subContractNumberPrice?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberPriceDTO>;
    subContractNumberGroup?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberGroupDTO>;
    subContractNumberCompanyExtension?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberCompanyExtensionDTO>;
    subContractNumberXDC_AdditionalCost?: Array<CoreModelsDTOsFinanceManagementJunctionTablesSubContractNumberXDCAdditionalCostDTO>;
    sentEventData?: Array<CoreModelsDTOsFinanceManagementMainTablesSentEventDataDTO>;
    subContractNumberScript?: Array<CoreModelsDTOsFinanceManagementMainTablesSubContractNumberScriptDTO>;
    account?: Array<CoreModelsDTOsFinanceManagementMainTablesAccountDTO>;
}