import { Component, ElementRef, inject, Input } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, finalize, map, skip, startWith, takeUntil, tap } from "rxjs";
import { AuthService } from "../../../../core/auth/services/auth.service";
import { LoginSecondFactorFormValue } from "../../../../core/auth/models/login-second-factor-form-value.model";
import { ROLE_SELECT_ROUTE } from "../../../../../app.config";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ToastrService } from "ngx-toastr";
import { LoginStartResponse } from "../../models/login-start-response.model";
import { $enum } from "ts-enum-util";
import { ClinicTypeEnum, UserTypeEnum, TwoFactorAuthenticationTypeEnum } from "../../../../../../api/enums";
import { SelectOption } from "../../../../core/utility/types/select-option";
import { ResourceService } from "../../../../core/resource/services/resource.service";


@UntilDestroy()
@Component({
    selector: "app-login-second-factor-form",
    templateUrl: "./login-second-factor-form.component.html",
    styleUrls: ["./login-second-factor-form.component.scss"],
})
export class LoginSecondFactorFormComponent {

    private authService = inject(AuthService);
    private router = inject(Router);
    private el = inject(ElementRef);
    private toastrService = inject(ToastrService);
    private resourceService = inject(ResourceService);

    protected constants = {
        TwoFactorAuthenticationType: TwoFactorAuthenticationTypeEnum,
    }

    public errorResourceKeyPrefix = "login.second.factor.form.errors";

    private loginStartResponse$ = new BehaviorSubject<LoginStartResponse | null>(null);
    @Input() set loginStartResponse(response: LoginStartResponse) {
        this.loginStartResponse$.next(response);
    };

    public loginSecondFactorForm = new FormGroup({
        // Ellátóhely
        clinicId: new FormControl<LoginSecondFactorFormValue["clinicId"]>(null, { nonNullable: true, validators: [Validators.required] }),
        // Praxis
        praxisId: new FormControl<LoginSecondFactorFormValue["praxisId"]>(null, { nonNullable: true, validators: [] }),
        // EEESZT bejelentkezés?
        useEesztLogin: new FormControl<LoginSecondFactorFormValue["useEesztLogin"]>(true, { nonNullable: true, validators: [] }),
        // Authentikáció módja
        authTypeId: new FormControl<LoginSecondFactorFormValue["authTypeId"]>(TwoFactorAuthenticationTypeEnum.GOOGLE, { nonNullable: true, validators: [Validators.required] }),
        // EESZT felhasználónév
        eesztUsername: new FormControl<LoginSecondFactorFormValue["eesztUsername"]>("", { nonNullable: true, validators: [] }),
        // Hard token jelszó
        hardToken: new FormControl<LoginSecondFactorFormValue["hardToken"]>({ value: "", disabled: true }, { nonNullable: true, validators: [Validators.required]}),
        // Kód
        twoFactorCode: new FormControl<LoginSecondFactorFormValue["twoFactorCode"]>("", { nonNullable: true, validators: [Validators.required]}),
    });

    public authTypeOptions$ = this.loginSecondFactorForm.valueChanges.pipe(
        startWith(this.loginSecondFactorForm.value),
        map((value) => {
            return $enum(TwoFactorAuthenticationTypeEnum).getEntries()
                .filter(([_, enumValue]) => {
                    return !!value?.useEesztLogin || enumValue === TwoFactorAuthenticationTypeEnum.GOOGLE
                })
                .map(([enumKey, enumValue]) => {
                    return {
                        name: this.resourceService.resolve(`general.enum.label.TwoFactorAuthenticationType.${enumKey}`),
                        value: enumValue,
                    }
                });
        }),
    );

    public praxisOptions: SelectOption[] = [];
    public clinicOptions: SelectOption[] = [];

    public isSubmitting$ = new BehaviorSubject<boolean>(false);

    protected isDoctorLogin: boolean = false;

