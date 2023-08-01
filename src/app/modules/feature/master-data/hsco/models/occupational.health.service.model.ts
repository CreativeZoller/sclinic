import { CoreModelsMasterDataOccupationalHealthTransferModelGroupExposureItemData } from "../../../../../../api/models";
import { UnArray } from "../../../../core/utility/types/un-array";
import { Exposure } from "../../exposure/models/exposure.model";
import { Occupational_Health_Model } from "./occupational.health.model";


export type OccupationalHealthXAloneService_Model = UnArray<Occupational_Health_Model["aloneServiceList"]>;
export type GroupedExposureServiceList = UnArray<Occupational_Health_Model["groupedExposureServiceList"]>;
export type GroupExposureItemList = UnArray<GroupedExposureServiceList["exposureItemList"]>;
export type OccupationalHealthServiceList = NonNullable<GroupExposureItemList["serviceList"]>;
export type TransferModelGroupExposureItemData = CoreModelsMasterDataOccupationalHealthTransferModelGroupExposureItemData;
export type ExposureData = Exposure;
export type ExposureItemData = CoreModelsMasterDataOccupationalHealthTransferModelGroupExposureItemData;
