import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";


@UntilDestroy()
@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {

}
