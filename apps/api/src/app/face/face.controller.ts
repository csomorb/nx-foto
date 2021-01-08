import { Controller, Post, Body, Param, Put, Delete, UseGuards} from '@nestjs/common';
import { FaceDto } from './face.dto';
import { FaceService } from './face.service';
import { Face } from './face.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('faces')
export class FaceController {

    constructor(private faceService: FaceService) {}

    @Post()
    @UseGuards(AuthGuard())
    async createFaceTag(@Body() facveDto: FaceDto): Promise<any>{
        let v;
        try {
            v = await this.faceService.createface(facveDto);
        } catch(e) { //TODO: gérer les autres erreurs !
            console.log(e);
            throw e;
        }
        return v;
    }

    @Put(':idFace/people/:idPeople')
    @UseGuards(AuthGuard())
    update(@Param('idPeople') idPeople, @Param('idFace') idFace): Promise<Face> {
     return this.faceService.updateface(idFace, idPeople);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async remove(@Param('id') id: string) {
        return this.faceService.deleteface(id);
    }

}
