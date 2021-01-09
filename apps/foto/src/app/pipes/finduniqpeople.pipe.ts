import { Pipe, PipeTransform } from '@angular/core';
import { PeopleModel } from '../models/people.model';
import { PhotoModel } from '../models/photo.model';

@Pipe({
  name: 'finduniqpeople'
})
export class FinduniqpeoplePipe implements PipeTransform {

  transform(photos: Array<PhotoModel>): Array<PeopleModel> {
    let a = [];
    for (let i=0; i < photos.length; i++){
      for (let ai = 0; ai < photos[i].peoples.length; ai++){
        if (a.findIndex( al => al.id === photos[i].peoples[ai].id) === -1){
          a.push(photos[i].peoples[ai]);
        }
      }
    }
    return a;
  }

}
