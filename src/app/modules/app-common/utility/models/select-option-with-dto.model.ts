import { SelectOption } from "../../../core/utility/types/select-option";

export type SelectOptionWithDto<DTO, T = DTO> = SelectOption<T> & { dto: DTO };
