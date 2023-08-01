import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BASE_PATH } from './variables';
import { APIS } from './api/api';


@NgModule({
    imports: [
    ],
    providers: [
        { provide: BASE_PATH, useValue: (environment?.apiUrl ?? "") + (environment?.resourceApiBasePath ?? "/api/resource") },
        ...APIS,
    ]
})
export class ResourceApiModule { }