import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { VideoDto } from './video.dto';
import { Video } from './video.entity';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
    constructor(private videoService: VideoService) {}

    @Post('upload')
    @UseGuards(AuthGuard())
    @UseInterceptors(AnyFilesInterceptor())
    uploadFile(@UploadedFiles() files,@Body() videoDto: VideoDto) {
        return this.videoService.uploadVideo(files,videoDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    update(@Body() videoDto: VideoDto, @Param('id') id): Promise<Video> {
     return this.videoService.update(id, videoDto);
    }

    // @Put(':id/rotate-left')
    // rotateLeft(@Param('id') id): Promise<Video> {
    //  return this.videoService.rotateLeft(id);
    // }

    // @Put(':id/rotate-right')
    // rotateRight(@Param('id') id): Promise<Video> {
    //  return this.videoService.rotateRight(id);
    // }

    @Get(':id')
    @UseGuards(AuthGuard())
    findVideo(@Param('id') id: string): Promise<Video> {
        return this.videoService.findOne(id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async remove(@Param('id') id: string) {
        return this.videoService.remove(id);
    }

    @Put(':idVideo/move-to-album/:idAlbum')
    @UseGuards(AuthGuard())
    moveToAlbum(@Param('idVideo') idVideo,  @Param('idAlbum') idAlbum): Promise<Video> {
     return this.videoService.moveToAlbum(idVideo, idAlbum);
    }

    @Put(':idVideo/copy-to-album/:idAlbum')
    @UseGuards(AuthGuard())
    copyToAlbum(@Param('idVideo') idVideo,  @Param('idAlbum') idAlbum): Promise<Video> {
     return this.videoService.copyToAlbum(idVideo, idAlbum);
    }

    @Put(':idVideo/tags/:idTag')
    @UseGuards(AuthGuard())
    addTag(@Param('idVideo') idVideo,  @Param('idTag') idTag): Promise<Video> {
     return this.videoService.addTag(idVideo, idTag);
    }

    @Delete(':idVideo/tags/:idTag')
    @UseGuards(AuthGuard())
    deleteTag(@Param('idVideo') idVideo,  @Param('idTag') idTag): Promise<Video> {
     return this.videoService.deleteTag(idVideo, idTag);
    }

    @Put(':idVideo/peoples/:idPeople')
    @UseGuards(AuthGuard())
    addPeople(@Param('idVideo') idVideo,  @Param('idPeople') idPeople): Promise<Video> {
     return this.videoService.addPeople(idVideo, idPeople);
    }

    @Delete(':idVideo/peoples/:idPeople')
    @UseGuards(AuthGuard())
    deletePeople(@Param('idVideo') idVideo,  @Param('idPeople') idPeople): Promise<Video> {
     return this.videoService.deletePeople(idVideo, idPeople);
    }
    
}
