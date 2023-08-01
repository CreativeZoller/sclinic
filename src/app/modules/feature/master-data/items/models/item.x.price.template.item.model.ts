import { UnArray } from "../../../../core/utility/types/un-array";
import { Item } from "./item.model";

export type ItemXPriceTemplateItem = UnArray<NonNullable<Item["priceTemplateItem"]>>;
