import { ChangeDetectorRef, Component, EmbeddedViewRef, EventEmitter, HostListener, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import huLocale from '@fullcalendar/core/locales/hu';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interaction from '@fullcalendar/interaction'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isSameDay } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import tippy from 'tippy.js';


@UntilDestroy()
@Component({
    selector: 'app-fullcalendar',
    templateUrl: './fullcalendar.component.html',
    styleUrls: ['./fullcalendar.component.scss']
})

export class FullcalendarComponent {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild("eventContent") eventContent: TemplateRef<EventInput>;
    @ViewChild('editModal') editModal: ModalComponent;
    @ViewChild('contextMenu') contextMenu: HTMLDivElement;

    @HostListener('document:mousedown', ['$event'])
    onGlobalClick(event: any): void {
        const menu = document.getElementById('context-menu');
        if (menu) {
            if (!menu.contains(event.target)) {
                // clicked outside => close dropdown list
                this.contextMenuVisible = false;
            }
        }
    }

    @Output() eventClick = new EventEmitter<any>()
    @Output() eventDrop = new EventEmitter<any>()
    @Output() eventDelete = new EventEmitter<any>()

    // event group names
    @Input() set resources$(resources: BehaviorSubject<Array<any>>) {
        // remove duplicated resources
        resources.pipe(
            untilDestroyed(this)
        ).subscribe(res => {
            const uniqueArray = res.filter((item, index, self) => {
                // check if item is duplicated
                const isDuplicate = self.findIndex(obj =>
                    Object.keys(obj).every(key => obj[key] === item[key])
                ) !== index;

                return !isDuplicate;
            }).map((data, index) => {
                // give id to resources by index
                return {
                    ...data,
                    id: index
                };
            });

            // give resources data to calendar
            this.calendarOptions$.next({
                ...this.calendarOptions$.value,
                resources: uniqueArray
            });
        });
    }

    // groups header
    @Input() set resourceAreaColumns$(resourceAreaColumns: BehaviorSubject<CalendarOptions["resourceAreaColumns"]>) {
        resourceAreaColumns.pipe(
            untilDestroyed(this)
        ).subscribe(res => {
            this.calendarOptions$.next({
                ...this.calendarOptions$.value,
                resourceAreaColumns: res
            });
        });
    }

    // custom view options
    @Input() set views(views: CalendarOptions["views"]) {
        this.calendarOptions$.next({
            ...this.calendarOptions$.value,
            views: views
        });
    }

    // custom buttons to header
    @Input() set customButtons(customButtons: CalendarOptions["customButtons"]) {
        this.calendarOptions$.next({
            ...this.calendarOptions$.value,
            customButtons: customButtons
        });
    }

    // header content
    @Input() set headerToolbar(headerToolbar: CalendarOptions["headerToolbar"]) {
        this.calendarOptions$.next({
            ...this.calendarOptions$.value,
            headerToolbar: headerToolbar
        });
    }

    // events
    @Input() set events$(value: BehaviorSubject<any>) {
        value.pipe(
            untilDestroyed(this)
        ).subscribe(res => {
            // short event by start date
            let data = res.sort((a: any, b: any) => (new Date(a.start)).getTime() - (new Date(b.start)).getTime());
            // check if event is same time add one more property to event
            data = this.setEventColumnProperty(data);

            data = data.map((obj: any) => {
                return {
                    ...obj,
                    originStart: obj.start,
                    originEnd: obj.end,
                }
            })
            this._event.next(data);
        });
    }

    // opening time, in the weekly or monthly view, it is important from when to start "style.top: {x}px" the event
    @Input() openingHour: number = 6;

    // closing time, in the weekly or monthly view it is important how long you "style.top: {x}px" the event
    @Input() closingHour: number = 18;

    @Input() modalConfig: ModalConfig = {};

    @Input() dateClick: (arg: any) => void = () => {};

    @Input() selectDate: (arg: any) => void = () => {};

