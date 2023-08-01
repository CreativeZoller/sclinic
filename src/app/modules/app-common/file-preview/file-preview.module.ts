import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { UtilityModule } from "../../core/utility/utility.module";
import { ResourceModule } from "../../core/resource/resource.module";
import { FILE_PREVIEW_SERVICES_TOKEN } from "./models/file-preview-services.injection.token";
import { FilePreviewDocxService } from "./services/file-preview-docx.service";
import { FilePreviewComponent } from "./components/file-preview/file-preview.component";
import { FilePreviewModalComponent } from "./components/file-preview-modal/file-preview-modal.component";
import { _SharedModule } from "../../shared/_shared.module";


@NgModule({
    declarations: [
        FilePreviewComponent,
        FilePreviewModalComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        UtilityModule,
        ResourceModule,
        // TODO remove this import (only needed for modal component)
        _SharedModule,
    ],
    exports: [
        FilePreviewComponent,
        FilePreviewModalComponent,
    ],
})
export class FilePreviewModule {

    public static forRoot(): ModuleWithProviders<FilePreviewModule> {
        return {
            ngModule: FilePreviewModule,
            providers: [
                {
                    provide: FILE_PREVIEW_SERVICES_TOKEN,
                    useClass: FilePreviewDocxService,
                    multi: true,
                }
            ],
        };
    }
}
