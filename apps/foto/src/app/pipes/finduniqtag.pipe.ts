import { Pipe, PipeTransform } from '@angular/core';
import { PhotoModel } from '../models/photo.model';
import { TagModel } from '../models/tag.model';

@Pipe({
  name: 'finduniqtag'
})
export class FinduniqtagPipe implements PipeTransform {

  transform(photos: Array<PhotoModel>): Array<TagModel> {
    let a = [];
    for (let i=0; i < photos.length; i++){
      for (let ai = 0; ai < photos[i].tags.length; ai++){
        if (a.findIndex( al => al.id === photos[i].tags[ai].id) === -1){
          a.push(photos[i].tags[ai]);
        }
      }
    }
    return a;
  }

}
