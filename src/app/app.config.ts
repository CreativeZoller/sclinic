import { LaguageConfig } from "./modules/core/language/models/language-config.model";

// Routes configuration
export const DASHBOARD_ROUTE: string = "";
export const LOGIN_ROUTE: string = "login";
export const ROLE_SELECT_ROUTE: string = "role-select";

// TODO implementálni ezt az oldalt
export const SERVER_ERROR_ROUTE: string = "server-error";
// TODO implementálni ezt az oldalt
export const INSUFFICIENT_PERMISSIONS_ROUTE: string = "insufficient-permissions";
// TODO implementálni ezt az oldalt
export const PAGE_NOT_FOUND_ROUTE: string = "page-not-found";

// Master-data routes
export const MASTER_DATA_BASE_ROUTE: string = "master-data";
export const SERVICES_ROUTE: string = "services";
export const SERVICE_SUB_PACKAGES_ROUTE: string = "service-sub-packages";
export const SERVICE_PACKAGES_ROUTE: string = "service-packages";
export const PRICE_TABLES_ROUTE: string = "price-tables";
export const ITEMS_ROUTE: string = "items";
export const PATIENTS_ROUTE: string = "patients";
export const PARTNERS_ROUTE: string = "partners";
export const DICTIONARY_ENTRIES_ROUTE: string = "dictionary-entries";
export const DOCUMENT_TEMPLATES_ROUTE: string = "document-templates";
export const EMAIL_TEMPLATES_ROUTE: string = "email-templates";
export const SERVICE_PROVIDER_ENTITIES_ROUTE: string = "service-provider-entities";
export const LABS_ROUTE: string = "labs";
export const CITIES_ROUTE: string = "cities";
export const CLINICS_ROUTE: string = "clinics";
export const DOCTORS_ROUTE: string = "doctors";
export const ASSISTANTS_ROUTE: string = "assistants";
export const EXPOSURES_ROUTE: string = "exposures";
export const FEOR_GROUP_ROUTE: string = "feor-group";
export const JOB_TITLE_ROUTE: string = "job-title";
// TODO partner specifikus expozíciós mátrix... : export const TODO_ROUTE: string = "TODO";

// Schedule
export const SCHEDULE_BASE_ROUTE: string = 'schedule';
export const SCHEDULE_TEMPLATE: string = 'schedule-template';
export const SCHEDULE_PLANNER: string = 'schedule-planner';
export const SCHEDULE_GENERATOR: string = 'schedule-generator';
export const SCHEDULE_PUBLISHING: string = 'schedule-publishing';

//System routes
export const SYSTEM_BASE_ROUTE: string = "system";
export const USERS_ROUTE: string = "users";
export const ROLES_ROUTE: string = "roles";
export const AUTHORITIES_ROUTE: string = "authorities";
export const FUNCTIONS_ROUTE: string = "functions";
export const CONFIGURATIONS_ROUTE: string = "configurations";
export const DIVISION_NUMBERS_ROUTE: string = "division-numbers";

// CallCenter routes data
export const CC_BASE_ROUTE: string = "call-center";
export const CC_APPOINTMENTS_ROUTE: string = "appointments"

// Reception routes
export const MEDICAL_MANAGEMENT_BASE_ROUTE: string = "medical-management";
export const RECEPTION_ROUTE: string = "reception";

// Other routes data
export const ROUTE_NEW_PASSWORD_TOKEN_QUERY_PARAM_KEY: string = "newPasswordToken";
export const ROUTE_RETURN_URL_QUERY_PARAM_KEY: string = "returnUrl";
export const ROUTE_PERMISSIONS_DATA_KEY: string = "permissions";

// Core config
export const AUTH_STATE_STORAGE_KEY: string = "AUTH_STATE_STORAGE_KEY";
export const AUTH_TOKEN_HTTP_HEADER: string = "JWTTOKEN";
export const USER_LOGIN_DATA_STATE_STORAGE_KEY: string = "USER_LOGIN_DATA_STATE_STORAGE_KEY";
export const ROLE_STATE_STORAGE_KEY: string = "ROLE_STATE_STORAGE_KEY";

// API type conversions
export const API_TYPE_JS_TYPE_MAPPINGS: Record<string, string> = {
    "string": "string",
    "char": "string",
    "int": "number",
    "int16": "number",
    "int32": "number",
    "int64": "number",
    "single": "number",
    "double": "number",
    "decimal": "number",
    "boolean": "boolean",
    "datetime": "Date",
    "date": "Date",
}

// Locale/Language configs
export const LANGUAGE_STORAGE_KEY: string = "LANGUAGE_KEY_STORAGE_KEY";
export const DEFAULT_LANGUAGE: string = "hu";
export const LANGUAGE_CONFIGS: LaguageConfig[] = [
    {
        code: "hu",
        name: "Magyar",
        ngLocaleId: "hu",
        ngLocaleImport: import('@angular/common/locales/hu'),
        matDateLocaleImport: import('date-fns/locale/hu'),
        flagUrl: './assets/media/flags/hungary.svg',
    },
    {
        code: "en",
        name: "English",
        ngLocaleId: "en-US",
        ngLocaleImport: import('@angular/common/locales/en'),
        matDateLocaleImport: import('date-fns/locale/en-US'),
        flagUrl: './assets/media/flags/united-states.svg',
    },
    {
        code: "de",
        name: "Deutsch",
        ngLocaleId: "de",
        ngLocaleImport: import('@angular/common/locales/de'),
        matDateLocaleImport: import('date-fns/locale/de'),
        flagUrl: './assets/media/flags/germany.svg',
    },
    {
        code: "sk",
        name: "Slovenský",
        ngLocaleId: "sk",
        ngLocaleImport: import('@angular/common/locales/sk'),
        matDateLocaleImport: import('date-fns/locale/sk'),
        flagUrl: './assets/media/flags/slovakia.svg',
    },
];

// Base variables
export const Minimum_Allowed_Int32_Number: number = -2147483647;
export const Maximum_Allowed_Int32_Number: number = 2147483647;
