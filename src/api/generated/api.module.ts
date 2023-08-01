import { NgModule } from '@angular/core';
import { AuthenticationApiModule } from './authentication/api.module';
import { MasterdataApiModule } from './masterdata/api.module';
import { ResourceApiModule } from './resource/api.module';
import { MedicalApiModule } from './medical/api.module';
import { InvoiceApiModule } from './invoice/api.module';
import { DictionaryApiModule } from './dictionary/api.module';
import { UtilityApiModule } from './utility/api.module';


@NgModule({
    imports: [
        AuthenticationApiModule,
        MasterdataApiModule,
        ResourceApiModule,
        MedicalApiModule,
        InvoiceApiModule,
        DictionaryApiModule,
        UtilityApiModule,
    ],
})
export class ApiModule { }