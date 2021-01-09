import { TagModel } from './tag.model';
import { PeopleModel } from './people.model';
import { AlbumModel } from './album.model';
import { VideoModel } from './video.model';
import { PhotoModel } from './photo.model';



interface Item extends PhotoModel, VideoModel {
}

export type ItemModel = Partial<Item>;
