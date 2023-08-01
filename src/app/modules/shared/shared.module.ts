// Modules
import { NgModule } from '@angular/core';

// Components
import { AppCommonModule } from "../app-common/app-common.module";
import { CoreModule } from "../core/core.module";
import { _SharedModule } from "./_shared.module";


@NgModule({
    imports: [
        _SharedModule,
        // TODO kivenni ha átvittük a text-field és társai componenseket a common-ba
        CoreModule,
        AppCommonModule,
    ],
    exports: [
        _SharedModule,
        CoreModule,
        AppCommonModule,
    ],
    providers: [],
})

export class SharedModule { }
