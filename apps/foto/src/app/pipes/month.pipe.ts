import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'month'
})
export class MonthPipe implements PipeTransform {

  transform(month: number): string {
    switch(month){
      case 0: return "Janvier";
      case 1: return "Février";
      case 2: return "Mars";
      case 3: return "Avril";
      case 4: return "Mai";
      case 5: return "Juin";
      case 6: return "Juillet";
      case 7: return "Aout";
      case 8: return "September";
      case 9: return "Octobre";
      case 10: return "Novembre";
      default: return "Décembre";
    }
  }

}
