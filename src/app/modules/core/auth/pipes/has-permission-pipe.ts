import { inject, Pipe, PipeTransform } from "@angular/core";
import { Observable } from "rxjs";
import { PermissionService } from "../services/permission.service";


@Pipe({
    name: "hasPermission$",
    pure: false
})
export class HasPermissionPipe implements PipeTransform {

    private permissionService = inject(PermissionService);

    transform(permission: string): Observable<boolean> {
        return this.permissionService.hasPermission$(permission);
    }
}
