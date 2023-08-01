import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CoreModule } from "../core/core.module";
import { CheckboxFieldModule } from "./checkbox-field/checkbox-field.module";
import { ConfirmDialogModule } from "./confirm-dialog/confirm-dialog.module";
import { DatepickerModule } from "./datepicker-field/datepicker-field.module";
import { TimepickerModule } from "./timepicker-field/timepicker-field.module";
import { FieldErrorModule } from "./field-error/field-error.module";
import { FieldAutosizePlaceholderModule } from "./field-autosize-placeholder/field-autosize-placeholder.module";
import { FormErrorModule } from "./form-error/form-error.module";
import { SelectFieldModule } from "./select-field/select-field.module";
import { SpellcheckingModule } from "./spellchecking/spellchecking.module";
import { TextFieldModule } from "./text-field/text-field.module";
import { TextAreaFieldModule } from "./text-area-field/text-area-field.module";
import { AutocompleteFieldModule } from "./autocomplete-field/autocomplete-field.module";
import { NumberFieldModule } from "./number-field/number-field.module";
import { ShowablePasswordFieldModule } from "./showable-password-field/showable-password-field.module";
import { FileInputFieldModule } from "./file-input-field/file-input-field.module";
import { ImgInputFieldModule } from "./img-input-field/img-input-field.module";
import { CkeditorFieldModule } from "./ckeditor-field/ckeditor-field.module";
import { ListFieldModule } from "./list-field/list-field.module";
import { SelectionListFieldModule } from "./selection-list-field/selection-list-field.module";
import { SingleSelectionListFieldModule } from "./single-selection-list-field/single-selection-list-field.module";
import { SectionTitleModule } from "./section-title/section-title.module";
import { SectionSubtitleModule } from "./section-subtitle/section-subtitle.module";
import { ExpandablePanelModule } from "./expandable-panel/expandable-panel.module";
import { ListModule } from "./list/list.module";
import { FormModalModule } from "./form-modal/form-modal.module";
import { FilePreviewModule } from "./file-preview/file-preview.module";
import { InitPageDataProviderModule } from "./init-page-data-provider/init-page-data-provider.module";
import { UtilityModule } from "./utility/utility.module";
import { RadioFieldModule } from "./radio-field/radio-field.module";


// TODO impl common components services module
// TODO shared (modul) dolgokat ide kivezetni
@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        SpellcheckingModule,
        FieldErrorModule,
        FieldAutosizePlaceholderModule,
        FormErrorModule,
        ConfirmDialogModule,
        CheckboxFieldModule,
        RadioFieldModule,
        TextFieldModule,
        TextAreaFieldModule,
        AutocompleteFieldModule,
        NumberFieldModule,
        ShowablePasswordFieldModule,
        SelectFieldModule,
        FileInputFieldModule,
        ImgInputFieldModule,
        CkeditorFieldModule,
        ListFieldModule,
        SelectionListFieldModule,
        SingleSelectionListFieldModule,
        DatepickerModule,
        TimepickerModule,
        SectionTitleModule,
        SectionSubtitleModule,
        ExpandablePanelModule,
        ListModule,
        FormModalModule,
        FilePreviewModule,
        InitPageDataProviderModule,
        UtilityModule,
    ],
    exports: [
        CommonModule,
        CoreModule,
        SpellcheckingModule,
        FieldErrorModule,
        FieldAutosizePlaceholderModule,
        FormErrorModule,
        ConfirmDialogModule,
        CheckboxFieldModule,
        RadioFieldModule,
        TextFieldModule,
        TextAreaFieldModule,
        AutocompleteFieldModule,
        NumberFieldModule,
        ShowablePasswordFieldModule,
        SelectFieldModule,
        FileInputFieldModule,
        ImgInputFieldModule,
        CkeditorFieldModule,
        ListFieldModule,
        SelectionListFieldModule,
        SingleSelectionListFieldModule,
        DatepickerModule,
        TimepickerModule,
        SectionTitleModule,
        SectionSubtitleModule,
        ExpandablePanelModule,
        ListModule,
        FormModalModule,
        FilePreviewModule,
        InitPageDataProviderModule,
        UtilityModule,
    ],
})
export class AppCommonModule {

    public static forRoot(): ModuleWithProviders<AppCommonModule> {
        return {
            ngModule: AppCommonModule,
            providers: [
                ...SpellcheckingModule.forRoot().providers ?? [],
                ...FieldErrorModule.forRoot().providers ?? [],
                ...FieldAutosizePlaceholderModule.forRoot().providers ?? [],
                ...FormErrorModule.forRoot().providers ?? [],
                ...ConfirmDialogModule.forRoot().providers ?? [],
                ...CheckboxFieldModule.forRoot().providers ?? [],
                ...TextFieldModule.forRoot().providers ?? [],
                ...TextAreaFieldModule.forRoot().providers ?? [],
                ...AutocompleteFieldModule.forRoot().providers ?? [],
                ...NumberFieldModule.forRoot().providers ?? [],
                ...ShowablePasswordFieldModule.forRoot().providers ?? [],
                ...SelectFieldModule.forRoot().providers ?? [],
                ...FileInputFieldModule.forRoot().providers ?? [],
                ...ImgInputFieldModule.forRoot().providers ?? [],
                ...CkeditorFieldModule.forRoot().providers ?? [],
                ...ListFieldModule.forRoot().providers ?? [],
                ...SelectionListFieldModule.forRoot().providers ?? [],
                ...SingleSelectionListFieldModule.forRoot().providers ?? [],
                ...DatepickerModule.forRoot().providers ?? [],
                ...TimepickerModule.forRoot().providers ?? [],
                ...SectionTitleModule.forRoot().providers ?? [],
                ...SectionSubtitleModule.forRoot().providers ?? [],
                ...ExpandablePanelModule.forRoot().providers ?? [],
                ...ListModule.forRoot().providers ?? [],
                ...FormModalModule.forRoot().providers ?? [],
                ...FilePreviewModule.forRoot().providers ?? [],
                ...InitPageDataProviderModule.forRoot().providers ?? [],
                ...UtilityModule.forRoot().providers ?? [],
            ],
        };
    }
}
