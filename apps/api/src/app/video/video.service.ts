import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';
import { promises as fsd } from 'fs'
import { AlbumService } from '../album/album.service';
import { PeopleService } from '../people/people.service';
import { TagService } from '../tag/tag.service';
import { Repository } from 'typeorm';
import { VideoDto } from './video.dto';
import { Video } from './video.entity';
import { Album } from '../album/album.entity';
import * as Mkdirp from  'mkdirp';
import { environment } from '../../environments/environment';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video)
        private videoRepository: Repository<Video>,
        @Inject(forwardRef(() => AlbumService))
        private albumService: AlbumService,
        @Inject(forwardRef(() => PeopleService))
        private peopleService: PeopleService,
        @Inject(forwardRef(() => TagService))
        private tagService: TagService
    ) {
        ffmpeg.setFfprobePath(environment.ffprobePath);
        ffmpeg.setFfmpegPath(environment.ffmpegPath);
        // ffmpeg.setFfmpegPath(path.join(__dirname, '/ffmpeg/bin/ffmpeg.exe'));
    }

    findOne(id: string): Promise<Video> {
        return this.videoRepository.findOne(id);
    }


    findList(list): Promise<Array<Video>>{
        return this.videoRepository.findByIds(list);
    }

    async update(id: string, videoDto: VideoDto): Promise<Video> {
        const videoSrc: Video = await this.videoRepository.findOne(id);
        return await this.videoRepository.save({...videoSrc, ...videoDto});
    }

    async copyToAlbum(idVideo:string, idAlbum: string){
        const video = await this.videoRepository.findOne(idVideo);
        const album = await this.albumService.findOne(idAlbum);
        video.albums.push(album);
        return this.videoRepository.save(video);
    }

    async moveToAlbum(idVideo:string, idAlbum: string){
        const video = await this.videoRepository.findOne(idVideo);
        const album = await this.albumService.findOne(idAlbum);
        video.albums = [album];
        return this.videoRepository.save(video);
    }

    async addTag(idVideo:string, idTag: string){
        const video = await this.videoRepository.findOne(idVideo);
        const tag = await this.tagService.findOne(idTag);
        video.tags.push(tag);
        return this.videoRepository.save(video);
    }

    async deleteTag(idVideo:string, idTag: string){
        const video = await this.videoRepository.findOne(idVideo);
        const index = video.tags.findIndex(t => t.id == parseInt(idTag));
        if (index !== -1){
            video.tags.splice(index,1);
        }
        return this.videoRepository.save(video);
    }

    async addPeople(idVideo:string, idPeople: string){
        const video = await this.videoRepository.findOne(idVideo);
        const people = await this.peopleService.findOne(idPeople);
        video.peoples.push(people);
        return this.videoRepository.save(video);
    }

    async deletePeople(idVideo:string, idPeople: string){
        const video = await this.videoRepository.findOne(idVideo);
        const index = video.peoples.findIndex(t => t.id == parseInt(idPeople));
        if (index !== -1){
            video.peoples.splice(index,1);
        }
        return this.videoRepository.save(video);
    }

    async remove(id: string): Promise<void> {
        const videoToDelete: Video = await this.videoRepository.findOne(id);
        if (!videoToDelete.idVideo)
            return;
        const videoFolder = path.join(__dirname, '..', '..','..', 'files','videos', videoToDelete.idVideo.toString());
        try {
            fs.rmdir(videoFolder, { recursive: true }, (err) => {
                if (err) {
                    throw err;
                }
                console.log(`${videoFolder} is deleted!`);
            });
        } catch(err) {
            console.error(err);
        }
        await this.videoRepository.delete(id);
    }


    async uploadVideo(files, videoDto: VideoDto){
        let video = new Video();
        // console.log(files[0]);
        video.title = files[0].originalname;
        video.weight = files[0].size;
        video.originalFileName = files[0].originalname;
        if (videoDto.title)
            video.title = videoDto.title;
        if (videoDto.description)
            video.description = videoDto.description;
        if (videoDto.idAlbum){
            const album: Album = await this.albumService.findOne(''+videoDto.idAlbum);
            video.albums = [album];
        }
        video = await this.videoRepository.save(video);
        const uploadFolder = path.join(__dirname, '..', '..','..', 'files','videos', video.idVideo.toString());
        await Mkdirp.sync(uploadFolder);
        const srcOrig = video.idVideo.toString()+'.'+files[0].mimetype.split('/')[1];

        try {
            await fsd.writeFile(path.join(uploadFolder,srcOrig),files[0].buffer);
        } catch (error){
            console.error(error);
        }
        const videoInfo: any = await this.getVideoInfo(path.join(uploadFolder,srcOrig));
        if (videoInfo.creationTime){
            video.shootDate = new Date(videoInfo.creationTime);
            console.log(video.shootDate);
            console.log(videoInfo.creationTime);
        }
        if (videoInfo.location){
            video.lat = parseFloat(videoInfo.location.substring(0,7));
            video.long = parseFloat(videoInfo.location.substring(8,16));
        }
        if (videoInfo.durationInSeconds){
            video.duration = videoInfo.durationInSeconds;
        }
        if(videoInfo.width){
            video.width = videoInfo.width;
        }
        if(videoInfo.height){
            video.height = videoInfo.height;
        }

        const frameIntervalInSeconds = Math.floor(video.duration / 4);

        ffmpeg()
            .input(path.join(uploadFolder,srcOrig))
            .outputOptions([`-vf fps=1/${frameIntervalInSeconds}`])
            .output(path.join(uploadFolder,'t%1d.jpg'))
            .on('end', () => { // Si pas mp4 => on convertir en pm4
                if (!files[0].mimetype.includes('mp4')){
                    ffmpeg(path.join(uploadFolder,srcOrig))
                    .toFormat('mp4')
                    .on("error", (err) => {
                        console.log(err);
                    })
                    .on("end", () => {
                        fs.unlinkSync(path.join(uploadFolder,srcOrig));
                    })
                    .saveToFile(path.join(uploadFolder,video.idVideo.toString()+'.mp4'));
                }
            })
            .on('error', (err)=> {
                console.log(err);
            })
            .run();
        return await this.videoRepository.save(video);
    }

    getVideoInfo(inputPath: string){
        return new Promise((resolve, reject) => {
          return ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
            if (error) {
              return reject(error);
            }
            console.log(videoInfo);
            const { width, height} = videoInfo.streams.find( s => s.codec_type === 'video');
            const { duration } = videoInfo.format;
            let creationTime = null;
            let location = null;
            if(videoInfo.format.tags['location']){
                location = videoInfo.format.tags['location'];
            }
            if(videoInfo.format.tags['creation_time']){
                creationTime = videoInfo.format.tags['creation_time'];
            }
            return resolve({
              width,
              height,
              creationTime,
              location,
              durationInSeconds: Math.floor(duration),
            });
          });
        });
    }


}
