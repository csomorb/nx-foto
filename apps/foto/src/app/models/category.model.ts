import { VideoModel } from './video.model';
import { PhotoModel } from './photo.model';
import { AlbumModel } from './album.model';
import { TagModel } from './tag.model';
import { FaceModel } from './face.model';
import { PeopleModel } from './people.model';
import { ItemModel } from './item.model';

export interface CategoryModel {
  id:number;
  title: string;
  description?: string;
  coverPhoto?: PhotoModel;
  photos?: Array<PhotoModel>;
  videos?: Array<VideoModel>;
  listAlbum?: Array<AlbumModel>;
  listTag?: Array<TagModel>;
  listPeople?: Array<PeopleModel>;
  faces?: Array<FaceModel>;
  items?: Array<ItemModel>;
}
