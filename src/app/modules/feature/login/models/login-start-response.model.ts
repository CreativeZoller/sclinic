import { AuthService } from "../../../core/auth/services/auth.service";
import { UnObservable } from "../../../core/utility/types/un-observable";

export type LoginStartResponse = UnObservable<ReturnType<AuthService["loginStart"]>>;
