import { PeopleModel } from './people.model';
import { PhotoModel } from './photo.model';

export interface FaceModel{
  idPeople:number;
  facesId:number;
  idPhoto:number;
  x:number;
  y:number;
  h:number;
  w:number;
  show:boolean;
  photo?:PhotoModel;
  people?:PeopleModel;
}
