import { ApiProperty } from "@nestjs/swagger";

export class FaceDto {
    @ApiProperty({description: 'Id of the Photo to facetag'})
    readonly idPhoto: number;
    @ApiProperty({description: 'Id of the People to facetag'})
    readonly idPeople: number;
    @ApiProperty({description: 'Relative position x of the face'})
    readonly x: number;
    @ApiProperty({description: 'Relative position y of the face'})
    readonly y: number;
    @ApiProperty({description: 'Relative height of the face'})
    readonly h: number;
    @ApiProperty({description: 'Relative width of the face'})
    readonly w: number;
}