import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';
// Other
import { DropdownMenusModule } from '../dropdown-menus/dropdown-menus.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// new
@NgModule({
    declarations: [
        // Other
    ],
    imports: [
        CommonModule,
        DropdownMenusModule,
        InlineSVGModule,
        NgApexchartsModule,
        NgbDropdownModule,
    ],
    exports: [
        // new
    ],
})
export class WidgetsModule {}
