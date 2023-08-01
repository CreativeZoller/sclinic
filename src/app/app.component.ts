import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'body[root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

    private modeService = inject(ThemeModeService);

    ngOnInit() {
        this.modeService.init();
    }
}
