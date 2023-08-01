import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { TableHeader } from "../../../../../../../components/table/table/table-header";
import { UntilDestroy } from "@ngneat/until-destroy";
import { PatientXId } from "../../../models/patient-x-id.model";
import { BaseListFieldComponent } from "../../../../../../app-common/utility/base-list-field/base-list-field.directive";
import { filter, map, Observable, shareReplay, startWith } from "rxjs";
import { SkipSettingValueAccessorProviders } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { DatePipe } from "@angular/common";
import { PatientIdTypeEnum } from "../../../../../../../../api/enums/patientId-type.enum";


type Full_Model = PatientXId;

@UntilDestroy()
@Component({
    selector: "app-patient-id-list-field",
    templateUrl: "./patient-id-list-field.component.html",
    styleUrls: ["./patient-id-list-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Must set both providers & viewProviders fot @Host to work
    providers: SkipSettingValueAccessorProviders,
    viewProviders: SkipSettingValueAccessorProviders,
})
export class PatientIdListFieldComponent extends BaseListFieldComponent<Full_Model> {

    public datePipe = inject(DatePipe);

    public baseResourceKey = "patient.id";
    public tableIdProperty = "patientXPatientIdTypeId";
    @Input() public tableTitle: string;
    @Input() public tableTitleUseSectionSubtitle: boolean;

    public tableHeaders: TableHeader[] = [
        {
            id: 1,
            name: this.resourceService.resolve("patient.id.list.table.headers.dC_PatientIdTypeId"),
            attributeName: "dC_PatientIdTypeId",
            formatterFn: (v) => this.initData.dC_PatientIdTypeList.find(item => item.value === v)?.name,
        },
        {
            id: 2,
            name: this.resourceService.resolve("patient.id.list.table.headers.number"),
            attributeName: "number",
        },
        {
            id: 3,
            name: this.resourceService.resolve("patient.id.list.table.headers.dC_PatientIdTypeCategoryId"),
            attributeName: "dC_PatientIdTypeCategoryId",
            formatterFn: (v) => this.initData.dC_PatientIdTypeCategoryList.find(item => item.value === v)?.name,
        },
        {
            id: 4,
            name: this.resourceService.resolve("patient.id.list.table.headers.issueDate"),
            attributeName: "issueDate",
            formatterFn: (v) => this.datePipe.transform(v),
        },
        {
            id: 5,
            name: this.resourceService.resolve("patient.id.list.table.headers.expirationDate"),
            attributeName: "expirationDate",
            formatterFn: (v) => this.datePipe.transform(v),
        },
        {
            id: 6,
            name: this.resourceService.resolve("patient.id.list.table.headers.comment"),
            attributeName: "comment",
        },
        {
            id: 7,
            name: this.resourceService.resolve("patient.id.list.table.headers.createdBy_UserName"),
            attributeName: "createdBy_UserName",
        },
        {
            id: 8,
            name: this.resourceService.resolve("patient.id.list.table.headers.creationDate"),
            attributeName: "creationDate",
            formatterFn: (v) => this.datePipe.transform(v),
        },
        {
            id: 9,
            name: this.resourceService.resolve("patient.id.list.table.headers.lastModifiedBy_UserName"),
            attributeName: "lastModifiedBy_UserName",
        },
        {
            id: 10,
            name: this.resourceService.resolve("patient.id.list.table.headers.lastModifiedDate"),
            attributeName: "lastModifiedDate",
            formatterFn: (v) => this.datePipe.transform(v),
        },
    ];


    private defaultSelectedPatientIdType: number[] = [PatientIdTypeEnum.SocialSecurityNumber];
    public allSelectedPatientIdTypeIds$ = this.getValue$().pipe(
        map((value) => [...this.defaultSelectedPatientIdType, ...value?.map(v => v.dC_PatientIdTypeId!) ?? []]),
        startWith(this.defaultSelectedPatientIdType),
        filter(v => v != null),
        shareReplay(1),
    )

    public canCreate$: Observable<boolean> = this.allSelectedPatientIdTypeIds$.pipe(
        map(selectedIds => {
          const sourceListIds = this.initData.dC_PatientIdTypeList.map(sourceListId => sourceListId.value);
          return !(
            selectedIds.length === sourceListIds.length &&
            selectedIds.every(id => sourceListIds.includes(id))
          );
        })
    );
}
