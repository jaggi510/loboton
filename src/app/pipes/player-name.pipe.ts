import { Pipe, PipeTransform } from '@angular/core';
import { padEnd, truncate } from 'lodash-es';
@Pipe({
  name: 'playerName',
  standalone: true
})
export class PlayerNamePipe implements PipeTransform {

  transform(value: string, length = 13): string {
    const text = truncate(padEnd(value, length, ' '), { length });
    return text;
  }

}
