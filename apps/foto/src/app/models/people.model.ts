import { CategoryModel } from './category.model';
import { FaceModel } from './face.model';

export interface PeopleModel extends CategoryModel{
  birthDay?: Date;
}
