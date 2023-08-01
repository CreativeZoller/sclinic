import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { startOfDay } from "date-fns";
import { ReceptionPriceListModalComponent } from "../price/list-modal/reception-price-list-modal.component";


@UntilDestroy()
@Component({
    selector: "app-reception-main",
    templateUrl: "./reception-main.component.html",
    styleUrls: ["./reception-main.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionMainComponent {

    public baseResourceKey = "reception";

    public scheduleDate = startOfDay(new Date());

    @ViewChild(ReceptionPriceListModalComponent) receptionPriceListModalComponent: ReceptionPriceListModalComponent;
    public openPricesModal() {
        this.receptionPriceListModalComponent?.open();
    }

    public openQRCodeModal() {
        // TODO
    }
}
