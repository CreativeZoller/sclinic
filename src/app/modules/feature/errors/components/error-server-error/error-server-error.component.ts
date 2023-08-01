import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DASHBOARD_ROUTE } from "../../../../../app.config";
import { reinitMetronicComponents } from "../../../../../_metronic/helper";


@Component({
    selector: "app-error-server-error",
    templateUrl: "./error-server-error.component.html",
    styleUrls: ["./error-server-error.component.scss"],
})
export class ErrorServerErrorComponent implements OnInit, OnDestroy {

    private router = inject(Router);

    ngOnInit(): void {
        document.body.style.backgroundImage = "url(./assets/media/auth/bg7.jpg)";
    }

    routeToDashboard() {
        this.router.navigate([DASHBOARD_ROUTE]);

        // TODO sajnos a "custom" nem angularos komponensek miatt muszáj manuálisan csinálni ezt!
        reinitMetronicComponents();
    }

    ngOnDestroy() {
        document.body.style.backgroundImage = "none";
    }
}
