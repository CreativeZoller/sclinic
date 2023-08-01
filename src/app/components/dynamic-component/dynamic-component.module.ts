// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// Components
import { DynamicComponentDirective } from "./directives/dynamic-component.directive";


@NgModule({
    declarations: [
        DynamicComponentDirective,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        DynamicComponentDirective,
    ],
    providers: [],
})

export class DynamicComponentModule { }