    private _event: BehaviorSubject<CalendarOptions["events"]> = new BehaviorSubject<CalendarOptions["events"]>([]);
    private readonly contentRenderers = new Map<string, EmbeddedViewRef<any>>();
    private changeDetection = inject(ChangeDetectorRef)

    public contextMenuTop: number = 0;
    public contextMenuLeft: number = 0;
    public contextMenuVisible: boolean = false;
    private contextMenuSelectedEvent: any = null;

    public get resources(): CalendarOptions["resources"] {
        return this.calendarOptions$.value.resources;
    }

    public get events$(): BehaviorSubject<CalendarOptions["events"]> {
        return this._event;
    }

    // ez későbbi userstoryhoz kell
    // loadEvents() {
        // const event = {
        //     title: 'test',
        //     start: Date.now(),
        //     allDay: true
        // };
        // this.calendarEvents.push(event);
    // }

    // ez későbbi userstoryhoz kell
    // handleEventClick(info : any){
        // console.log('id:', info.event.id)
        // console.log('title:', info.event.title)
        // console.log('info.el.:', info.el.querySelector('.eventContent'))
    // }

    handleClickAdd = (): void => {
       console.log("handleClickAdd")
    }

    handleClickEdit = (eventId: string): void => {
        console.log("handleClickEdit id", eventId )
     }

    handleClickDelete = (eventId: string): void => {
        console.log("handleClickDelete id", eventId)
    }

    calendarOptions: CalendarOptions = {
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        locale: huLocale,
        initialView: 'resourceTimelineDay',
        editable: true,
        slotDuration: "00:30:00",
        plugins: [resourceTimelinePlugin, interaction],
        selectable: true,
        eventClassNames: 'set-time',
        // eventClick: this.handleEventClick.bind(this), // ez későbbi userstoryhoz kell
        eventContent: (arg) => this.renderEventContent(arg),
        eventDidMount: (arg) => {
            arg.el.parentElement?.setAttribute('data-start', arg.event._def.extendedProps['originStart'] ?? '');
            arg.el.parentElement?.setAttribute('data-end', arg.event._def.extendedProps['originEnd'] ?? '');
            arg.el.parentElement?.setAttribute('data-column', arg.event._def.extendedProps['column'] ?? 0);
            arg.el.classList.add('set-time');
            arg.el.addEventListener('contextmenu', (event) => {
                event.preventDefault();

                this.contextMenuVisible = true;
                this.contextMenuTop = event.clientY;
                this.contextMenuLeft = event.clientX;
                this.contextMenuSelectedEvent = arg.event;

                this.changeDetection.detectChanges();

            });
            this.styleEventByTime();
            return 'set-time';
        },
        eventClick: (arg) => {
            this.eventClick.emit(arg.event);
            this.openModal();
        },
        eventDrop: (arg) => this.eventDrop.emit(arg),
        dateClick: (arg) => this.dateClick(arg),
        select: (arg) => {
            this.selectDate(arg);
            this.openModal();
        },
    };

    public calendarOptions$: BehaviorSubject<CalendarOptions> = new BehaviorSubject<CalendarOptions>(this.calendarOptions);

    renderEventContent(arg:any) {
        let renderer = this.contentRenderers.get(arg.event.id)
        if (!renderer) {
          // Make a new renderer and save it so that we can destroy when the event is unmounted.
          renderer = this.eventContent.createEmbeddedView({ arg: arg });
          this.contentRenderers.set(arg.event.id, renderer);
        } else {
          // Just update the existing renderer.
          renderer.context.arg = arg;
          renderer.markForCheck();
        }
        renderer.detectChanges();

        if (!renderer.rootNodes[0]._tippy){
            tippy(renderer.rootNodes[0], {
                content: renderer.rootNodes[1],
                allowHTML: true,
                hideOnClick: "toggle",
                placement: "right",
                trigger: "click",
            });
        }

        this.styleEventByTime();

        return { domNodes: [renderer.rootNodes[0]] } ;
    }

