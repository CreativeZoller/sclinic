import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownMenu1Component } from './dropdown-menu1/dropdown-menu1.component';

@NgModule({
    declarations: [
        DropdownMenu1Component,
    ],
    imports: [CommonModule],
    exports: [
        DropdownMenu1Component,
    ],
})
export class DropdownMenusModule {}