    private computeSelectOptions(loginStartResponse: LoginStartResponse | null) {
        this.praxisOptions = [
            { value: null, name: "SWISS" },// Default option
        ];
        this.clinicOptions = [];

        for (const role of loginStartResponse?.swissUserXRole ?? []) {
            for (const clinic of role?.swissUserXRoleXClinic ?? []) {
                if (clinic?.clinic?.clinicId != null) {
                    if (clinic?.clinic?.dC_ClinicTypeId === ClinicTypeEnum.PRIVATE) {
                        // If ClinicType.PRIVATE -> praxis option
                        this.praxisOptions.push({
                            value: clinic.clinic.clinicId!,
                            name: clinic.clinic.clinicName ?? "",
                        });
                    } else {
                        // If not ClinicType.PRIVATE -> clinic option
                        this.clinicOptions.push({
                            value: clinic.clinic.clinicId!,
                            name: clinic.clinic.clinicName ?? "",
                        });
                    }
                }
            }
        }

        // Deduplicate options by value (clinicId)
        this.praxisOptions = this.praxisOptions.filter((v, i, arr) => arr.map(v => v.value).indexOf(v.value) === i);
        this.clinicOptions = this.clinicOptions.filter((v, i, arr) => arr.map(v => v.value).indexOf(v.value) === i);
    }

