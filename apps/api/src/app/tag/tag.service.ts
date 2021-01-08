import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { DownloadTagDto, TagDto } from './tag.dto';
import { Photo } from '../photo/photo.entity';
import { PhotoService } from '../photo/photo.service';
import * as fs from 'fs';
import * as path from 'path';
import * as Mkdirp from  'mkdirp';
import * as AdmZip from 'adm-zip';
import { VideoService } from '../video/video.service';


@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
        @Inject(forwardRef(() => PhotoService))
        private photoService: PhotoService,
        @Inject(forwardRef(() => VideoService))
        private videoService: VideoService
      ) {}

      findAll(): Promise<Tag[]> {
        return this.tagRepository.find();
      }

      findOne(id: string): Promise<Tag> {
        return this.tagRepository.findOne(id, { relations: ["coverPhoto"] });
      }

      findTagWithPhotos(id: string): Promise<Tag> {
        return this.tagRepository.findOne(id, { relations: ["photos","videos"] });
      }

      async remove(id: string): Promise<void> {
        await this.tagRepository.delete(id);
      }

      async update(id: string, tagDto: TagDto): Promise<Tag> {
        const tag: Tag = await this.tagRepository.findOne(id);
        return await this.tagRepository.save({...tag, ...tagDto});
      }

      async create(tagDto: TagDto): Promise<Tag> {
        const tag = new Tag();
        tag.title = tagDto.title;
        tag.description = tagDto.description;
        if(tagDto.idCoverPhoto){
            const coverPhoto: Photo = await this.photoService.findOne(''+tagDto.idCoverPhoto);
            tag.coverPhoto = coverPhoto;
        }
        return this.tagRepository.save(tag);
      }

      async setCover(idTag: string,idPhoto: string): Promise<Tag> {
        const tag: Tag = await this.tagRepository.findOne(idTag);
        if (idPhoto === '0'){
          tag.coverPhoto = null;
        }
        else{
          const coverPhoto: Photo = await this.photoService.findOne(idPhoto);
          tag.coverPhoto = coverPhoto;
        }
        return this.tagRepository.save(tag);
      }

       /**
       * Supprime les photos de couverture pour une id de Photo donné
       */
      async deleteCoverPhotosFromTag(idCoverPhoto: string){
        const listTag: Tag[] = await  this.tagRepository.find({ relations: ["coverPhoto"], where: { coverPhoto: idCoverPhoto } });
        for(let i = 0 ; i < listTag.length; i++){
          listTag[i].coverPhoto = null;
          await this.tagRepository.save(listTag[i]);
        }
      }

      async download(id: string){
        const tmp = Date.now();
        const tag = await this.tagRepository.findOne(id, { relations: ["photos","videos"] });
        const title = tag.title.replace(/\s/g, '_');
        const tmpFolder = path.join(__dirname, '..', '..', 'files','tmp',''+tmp);
        const imgFolder = path.join(__dirname, '..', '..', 'files');
        const videoFolder = path.join(__dirname, '..', '..', 'files','videos');
        await Mkdirp.sync(tmpFolder);
        tag.photos.map(p =>{
          fs.copyFileSync(path.join(imgFolder,p.srcOrig),path.join(tmpFolder,p.originalFileName));
        });
        tag.videos.map(v =>{
          fs.copyFileSync(path.join(videoFolder,''+v.idVideo,''+v.idVideo+'.mp4'),path.join(tmpFolder,v.originalFileName.split('.')[0]+'.mp4'));
        })
        const zip = new AdmZip();
        zip.addLocalFolder(tmpFolder,title);
        // zip.writeZip(album.title);
        try {
          fs.rmdir(tmpFolder, { recursive: true }, (err) => {
              if (err) {
                  throw err;
              }
              console.log(`${tmpFolder} is deleted!`);
          });
        } catch(err) {
            console.error(err);
        }
        return {buffer: zip.toBuffer(), filename: title + '.zip'};
      }

      async downloadItems(id:string,items: DownloadTagDto){
        const tmp = Date.now();
        const tag = await this.tagRepository.findOne(id);
        const photos = await this.photoService.findList(items.idPhotos);
        const videos = await this.videoService.findList(items.idVideos);
        const title = tag.title.replace(/\s/g, '_');
        const tmpFolder = path.join(__dirname, '..', '..', 'files','tmp',''+tmp);
        const imgFolder = path.join(__dirname, '..', '..', 'files');
        const videoFolder = path.join(__dirname, '..', '..', 'files','videos');
        await Mkdirp.sync(tmpFolder);
        photos.map(p =>{
          fs.copyFileSync(path.join(imgFolder,p.srcOrig),path.join(tmpFolder,p.originalFileName));
        });
        videos.map(v =>{
          fs.copyFileSync(path.join(videoFolder,''+v.idVideo,''+v.idVideo+'.mp4'),path.join(tmpFolder,v.originalFileName.split('.')[0]+'.mp4'));
        })
        const zip = new AdmZip();
        zip.addLocalFolder(tmpFolder,title);
        // zip.writeZip(album.title);
        try {
          fs.rmdir(tmpFolder, { recursive: true }, (err) => {
              if (err) {
                  throw err;
              }
              console.log(`${tmpFolder} is deleted!`);
          });
        } catch(err) {
            console.error(err);
        }
        return {buffer: zip.toBuffer(), filename: title + '.zip'};
      }


}
