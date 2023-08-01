import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-section-title',
    templateUrl: './section-title.component.html',
    styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent {
    @Input() title: string;
    @Input() withIcon: boolean = true;
    @Input() buttonsTemplate: TemplateRef<any>;
}
