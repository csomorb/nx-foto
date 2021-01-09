import { ItemModel } from './item.model';
import { FaceModel } from './face.model';
import { TagModel } from './tag.model';
import { PeopleModel } from './people.model';
import { AlbumModel } from './album.model';

export interface PhotoModel{
  idPhoto: number;
  src150: string;
  src320?: string;
  src640?: string;
  src1280?: string;
  src1920?: string;
  srcOrig: string;
  lat?: number;
  long?: number;
  alti?: number;
  facesToTag: Array<any>;
  faces: Array<FaceModel>;

  originalFileName: string;
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
}
