import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional } from "class-validator";
import { Type } from 'class-transformer';

export class PeopleDto {
    @ApiProperty({description: 'Name'})
    readonly title: string;
    @ApiProperty({description: 'Some word about the people'})
    readonly description: string;
    @ApiProperty({description: 'Birthday date'})
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly birthDay?: Date;
    @ApiProperty({description: 'Id of the profil photo', type: Number})
    readonly idCoverPhoto?: number;
}

export class DownloadPeopleDto{
    readonly idVideos?: Array<number>;
    readonly idPhotos?: Array<number>;
}