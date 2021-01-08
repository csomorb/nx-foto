import { ApiProperty } from "@nestjs/swagger";

export class TagDto {
    @ApiProperty({description: 'Title of the tag'})
    readonly title: string;
    @ApiProperty({description: 'Description of the tag'})
    readonly description: string;
    @ApiProperty({description: 'Id of the cover Photo', type: Number})
    readonly idCoverPhoto?: number;
}

export class DownloadTagDto{
    readonly idVideos?: Array<number>;
    readonly idPhotos?: Array<number>;
}