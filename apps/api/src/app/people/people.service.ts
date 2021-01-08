import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { People } from './people.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DownloadPeopleDto, PeopleDto } from './people.dto';
import { PhotoService } from '../photo/photo.service';
import { Photo } from '../photo/photo.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as Mkdirp from  'mkdirp';
import * as AdmZip from 'adm-zip';
import { VideoService } from '../video/video.service';
import { FaceService } from '../face/face.service';


@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(People)
        private peopleRepository: Repository<People>,
        @Inject(forwardRef(() => PhotoService))
        private photoService: PhotoService,
        @Inject(forwardRef(() => VideoService))
        private videoService: VideoService,
        @Inject(forwardRef(() => FaceService))
        private faceService: FaceService
      ) {}

      findAll(): Promise<People[]> {
        return this.peopleRepository.find({relations: ["coverPhoto"]});
      }

      findOne(id: string): Promise<People> {
        return this.peopleRepository.findOne(id, {relations: ["coverPhoto"]});
      }

      findAllPeopleWithPhotos(): Promise<People[]> {
        return this.peopleRepository.find({relations: ["faces", "coverPhoto"]});
        return this.peopleRepository.createQueryBuilder("people")
     //   .leftJoinAndSelect("people.coverPhoto", "coverPhoto")
        .leftJoin('people.peopleToPhoto', 'scr', 'scr.idPeople = people.id')
        .leftJoinAndSelect('photo', 'photo', 'photo.idPhoto = scr.idPhoto')
        .getMany();
        return this.peopleRepository.find({ relations: ["coverPhoto"] });
      }

      findPeopleWithPhotos(id: string): Promise<People> {
        return this.peopleRepository.findOne(id,{ relations: ["faces.photo","faces", "coverPhoto","videos"] });
        return this.peopleRepository.createQueryBuilder("people")
     //   .leftJoinAndSelect("people.coverPhoto", "coverPhoto")
        .leftJoin('people_to_photo', 'scr', 'scr.idPeople = people.id')
        .leftJoinAndSelect('photo', 'photo', 'photo.idPhoto = scr.idPhoto')
        .where("people.id = :id", { id: id })
        .getOne();
        // return this.peopleRepository.findOne(id, { relations: ["peopleToPhoto","coverPhoto"] });
      }

      async remove(id: string): Promise<void> {
        //TODO: les photos tagés
        await this.faceService.deletePeople(id);

        await this.peopleRepository.delete(id);
      }

      async update(id: string, peopleDto: PeopleDto): Promise<People> {
        const people: People = await this.peopleRepository.findOne(id);
        return await this.peopleRepository.save({...people, ...peopleDto});
      }

      async create(peopleDto: PeopleDto): Promise<People> {
        const people = new People();
        people.title = peopleDto.title;
        people.description = peopleDto.description;
        if (peopleDto.birthDay){
            people.birthDay = peopleDto.birthDay;
        }
        if(peopleDto.idCoverPhoto){
          people.coverPhoto = await this.photoService.findOne(''+peopleDto.idCoverPhoto);
        }
        return this.peopleRepository.save(people);
      }

      async setCover(idPeople: string,idPhoto: string): Promise<People> {
        const people: People = await this.peopleRepository.findOne(idPeople);
        if (idPhoto === '0'){
          people.coverPhoto = null;
        }
        else{
          const coverPhoto: Photo = await this.photoService.findOne(idPhoto);
          people.coverPhoto = coverPhoto;
        }
        return this.peopleRepository.save(people);
      }

       /**
       * Supprime les photos de couverture pour une id de Photo donné
       */
      async deleteCoverPhotosFromPeople(idCoverPhoto: string){
        const listPeople: People[] = await  this.peopleRepository.find({ relations: ["coverPhoto"], where: { coverPhoto: idCoverPhoto } });
        for(let i = 0 ; i < listPeople.length; i++){
          listPeople[i].coverPhoto = null;
          await this.peopleRepository.save(listPeople[i]);
        }
      }

      async download(id: string){
        const tmp = Date.now();
        const people = await this.peopleRepository.findOne(id, { relations: ["faces","faces.photo","videos"] });
        const title = people.title.replace(/\s/g, '_');
        const tmpFolder = path.join(__dirname, '..', '..', 'files','tmp',''+tmp);
        const imgFolder = path.join(__dirname, '..', '..', 'files');
        const videoFolder = path.join(__dirname, '..', '..', 'files','videos');
        await Mkdirp.sync(tmpFolder);
        people.faces.map(f =>{
          fs.copyFileSync(path.join(imgFolder,f.photo.srcOrig),path.join(tmpFolder,f.photo.originalFileName));
        });
        people.videos.map(v =>{
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

      async downloadItems(id:string,items: DownloadPeopleDto){
        const tmp = Date.now();
        const people = await this.peopleRepository.findOne(id);
        const photos = await this.photoService.findList(items.idPhotos);
        const videos = await this.videoService.findList(items.idVideos);
        const title = people.title.replace(/\s/g, '_');
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