    constructor() {
        this.loginStartResponse$.pipe(
            tap((r) => this.isDoctorLogin = r?.dC_UserTypeId === UserTypeEnum.DOCTOR),
            untilDestroyed(this),
        ).subscribe((loginStartResponse) => {
            this.computeSelectOptions(loginStartResponse);

            this.loginSecondFactorForm.reset(undefined, { emitEvent: false });

            // Select clinic default option
            const clinicDefaultOption = this.clinicOptions?.length === 1
                ? this.clinicOptions[0].value
                : null;

            this.loginSecondFactorForm.controls.clinicId.setValue(clinicDefaultOption, { emitEvent: false });

            const eesztUsernameDefaultValue = this.isDoctorLogin
                // TODO user pecsétszámát kellene ide bekötni az "123456" helyére
                ? `O${123456}`
                : "";

            if (this.isDoctorLogin) {
                // Enable fields only needed for doctor form & set authTypeId, and eesztUsername from user data
                if (!this.loginSecondFactorForm.controls.praxisId.enabled) {
                    this.loginSecondFactorForm.controls.praxisId.enable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.praxisId.reset(undefined, { emitEvent: false });
                }
                if (!this.loginSecondFactorForm.controls.useEesztLogin.enabled) {
                    this.loginSecondFactorForm.controls.useEesztLogin.enable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.useEesztLogin.reset(undefined, { emitEvent: false });
                }
                if (!this.loginSecondFactorForm.controls.authTypeId.enabled) {
                    this.loginSecondFactorForm.controls.authTypeId.enable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.authTypeId.reset(
                        loginStartResponse?.dC_TwoFactorAuthenticationTypeId ?? null as unknown as TwoFactorAuthenticationTypeEnum,
                        { emitEvent: false }
                    );
                }
                if (!this.loginSecondFactorForm.controls.eesztUsername.enabled) {
                    this.loginSecondFactorForm.controls.eesztUsername.enable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.eesztUsername.reset(eesztUsernameDefaultValue, { emitEvent: false });
                }
                if (!this.loginSecondFactorForm.controls.hardToken.enabled) {
                    this.loginSecondFactorForm.controls.hardToken.enable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.hardToken.reset(undefined, { emitEvent: false });
                }
            } else {
                // Disable fields only needed for doctor form
                if (!this.loginSecondFactorForm.controls.praxisId.disabled) {
                    this.loginSecondFactorForm.controls.praxisId.disable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.praxisId.reset(undefined, { emitEvent: false });
                }
                if (!this.loginSecondFactorForm.controls.useEesztLogin.disabled) {
                    this.loginSecondFactorForm.controls.useEesztLogin.disable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.useEesztLogin.reset(undefined, { emitEvent: false });
                }
                if (!this.loginSecondFactorForm.controls.authTypeId.disabled) {
                    this.loginSecondFactorForm.controls.authTypeId.disable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.authTypeId.reset(undefined, { emitEvent: false });
                }
                if (!this.loginSecondFactorForm.controls.eesztUsername.disabled) {
                    this.loginSecondFactorForm.controls.eesztUsername.disable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.eesztUsername.reset(undefined, { emitEvent: false });
                }
                if (!this.loginSecondFactorForm.controls.hardToken.disabled) {
                    this.loginSecondFactorForm.controls.hardToken.disable({ emitEvent: false });
                    this.loginSecondFactorForm.controls.hardToken.reset(undefined, { emitEvent: false });
                }
            }

            this.loginSecondFactorForm.valueChanges.pipe(
                takeUntil(this.loginStartResponse$.pipe(/*Skip cached value*/skip(1))),
                untilDestroyed(this),
            ).subscribe(() => {
                const value = this.loginSecondFactorForm.getRawValue();

                if (this.isDoctorLogin) {
                    if (value.authTypeId === TwoFactorAuthenticationTypeEnum.HARD_TOKEN) {
                        // Hard token selected
                        if (!this.loginSecondFactorForm.controls.hardToken.enabled) {
                            return this.loginSecondFactorForm.controls.hardToken.enable();
                        }
                        if (!this.loginSecondFactorForm.controls.twoFactorCode.disabled) {
                            this.loginSecondFactorForm.controls.twoFactorCode.disable({ emitEvent: false });
                            return this.loginSecondFactorForm.controls.twoFactorCode.reset(undefined);
                        }
                    } else {
                        if (!this.loginSecondFactorForm.controls.hardToken.disabled) {
                            this.loginSecondFactorForm.controls.hardToken.disable({ emitEvent: false });
                            return this.loginSecondFactorForm.controls.hardToken.reset(undefined);
                        }
                        if (!this.loginSecondFactorForm.controls.twoFactorCode.enabled) {
                            return this.loginSecondFactorForm.controls.twoFactorCode.enable();
                        }
                    }

                    if(value.praxisId != null) {
                        // Praxis selected other than the default
                        if (!this.loginSecondFactorForm.controls.clinicId.disabled) {
                            this.loginSecondFactorForm.controls.clinicId.disable({ emitEvent: false });
                            return this.loginSecondFactorForm.controls.clinicId.reset(undefined);
                        }
                    } else {
                        if (!this.loginSecondFactorForm.controls.clinicId.enabled) {
                            this.loginSecondFactorForm.controls.clinicId.enable({ emitEvent: false });
                            return this.loginSecondFactorForm.controls.clinicId.reset(clinicDefaultOption);
                        }
                    }

                    if(value.useEesztLogin === true) {
                        if(!this.loginSecondFactorForm.controls.eesztUsername.enabled) {
                            this.loginSecondFactorForm.controls.eesztUsername.enable({ emitEvent: false });
                            return this.loginSecondFactorForm.controls.eesztUsername.reset(eesztUsernameDefaultValue);
                        }
                    } else {
                        if (this.loginSecondFactorForm.controls.authTypeId.value !== TwoFactorAuthenticationTypeEnum.GOOGLE) {
                            return this.loginSecondFactorForm.controls.authTypeId.setValue(TwoFactorAuthenticationTypeEnum.GOOGLE);
                        }
                        if(!this.loginSecondFactorForm.controls.eesztUsername.disabled) {
                            this.loginSecondFactorForm.controls.eesztUsername.disable({ emitEvent: false });
                            return this.loginSecondFactorForm.controls.eesztUsername.reset(undefined);
                        }
                    }
                }
            });

            this.loginSecondFactorForm.updateValueAndValidity();
        });
    }

    submit() {
        this.loginSecondFactorForm.markAllAsTouched();
        this.loginSecondFactorForm.updateValueAndValidity();
        if (this.loginSecondFactorForm.valid && this.isSubmitting$.value === false) {
            this.isSubmitting$.next(true);
            this.authService.loginSecondFactor(
                this.loginSecondFactorForm.getRawValue(),
                this.loginStartResponse$.value!,
            ).pipe(
                finalize(() => {
                    this.isSubmitting$.next(false);
                }),
                tap({
                    error: (err) => {
                        this.toastrService.error("Nem sikerült bejelentkezni, kérjük ellenőrizze a megadott adatokat!");// TODO nyelviesítés
                    },
                })
            ).subscribe(() => {
                this.router.navigate([ROLE_SELECT_ROUTE], { queryParamsHandling: "preserve" });
            });
        } else {
            const firstInvalidElement = this.el.nativeElement?.querySelector?.(".ng-invalid") as HTMLElement;
            if (firstInvalidElement) firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
        }
    }
}
