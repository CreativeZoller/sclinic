import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BASE_PATH } from './variables';
import { APIS } from './api/api';


@NgModule({
    imports: [
    ],
    providers: [
        { provide: BASE_PATH, useValue: (environment?.apiUrl ?? "") + (environment?.authenticationApiBasePath ?? "/api/authentication") },
        ...APIS,
    ]
})
export class AuthenticationApiModule { }