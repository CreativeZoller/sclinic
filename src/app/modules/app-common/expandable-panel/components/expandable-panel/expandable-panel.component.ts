import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-expandable-panel',
    templateUrl: './expandable-panel.component.html',
    styleUrls: ['./expandable-panel.component.scss']
})
export class ExpandablePanelComponent {

    @Input() headerType: "SECTION_TITLE" | "SECTION_SUBTITLE" = "SECTION_TITLE";
    @Input() title: string;
    @Input() withIcon: boolean = true;
    @Input() compoundTitle: string[];
    @Input() titleClass: string = "title-default";
    @Input() compoundTitleClass: string = "compound-title-default";
    @Input() separatorClass: string = "separator-default";
    @Input() separator = '/';
    @Input() preButtonsTemplate: TemplateRef<any>;
    @Input() postButtonsTemplate: TemplateRef<any>;

    @Input() isOpened = true;

    open() {
        this.isOpened = true;
    }

    close() {
        this.isOpened = false;
    }

    toggle() {
        this.isOpened = !this.isOpened;
    }
}
