import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-dropdown-menu1',
    templateUrl: './dropdown-menu1.component.html',
})
export class DropdownMenu1Component {
    @HostBinding('class') class =
        'menu menu-sub menu-sub-dropdown w-250px w-md-300px';
    @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
}