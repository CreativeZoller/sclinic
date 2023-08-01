import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
    @Input() appPageTitleDisplay: boolean;
}
