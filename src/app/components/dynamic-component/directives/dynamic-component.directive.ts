import { Directive, inject, Injector, Input, OnInit, Type, ViewContainerRef } from "@angular/core";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, combineLatest } from "rxjs";


// TODO move it to the app common module
@UntilDestroy()
@Directive({
    selector: '[appDynamicComponent]'
})
export class DynamicComponentDirective<T> implements OnInit {

    protected viewContainerRef = inject(ViewContainerRef);

    protected component$ = new BehaviorSubject<Type<T> | undefined>(undefined);
    @Input() set component(component: Type<T> | undefined | null) {
        this.component$.next(component ?? undefined);
    }

    protected injector$ = new BehaviorSubject<Injector | undefined>(undefined);
    @Input() set injector(injector: Injector | undefined | null) {
        this.injector$.next(injector ?? undefined);
    }

    protected initComponentBindingFn$ = new BehaviorSubject<((instance: T) => void) | undefined>(undefined);
    @Input() set initComponentBindingFn(initComponentBindingFn: ((instance: T) => void) | undefined | null) {
        this.initComponentBindingFn$.next(initComponentBindingFn ?? undefined);
    }

    public instance?: T;

    public ngOnInit() {
        combineLatest([
            this.component$,
            this.injector$,
            this.initComponentBindingFn$,
        ]).pipe(
            untilDestroyed(this),
        ).subscribe(([comp, injector, initFn]) => {
            this.viewContainerRef.clear();
            this.instance = undefined;

            if (comp != null) {
                const componentRef = this.viewContainerRef.createComponent(comp, {
                    injector: injector ?? undefined,
                });
                if (initFn != null) initFn(componentRef.instance);
                this.instance = componentRef.instance;

                componentRef.changeDetectorRef.markForCheck();
            }
        })
    }
}
