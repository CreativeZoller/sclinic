import { InjectionToken } from "@angular/core";
import { FilePreviewService } from "./file-preview-service.interface";

export const FILE_PREVIEW_SERVICES_TOKEN = new InjectionToken<FilePreviewService[]>("filePreviewServices", { factory: () => [] })
