import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "min",
    pure: true
})
export class MinPipe implements PipeTransform {
  transform(value1: number, value2: number): number {
    return Math.min(value1, value2);
  }
}
