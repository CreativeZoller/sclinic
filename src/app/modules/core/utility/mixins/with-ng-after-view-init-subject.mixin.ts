import { AfterViewInit, Directive } from "@angular/core";
import { Subject } from "rxjs";


type Constructor<T> = new(...args: any[]) => T;

export function WithNgAfterViewInitSubject<T extends Constructor<any>>(Base: T = (class {} as any)) {
    @Directive()
    class Clazz extends Base implements AfterViewInit {
        ngAfterViewInit$ = new Subject<void>();

        ngAfterViewInit() {
            super.ngAfterViewInit?.();
            this.ngAfterViewInit$.next();
            this.ngAfterViewInit$.complete();
        }
    }

    // Must return a named token, dont merge it with the class declaration!
    return Clazz;
}
