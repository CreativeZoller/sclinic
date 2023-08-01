import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe, DecimalPipe, I18nPluralPipe, I18nSelectPipe, JsonPipe, KeyValuePipe, LowerCasePipe, PercentPipe, SlicePipe, TitleCasePipe, UpperCasePipe } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { MaskPipe } from "ngx-mask";
import { ApplyFormatterFnImpurePipe, ApplyFormatterFnPurePipe } from "./pipes/apply-formatter-fn.pipe";
import { FlattenObjectPipe } from "./pipes/flatten-object.pipe";
import { GetAbstractControlNamePipe } from "./pipes/get-abstract-control-name.pipe";
import { GetAbstractControlPathPipe } from "./pipes/get-abstract-control-path.pipe";
import { GetAllAbstractFormControlErrorsPipe } from "./pipes/get-all-abstract-form-control-errors.pipe";
import { GetPathPropertyPipe } from "./pipes/get-path-property.pipe";
import { IsEmptyPipe } from "./pipes/is-empty.pipe";
import { RemoveNullPropertiesPipe } from "./pipes/remove-null-properties.pipe";
import { StableKeyValuePipe } from "./pipes/stable-key-value.pipe";
import { StringJoinPipe } from "./pipes/string-join.pipe";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { FilterListPipe } from "./pipes/filter-list-fn.pipe";
import { ApplyFnImpurePipe, ApplyFnPurePipe } from "./pipes/apply-fn.pipe";
import { FormatTimePipe } from "./pipes/format-time.pipe";
import { MinPipe } from "./pipes/min.pipe";
import { DateFilterPipe } from "./pipes/date-filter.pipe";


@NgModule({
    declarations: [
        GetPathPropertyPipe,
        RemoveNullPropertiesPipe,
        FlattenObjectPipe,
        GetAbstractControlNamePipe,
        GetAbstractControlPathPipe,
        GetAllAbstractFormControlErrorsPipe,
        StringJoinPipe,
        ApplyFormatterFnPurePipe,
        ApplyFormatterFnImpurePipe,
        ApplyFnPurePipe,
        ApplyFnImpurePipe,
        StableKeyValuePipe,
        IsEmptyPipe,
        SafeHtmlPipe,
        FilterListPipe,
        FormatTimePipe,
        MinPipe,
        DateFilterPipe,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        GetPathPropertyPipe,
        RemoveNullPropertiesPipe,
        FlattenObjectPipe,
        GetAbstractControlNamePipe,
        GetAbstractControlPathPipe,
        GetAllAbstractFormControlErrorsPipe,
        StringJoinPipe,
        ApplyFormatterFnPurePipe,
        ApplyFormatterFnImpurePipe,
        ApplyFnPurePipe,
        ApplyFnImpurePipe,
        StableKeyValuePipe,
        IsEmptyPipe,
        SafeHtmlPipe,
        FilterListPipe,
        FormatTimePipe,
        MinPipe,
        DateFilterPipe,
    ]
})
export class UtilityModule {

    public static forRoot(): ModuleWithProviders<UtilityModule> {
        return {
            ngModule: UtilityModule,
            providers: [
            // Angular pipes for DI
                AsyncPipe,
                CurrencyPipe,
                DatePipe,
                DecimalPipe,
                PercentPipe,
                JsonPipe,
                KeyValuePipe,
                SlicePipe,
                LowerCasePipe,
                TitleCasePipe,
                UpperCasePipe,
            // Custom pipes for DI
                GetPathPropertyPipe,
                RemoveNullPropertiesPipe,
                FlattenObjectPipe,
                GetAbstractControlNamePipe,
                GetAbstractControlPathPipe,
                GetAllAbstractFormControlErrorsPipe,
                StringJoinPipe,
                ApplyFormatterFnPurePipe,
                ApplyFormatterFnImpurePipe,
                ApplyFnPurePipe,
                ApplyFnImpurePipe,
                StableKeyValuePipe,
                IsEmptyPipe,
                SafeHtmlPipe,
                FilterListPipe,
                FormatTimePipe,
            // NgxMaskPipe
                MaskPipe,
                MinPipe,
                DateFilterPipe,
            ],
        };
    };
}
