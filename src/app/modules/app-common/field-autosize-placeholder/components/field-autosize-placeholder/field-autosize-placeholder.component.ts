import { Component, Input } from "@angular/core";
import { BehaviorSubject, combineLatest, map, shareReplay } from "rxjs";


export type FieldAutoSizeConfig = {
    autoSize?: boolean;
    minCharLen?: number;
    offsetCount?: number;
    keepOriginalCharacters?: boolean;
    fillChar?: string;
}

export const defaultFieldAutoSizeConfig: Required<FieldAutoSizeConfig> = {
    autoSize: false,
    minCharLen: 0,
    offsetCount: 0,
    keepOriginalCharacters: true,
    fillChar: "0",
};

@Component({
    selector: "app-field-autosize-placeholder",
    templateUrl: "field-autosize-placeholder.component.html",
    styleUrls: ["field-autosize-placeholder.component.scss"],
})
export class FieldAutosizePlaceholderComponent {
    private value$ = new BehaviorSubject<string | number | undefined>(undefined);
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("value") set value(value: string | number | undefined) {
        this.value$.next(value);
    }

    private autoSizeConfig$ = new BehaviorSubject<Required<FieldAutoSizeConfig>>(defaultFieldAutoSizeConfig);
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("autoSizeConfig") set autoSizeConfig(cfg: FieldAutoSizeConfig) {
        this.autoSizeConfig$.next({
            ...defaultFieldAutoSizeConfig,
            ...cfg,
        });
    }

    placeholder$ = combineLatest([
        this.value$,
        this.autoSizeConfig$,
    ]).pipe(
        map(([_value, config]) => {
            if (!config.autoSize) return "";

            const value = (_value ?? "").toString();
            const offset = config.fillChar.repeat(config.offsetCount);
            const paddedValue = (config.keepOriginalCharacters ? value : "").padEnd(
                config.minCharLen,
                config.fillChar
            );

            return offset + paddedValue;
        }),
        shareReplay(1),
    )
}
