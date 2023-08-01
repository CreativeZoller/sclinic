import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { BaseInitPageResolver } from "../../../../app-common/init-page-data-provider/utility/base-init-page-resolver/base-init-page-resolver.directive";


@Injectable({ providedIn: "root" })
export class ReceptionInitPageResolver extends BaseInitPageResolver {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.resolveDcTables$([
            "DC_AppointmentStatusDTO",
            "DC_AppointmentCancellationDTO",
            "DC_VIPDTO",
            "DC_FloorDTO",
            "DC_NationalityDTO",
            "DC_LanguageDTO",
            "DC_TitleTypeDTO",
            "DC_GenderDTO",
            "DC_PatientIdTypeDTO",
            "DC_PatientAddressTypeDTO",
            "DC_PublicPlaceCategoryDTO",
            "DC_ContactTypeDTO",
            "DC_PatientIdTypeCategoryDTO",
            "DC_StatusDTO",
            "DC_OccupationalHealthClassificationDTO",
            "DC_BookingAreaDTO",
            "DC_ServiceCategoryDTO",
            "DC_ServicePackageCategoryDTO",
            "DC_SubServicePackageCategoryDTO",
        ]);
    }
}
