import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";

const BODY_CLASSES = ["bgi-size-cover", "bgi-position-center", "bgi-no-repeat"];


@Component({
    selector: "app-errors",
    templateUrl: "./errors.component.html",
    styleUrls: ["./errors.component.scss"],
})
export class ErrorsComponent implements OnInit, OnDestroy {

    @HostBinding("class") class = "d-flex flex-column flex-root";

    ngOnInit(): void {
        BODY_CLASSES.forEach((c) => document.body.classList.add(c));
    }

    ngOnDestroy(): void {
        BODY_CLASSES.forEach((c) => document.body.classList.remove(c));
    }
}
