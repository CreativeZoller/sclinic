import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterList',
  pure: false,
})
export class FilterListPipe implements PipeTransform {
  transform(list: any[], filterFn: (item: any) => boolean): any[] {
    return list.filter(filterFn);;
  }
}
