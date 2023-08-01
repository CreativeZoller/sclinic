import { inject, Pipe, PipeTransform } from "@angular/core"
import { ResourceService } from "../services/resource.service";


@Pipe({
    name: "resolveResource",
    pure: true,// Can be pure because on language change we reload the page
})
export class ResolveResourcePipe implements PipeTransform {

    private resourceService = inject(ResourceService);

    transform(...args: Parameters<ResourceService['resolve']>): ReturnType<ResourceService['resolve']> {
        return this.resourceService.resolve(...args);
    }
}
