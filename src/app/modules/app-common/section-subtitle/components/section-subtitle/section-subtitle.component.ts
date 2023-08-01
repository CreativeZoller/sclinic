import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-section-subtitle',
    templateUrl: './section-subtitle.component.html',
    styleUrls: ['./section-subtitle.component.scss']
})
export class SectionSubtitleComponent {
    @Input() title: string;
    @Input() compoundTitle: string[];
    @Input() titleClass: string = "title-default";
    @Input() compoundTitleClass: string = "compound-title-default";
    @Input() separatorClass: string = "separator-default";
    @Input() separator = '/';

    @Input() buttonsTemplate: TemplateRef<any>;
}
