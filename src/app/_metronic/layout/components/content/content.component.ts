import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
// import { DrawerComponent } from '../../../kt/components';
@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnDestroy {

    private router = inject(Router);

    @Input() contentContainerCSSClass: string = '';
    @Input() appContentContiner?: 'fixed' | 'fluid';
    @Input() appContentContainerClass: string = '';

    private unsubscribe: Subscription[] = [];

    ngOnInit(): void {
        this.routingChanges();
    }

    routingChanges() {
        const routerSubscription = this.router.events.subscribe((event) => {
            if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel
            ) {
                // DrawerComponent.hideAll();
            }
        });
        this.unsubscribe.push(routerSubscription);
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
