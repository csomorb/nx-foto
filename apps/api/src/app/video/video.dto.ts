import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class VideoDto {
    @ApiProperty({description: 'Title of the video'})
    readonly title?: string;
    @ApiProperty({description: 'Description of the video'})
    readonly description?: string;
    @ApiProperty({description: 'Id of the album', type: Number})
    readonly idAlbum?: number;
    @ApiProperty({description: 'Latitude'})
    readonly lat?: number;
    @ApiProperty({description: 'Longuitude'})
    readonly long?: number;
    @ApiProperty({description: 'Shoot date'})
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly shootDate?: Date; 

}