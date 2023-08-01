export interface LaguageConfig {
    code: string,
    name: string,
    ngLocaleId: string,
    ngLocaleImport: Promise<typeof import("@angular/common/locales/en")>,
    ngLocale?: typeof import("@angular/common/locales/en")["default"],
    matDateLocaleImport: Promise<typeof import("date-fns/locale/en-US")>,
    matDateLocale?: typeof import("date-fns/locale/en-US")["default"],
    flagUrl: string,
}
