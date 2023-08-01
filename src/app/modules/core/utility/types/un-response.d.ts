import { HttpResponse } from "@angular/common/http";

export type UnResponse<T> = T extends HttpResponse<infer U> ? U : never
