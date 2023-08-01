import { Component, HostBinding, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { ResolveResourcePipe } from "../../../../core/resource/pipes/resolve-resource.pipe";


@Component({
    selector: "app-form-error",
    templateUrl: "form-error.component.html",
    styleUrls: ["form-error.component.scss"],
})
export class FormErrorComponent {
    @Input() control: AbstractControl;
    @Input() resourceKeyPrefix?: string = "";
    readonly defaultResourceKeyPrefix = "general.form.errors";
    @Input() addControlNameToResourceKeyPrefix?: boolean = true;
    readonly defaultAddControlNameToResourceKeyPrefix = true;

    @Input() showErrorsMethod?: "all" | "first" | "last";
    readonly defaultShowErrorsMethod: "all" | "first" | "last" = "first";

    @HostBinding("class.is-invalid") protected withIsInvalidClass = true;

    /**
     * Use to override the globally loaded resources package for this instance
     */
    @Input() resourceOverrides?: Required<Parameters<ResolveResourcePipe["transform"]>>[1]["resourceOverrides"];
    /**
     * Use to specify how to override the globally loaded resources package for this instance
     */
    @Input() resourceOverridesMethod?: Required<Parameters<ResolveResourcePipe["transform"]>>[1]["resourceOverridesMethod"];
}
