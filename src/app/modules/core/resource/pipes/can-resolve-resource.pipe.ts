import { inject, Pipe, PipeTransform } from "@angular/core"
import { ResourceService } from "../services/resource.service";


@Pipe({
    name: "canResolveResource",
    pure: true,// Can be pure because on language change we reload the page
})
export class CanResolveResourcePipe implements PipeTransform {

    private resourceService = inject(ResourceService);

    transform(...args: Parameters<ResourceService['canResolve']>): ReturnType<ResourceService['canResolve']> {
        return this.resourceService.canResolve(...args);
    }
}
