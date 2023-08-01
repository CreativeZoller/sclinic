import { DictionaryProviderWebServiceService } from "../../../../../../api/services";
import { UnArray } from "../../../../core/utility/types/un-array";


type ResponseModel = NonNullable<Parameters<DictionaryProviderWebServiceService["dCCreateOrUpdateDictionaryEntriesPost"]>[0]>
export type DictionaryEntry = UnArray<ResponseModel["dictionaryEntries"]>;
