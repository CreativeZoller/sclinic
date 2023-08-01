import { DictionaryProviderWebServiceService } from "../../../../../../api/services";


type ResponseModel = NonNullable<Parameters<DictionaryProviderWebServiceService["dictionaryCategoryUpdateDCDictionaryCategoryPost"]>[0]>
export type DictionaryCategory = NonNullable<ResponseModel["dC_DictionaryCategory"]>;
