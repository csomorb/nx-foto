import { PathLocationStrategy } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AlbumModel } from '../models/album.model';
import { PhotoModel } from '../models/photo.model';

@Pipe({
  name: 'finduniqalbum'
})
export class FinduniqalbumPipe implements PipeTransform {

  transform(photos: Array<PhotoModel>): Array<AlbumModel> {
    let a = [];
    for (let i=0; i < photos.length; i++){
      for (let ai = 0; ai < photos[i].albums.length; ai++){
        if (a.findIndex( al => al.id === photos[i].albums[ai].id) === -1){
          a.push(photos[i].albums[ai]);
        }
      }
    }
    console.log(a);
    return a;
  }

}
