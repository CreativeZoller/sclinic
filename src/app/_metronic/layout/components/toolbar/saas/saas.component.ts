import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-saas',
    templateUrl: './saas.component.html',
    styleUrls: ['./saas.component.scss'],
})
export class SaasComponent {
    @Input() appPageTitleDisplay: boolean;
}
