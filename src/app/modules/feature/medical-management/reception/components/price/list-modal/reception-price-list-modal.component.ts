import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, map, Observable, shareReplay, switchMap, tap } from "rxjs";
import { WithNgAfterViewInitSubject } from "../../../../../../core/utility/mixins/with-ng-after-view-init-subject.mixin";
import { ResourceService } from "../../../../../../core/resource/services/resource.service";
import { ModalComponent, ModalConfig } from "../../../../../../../_metronic/partials";
import { MasterDataManagementService } from "../../../../../../../../api/services";
import { PriceTableStatusEnum } from "../../../../../../../../api/enums";


@UntilDestroy()
@Component({
    selector: 'app-reception-price-list-modal',
    templateUrl: './reception-price-list-modal.component.html',
    styleUrls: ['./reception-price-list-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceptionPriceListModalComponent extends WithNgAfterViewInitSubject(class {}) {

    private cdr = inject(ChangeDetectorRef);
    private resourceService = inject(ResourceService);
    private masterDataManagementService = inject(MasterDataManagementService);

    @ViewChild("modal") modalComponent: ModalComponent;

    private activePriceTableLoading$ = new BehaviorSubject<boolean>(false);
    protected activePriceTable$ = this.masterDataManagementService.priceTableGetPriceTableByConditionPost({
        dC_PriceTableStatusId: PriceTableStatusEnum.ACTIVE,
        needPriceTemplate: true
    }).pipe(
        tap(() => this.activePriceTableLoading$.next(true)),
        map((resp) => resp.businessObjectList?.[0]),
        tap(() => this.activePriceTableLoading$.next(false)),
        shareReplay(1),
    );

    protected modalConfig$: Observable<ModalConfig> = this.ngAfterViewInit$.pipe(
        switchMap(() => this.activePriceTableLoading$),
        map((loading) => {
            return <ModalConfig>{
                hideDeleteButton: true,
                hideSaveButton: true,
                dismissButtonLabel: this.resourceService.resolve("general.action.label.close"),
                modalTitle: this.resourceService.resolve("reception.prices.modal.title"),
                loading: loading,
                onDismiss: (modal: ModalComponent) => {
                    modal.close();
                    this.cdr.markForCheck();
                },
            };
        }),
        shareReplay(1),
    );

    open() {
        this.modalComponent.open();
        this.cdr.markForCheck();
    }
}
