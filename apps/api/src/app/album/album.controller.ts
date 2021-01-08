/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './album.entity';
import { AlbumDto, DownloadDto } from './album.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('albums')
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    @Post()
    @UseGuards(AuthGuard())
    create(@Body() albumDto: AlbumDto): Promise<Album> {
      return this.albumService.create(albumDto);
    }

    @Get()
    @UseGuards(AuthGuard())
    findAll(): Promise<Album[]>  {
    //return this.albumService.findAll();
        return this.albumService.findAlbumTree();
    }

    @Get('roots')
    @UseGuards(AuthGuard())
    findRoots(): Promise<Album[]>  {
        return this.albumService.findRootAlbums();
    }

    @Get('covers')
    @UseGuards(AuthGuard())
    findCovers(): Promise<Album[]>  {
        return this.albumService.findAll();
    }


    @Get('photos-child/:limit')
    @UseGuards(AuthGuard())
    findRootsWithChildPhotos(@Param('limit') limit: string): Promise<Album[]> {
        return this.albumService.findRootsWithChildrenPhotos(limit);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    findAlbum(@Param('id') id: string): Promise<Album> {
        return this.albumService.findOne(id);
    }

    @Get(':id/photos')
    @UseGuards(AuthGuard())
    findAlbumWithPhotos(@Param('id') id: string): Promise<Album> {
        return this.albumService.findAlbumWithPhotos(id);
    }

    @Get(':id/download')
    @UseGuards(AuthGuard())
    async download(@Param('id') id: string, @Res() res): Promise<any> {
        const zip = await this.albumService.download(id);
        res.set('Content-Type','application/octet-stream');
        res.set('Content-Disposition',`attachment; filename=${zip.filename}`);
        res.set('Content-Length',zip.buffer.length);
        res.send(zip.buffer);
    }

    @Put(':id/download')
    @UseGuards(AuthGuard())
    async downloadItems(@Param('id') id: string, @Res() res, @Body() items: DownloadDto): Promise<any> {
        const zip = await this.albumService.downloadItems(id,items);
        res.set('Content-Type','application/octet-stream');
        res.set('Content-Disposition',`attachment; filename=${zip.filename}`);
        res.set('Content-Length',zip.buffer.length);
        res.send(zip.buffer);
    }


    @Get(':id/photos-child/:limit')
    @UseGuards(AuthGuard())
    findAlbumWithChildPhotos(@Param('id') id: string,@Param('limit') limit: string): Promise<Album[]> {
        return this.albumService.findAlbumWithChildrenPhotos(id,limit);
    }

    @Get(':id/childrens')
    @UseGuards(AuthGuard())
    findAlbumChildrens(@Param('id') id: string): Promise<Album[]> {
        return this.albumService.findChildrens(id);
    }

    @Get(':id/childrens-tree')
    @UseGuards(AuthGuard())
    findAlbumChildrensTree(@Param('id') id: string): Promise<Album> {
        return this.albumService.findChildrensTree(id);
    }

    @Get(':id/parents')
    @UseGuards(AuthGuard())
    findAlbumParents(@Param('id') id: string): Promise<Album[]> {
        return this.albumService.findParents(id);
    }

    @Get(':id/parents-tree')
    @UseGuards(AuthGuard())
    findAlbumParentsTree(@Param('id') id: string): Promise<Album> {
        return this.albumService.findParentsTree(id);
    }

    @Post(':idAlbum/cover/:idPhoto')
    @UseGuards(AuthGuard())
    createCover(@Param('idAlbum') idAlbum: string, @Param('idPhoto') idPhoto: string ): Promise<Album> {
      return this.albumService.setCover(idAlbum,idPhoto);
    }

    @Put(':idAlbum/cover/:idPhoto')
    @UseGuards(AuthGuard())
    updateCover(@Param('idAlbum') idAlbum: string, @Param('idPhoto') idPhoto: string ): Promise<Album> {
      return this.albumService.setCover(idAlbum,idPhoto);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    update(@Body() albumDto: AlbumDto, @Param('id') id): Promise<Album> {
     return this.albumService.update(id, albumDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async remove(@Param('id') id: string) {
        let v;
        try {
            v = await this.albumService.remove(id);
        } catch(e) { //TODO: gérer les autres erreurs !
            if (e.code === 'ER_ROW_IS_REFERENCED_2'){
                throw new HttpException({
                    status: HttpStatus.FAILED_DEPENDENCY,
                    error: 'Supprimez d abord les sous albums',
                  }, HttpStatus.FAILED_DEPENDENCY);
            }
            if (e.code === 'ALBUM_NOT_EMPTY'){
                throw new HttpException({
                    status: HttpStatus.FAILED_DEPENDENCY,
                    error: e.message,
                  }, HttpStatus.FAILED_DEPENDENCY);
            }
            throw e;
        }
        return v;
    }
}
