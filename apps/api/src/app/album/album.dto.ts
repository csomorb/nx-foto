import { ApiProperty } from "@nestjs/swagger";

export class AlbumDto {
    @ApiProperty({description: 'Title of the album'})
    readonly title: string;
    @ApiProperty({description: 'Description of the album of the album'})
    readonly description: string;
    @ApiProperty({description: 'Id of the parent album, if not exist in db or not provided album is placed in the root folder', type: Number})
    readonly idParent?: number;
}

export class DownloadDto{
    readonly idVideos?: Array<number>;
    readonly idPhotos?: Array<number>;
}