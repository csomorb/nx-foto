import { Controller, Post, UseInterceptors, UploadedFiles, Body, Delete, Param, Put, Get, UseGuards } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { Photo } from './photo.entity';
import { PhotoDto } from './photo.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('photos')
export class PhotoController {
    constructor(private photoService: PhotoService) {}

    @Post('upload')
    @UseGuards(AuthGuard())
    @UseInterceptors(AnyFilesInterceptor())
    uploadFile(@UploadedFiles() files,@Body() photoDto: PhotoDto) {
        return this.photoService.uploadPhoto(files,photoDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    update(@Body() photoDto: PhotoDto, @Param('id') id): Promise<Photo> {
     return this.photoService.update(id, photoDto);
    }

    @Put(':id/rotate-left')
    @UseGuards(AuthGuard())
    rotateLeft(@Param('id') id): Promise<Photo> {
     return this.photoService.rotateLeft(id);
    }

    @Put(':id/rotate-right')
    @UseGuards(AuthGuard())
    rotateRight(@Param('id') id): Promise<Photo> {
     return this.photoService.rotateRight(id);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    findPhoto(@Param('id') id: string): Promise<Photo> {
        return this.photoService.findOne(id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async remove(@Param('id') id: string) {
        return this.photoService.remove(id);
    }

    @Put(':idPhoto/move-to-album/:idAlbum')
    @UseGuards(AuthGuard())
    moveToAlbum(@Param('idPhoto') idPhoto,  @Param('idAlbum') idAlbum): Promise<Photo> {
     return this.photoService.moveToAlbum(idPhoto, idAlbum);
    }

    @Put(':idPhoto/copy-to-album/:idAlbum')
    @UseGuards(AuthGuard())
    copyToAlbum(@Param('idPhoto') idPhoto,  @Param('idAlbum') idAlbum): Promise<Photo> {
     return this.photoService.copyToAlbum(idPhoto, idAlbum);
    }

    @Put(':idPhoto/tags/:idTag')
    @UseGuards(AuthGuard())
    addTag(@Param('idPhoto') idPhoto,  @Param('idTag') idTag): Promise<Photo> {
     return this.photoService.addTag(idPhoto, idTag);
    }

    @Delete(':idPhoto/tags/:idTag')
    @UseGuards(AuthGuard())
    deleteTag(@Param('idPhoto') idPhoto,  @Param('idTag') idTag): Promise<Photo> {
     return this.photoService.deleteTag(idPhoto, idTag);
    }

}
