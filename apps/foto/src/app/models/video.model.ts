import { AlbumModel } from './album.model';
import { FaceModel } from './face.model';
import { ItemModel } from './item.model';
import { PeopleModel } from './people.model';
import { TagModel } from './tag.model';

export interface VideoModel{
  idVideo: number;

  lat?: number;
  long?: number;
  title: string;
  description: string;
  weight: number;
  height: number;
  width: number;
  createAt: Date;
  updatedAt: Date;
  shootDate: Date;
  tags?: Array<TagModel>;
  peoples?: Array<PeopleModel>;
  albums?: Array<AlbumModel>;
  faces: Array<FaceModel>;

  originalFileName: string;
}
