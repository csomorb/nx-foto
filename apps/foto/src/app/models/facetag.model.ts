import { PeopleModel } from './people.model';

export interface FaceTagModel extends PeopleModel{
  x:number;
  y:number;
  h:number;
  w:number;
}
