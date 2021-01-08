import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PhotoDto {
    @ApiProperty({description: 'Title of the photo'})
    readonly title?: string;
    @ApiProperty({description: 'Description of the Photo'})
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