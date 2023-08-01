import { Component, EventEmitter } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";


@UntilDestroy()
@Component({
    standalone: true,
    template: `
        <button
            *ngIf="expandable"
            mat-icon-button
            class="d-flex align-items-center justify-content-center p-0 ms-1"
            (click)="onClick($event)"
        >
            <mat-icon>{{expanded ? 'expand_more' : 'chevron_right'}}</mat-icon>
        </button>
    `,
    imports: [CommonModule, MatIconModule]
})
export class ExpandButtonComponent {
    expandable = false;
    expanded = false;
    click = new EventEmitter<void>();

    protected onClick(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        this.click.emit();
    }
}