    unrenderEvent(arg:any) {
        const renderer = this.contentRenderers.get(arg.event.id);
        if (renderer) {
            if (renderer.rootNodes[0]._tippy) renderer.rootNodes[0]._tippy.destroy();
             renderer.destroy();
        }
    }

    styleEventByTime(): void {
        // ez majd későbbi finom hangolásra kell

        // if (this.calendarComponent.getApi().view.type === 'resourceTimelineDay') {
        //     return;
        // }
        // const elements = document.getElementsByClassName('set-time') as HTMLCollectionOf<HTMLElement>;
        // Array.from(elements).forEach(element => {

        //     const divElement = element.parentElement;

        //     if (divElement !== null) {

        //         // Adatok lekérdezése
        //         const startTime = divElement.getAttribute('data-start');
        //         const endTime = divElement.getAttribute('data-end');

        //         // // Kezdő és vég időpontok konvertálása
        //         const start = new Date(startTime ?? '');
        //         const end = new Date(endTime ?? '');


        //         if ( divElement.parentElement != null) {
        //             divElement.parentElement.style.height = '200px';
        //         }

        //         const columnHeight = divElement.parentElement?.offsetHeight ?? 0;

        //         const step = columnHeight / (this.closingHour - this.openingHour);

        //         console.log('getHours', Number(start.getHours()));

        //         const offset = step * (Number(start.getHours()) - this.openingHour) + step * Number(start.getMinutes()) / 60;

        //         const diffInMilliseconds = end.getTime() - start.getTime();
        //         const diffInMinutes = diffInMilliseconds / (1000 * 60);

        //         const diffHours = Math.floor(diffInMinutes / 60);
        //         const diffMinutes = diffInMinutes % 60;

        //         const height = step * diffHours + step * diffMinutes / 60;


        //         // if (this.hasMulticolumnSameDay(start)) {
        //             if (divElement.getAttribute('data-column') === '1') {
        //                 const calculated = ((document.getElementsByClassName('fc-timeline-slot')[0] as HTMLDivElement).offsetWidth ?? 0) / 2;
        //                 divElement.style.marginLeft = `${calculated}px`;
        //                 // divElement.style.left = `${calculated}px`;
        //                 divElement.classList.add('column-2');
        //             }
        //         // }

        //         if (this.hasMulticolumnSameDay(start)) {
        //             divElement.style.width = (document.getElementsByClassName('fc-timeline-slot')[0] as HTMLDivElement).offsetWidth / 2 + 'px';
        //         }
        //         divElement.style.top = `${offset}px`;
        //         element.style.height = `${height}px`;
        //     }
        // });
    }

    // it looks at all the events to see if there is an event that is at the same time and set column value
    setEventColumnProperty(events: Array<any>): Array<any> {
        // ez még később finomhangolásra szorul
        events.forEach((event: any, index: number) => {
            event.column = 0;
            if (index !== 0) {
                const previousEvent = events[index - 1];
                if (event.start < previousEvent.end) {
                    if (previousEvent.column === 1 && event.start > events[index - 2].end) {
                        event.column = 0;
                    } else {
                        event.column = 1;
                    }
                }
            }
        });

        return events;
    }

    // checks whether there are two events on the given day that are at the same time
    hasMulticolumnSameDay(date: Date): boolean {
        return (this.events$?.value as Array<any>).filter(event => {
            return isSameDay(new Date(event.start), date);
        }).some((event: any, index: number) => event.column === 1);
    }

    openModal(): void {
        this.editModal.open();
    }

    contextMenuEditClick(): void {
        this.contextMenuVisible = false;
        this.eventClick.emit(this.contextMenuSelectedEvent);
        this.openModal();
    }

    contextMenuDeleteClick(): void {
        this.contextMenuVisible = false;
        this.eventDelete.emit(this.contextMenuSelectedEvent);
    }
}
