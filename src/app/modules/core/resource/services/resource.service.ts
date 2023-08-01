import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, map, Observable, skip, switchMap, take } from "rxjs";
import { LanguageService } from "../../language/services/language.service";
import { flattenObject } from "../../utility/methods/flatten-object";
import stripJsonComments from 'strip-json-comments';


@UntilDestroy()
@Injectable()
export class ResourceService {

    private languageService = inject(LanguageService);
    private httpClient = inject(HttpClient);

    private resourcePackage$ = new BehaviorSubject<Record<string, string> | null>(null);

    constructor() {
        this.languageService.getActiveLanguage$().pipe(
            untilDestroyed(this),
            switchMap((language) => this.httpClient.get(
                `/assets/resources/${language?.toLowerCase()}.resources.json`,
                { responseType: "text" },
            )),
            map((str) => stripJsonComments(str, { trailingCommas: true })),
            map((str) => JSON.parse(str)),
            map((rawResourcePackage) => flattenObject(rawResourcePackage)),
        ).subscribe((resourcePackage) => {
            this.resourcePackage$.next(resourcePackage);
        });
    }

    public waitLoadingResources$(): Observable<boolean> {
        return this.resourcePackage$.pipe(
            skip(1),
            take(1),
            map((r) => r != null),
        );
    }

    public canResolve(
        key: string,
        options?: {
            resourceOverrides?: Record<string, string>,
            resourceOverridesMethod?: "merge" | "replace",
        },
    ): boolean {
        const resourceOverrides = options?.resourceOverrides ?? null;
        const resourceOverridesMethod = options?.resourceOverridesMethod || "merge";

        let resourcePackage = this.resourcePackage$.value;
        if (resourceOverridesMethod === "replace") {
            resourcePackage = resourceOverrides;
        }

        if (resourcePackage == null) return false;
        if (resourceOverridesMethod === "merge") {
            resourcePackage = {
                ...resourcePackage,
                ...resourceOverrides,
            };
        }

        return resourcePackage[key] != null;
    }

    public resolve(
        key: string,
        options?: {
            params?: Record<string, string>,
            resourceOverrides?: Record<string, string>,
            resourceOverridesMethod?: "merge" | "replace",
        },
    ): string {
        const resourceOverrides = options?.resourceOverrides ?? null;
        const resourceOverridesMethod = options?.resourceOverridesMethod || "merge";
        const params = options?.params || {};

        let resourcePackage = this.resourcePackage$.value;
        if (resourceOverridesMethod === "replace") {
            resourcePackage = resourceOverrides;
        }

        if (resourcePackage == null) throw new Error("Resource package is null, probably not loaded yet!")
        if (resourceOverridesMethod === "merge") {
            resourcePackage = {
                ...resourcePackage,
                ...resourceOverrides,
            };
        }

        const resource = resourcePackage[key];

        if (resource == null) return `MISSING_RESOURCE: ${key}`

        return this.applyTemplateParameters(resource, typeof params === "object" ? params : {})
    }

    private applyTemplateParameters(template: string, parametersMap: any) {
        return template.replace(/{{([^}]*)}}/g, (all, param: string) => {
            return parametersMap[param] ?? all;
        });
    }
}
