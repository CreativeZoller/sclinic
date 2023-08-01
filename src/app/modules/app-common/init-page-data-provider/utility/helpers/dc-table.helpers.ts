import { DcTableBasePropertyName, DcTableIdPropertyName, DcTableInitPagePropertyName, DcTableName } from "../../models/dc-table.model";

// DC_TitleTypeDTO -> dC_TitleType
// NEHI_EventTypeDTO -> nehI_EventType
export function getDcTableBasePropertyForm(dcTableName: DcTableName): DcTableBasePropertyName {
    let basePropertyForm: string = dcTableName;

    // Remove DTO postfix if present (DC_TitleTypeDTO -> DC_TitleType)
    // Remove DTO postfix if present (NEHI_EventTypeDTO -> NEHI_EventType)
    if (basePropertyForm.toLowerCase().endsWith("dto")) basePropertyForm = basePropertyForm.slice(0, -3);

    // Lowercase first part (DC_TitleType -> dC_TitleType)
    // Lowercase first part (NEHI_EventType -> nehI_EventType)
    return basePropertyForm.split("_")
        .map((v, i) => i > 0 ? v : `${v.toLowerCase().slice(0, -1)}${v.toUpperCase().slice(-1)}`)
        .join("_") as DcTableBasePropertyName;
}

// DC_TitleTypeDTO -> dC_TitleTypeId
// NEHI_EventTypeDTO -> nehI_EventTypeId
export function getDcTableIdPropertyName(dcTableName: DcTableName): DcTableIdPropertyName {
    // Append "Id" (dC_TitleType -> dC_TitleTypeId)
    // Append "Id" (nehI_EventType -> nehI_EventTypeId)
    return `${getDcTableBasePropertyForm(dcTableName)}Id`;
}

// DC_TitleTypeDTO -> dC_TitleTypeList
// NEHI_EventTypeDTO -> nehI_EventTypeList
export function getDcTableInitPagePropertyName(dcTableName: DcTableName): DcTableInitPagePropertyName {
    // Append "List" (dC_TitleType -> dC_TitleTypeList)
    // Append "List" (nehI_EventType -> nehI_EventTypeList)
    return `${getDcTableBasePropertyForm(dcTableName)}List`;
}
