import { AfterViewInit, Component, ElementRef, inject, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, finalize, tap } from "rxjs";
import { AuthService } from "../../../../core/auth/services/auth.service";
import { ROUTE_NEW_PASSWORD_TOKEN_QUERY_PARAM_KEY } from "../../../../../app.config";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { NewPasswordFormModalComponent } from "../new-password/form-modal/new-password-form-modal.component";
import { ToastrService } from "ngx-toastr";
import { LoginStartResponse } from "../../models/login-start-response.model";
import { fullEmailValidator } from "../../../../core/utility/validators/full-email.validator";
import { environment } from "../../../../../../environments/environment";


@UntilDestroy()
@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements AfterViewInit {

    private authService = inject(AuthService);
    private el = inject(ElementRef);
    private activatedRoute = inject(ActivatedRoute);
    private toastrService = inject(ToastrService);

    public errorResourceKeyPrefix = "login.form.errors";

    public loginForm = new FormGroup({
        email: new FormControl("", { nonNullable: true, validators: [
            Validators.required,
            Validators.minLength(3),
            fullEmailValidator,
        ]}),
        password: new FormControl("", { nonNullable: true, validators: [
            Validators.required,
            Validators.minLength(3),
        ]}),
    });

    public isSubmitting$ = new BehaviorSubject<boolean>(false);
    public loginStartResponse?: LoginStartResponse;

    @ViewChild(NewPasswordFormModalComponent) private newPasswordFormModal: NewPasswordFormModalComponent;
    public ngAfterViewInit() {
        this.activatedRoute.queryParams.pipe(
            untilDestroyed(this),
        ).subscribe((queryParams) => {
            const newPasswordToken = queryParams[ROUTE_NEW_PASSWORD_TOKEN_QUERY_PARAM_KEY];
            if (newPasswordToken) this.newPasswordFormModal?.open();
        });
    }

    submit() {
        this.loginForm.markAllAsTouched();
        this.loginForm.updateValueAndValidity();
        if (this.loginForm.valid && this.isSubmitting$.value === false) {
            this.isSubmitting$.next(true);
            this.authService.loginStart(
                this.loginForm.value.email!,
                this.loginForm.value.password!,
            ).pipe(
                finalize(() => {
                    this.isSubmitting$.next(false);
                }),
                tap({
                    error: (err) => {
                        this.toastrService.error("Nem sikerült bejelentkezni, kérjük ellenőrizze a megadott adatokat!");// TODO nyelviesítés
                    },
                })
            ).subscribe((loginStartResponse) => {
                this.loginStartResponse = loginStartResponse;
            });
        } else {
            const firstInvalidElement = this.el.nativeElement?.querySelector?.(".ng-invalid") as HTMLElement;
            if (firstInvalidElement) firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
        }
    }

    public appVersion = environment.appVersion;
}
