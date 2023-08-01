import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFilter',
    pure: true
})
export class DateFilterPipe implements PipeTransform {
    defaultMinDate: Date = new Date("1900.01.01");

    transform(value: Date | null, minDate: Date | string | undefined, maxDate: Date | string | undefined): boolean {
        let date = value || new Date();

        minDate = typeof minDate === 'string' ? new Date(minDate) : minDate;
        maxDate = typeof maxDate === 'string' ? new Date(maxDate) : maxDate;

        let afterMinDate = minDate ? date > minDate : true;
        let beforeMaxDate = maxDate ? date < maxDate : true;
        let afterDefaultMinDate = date > this.defaultMinDate;

        return afterDefaultMinDate && afterMinDate && beforeMaxDate;
    }
}
