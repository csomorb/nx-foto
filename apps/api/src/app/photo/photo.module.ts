import { Module, forwardRef } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from '../album/album.module';
import { FaceModule } from '../face/face.module';
import { TagModule } from '../tag/tag.module';
import { PeopleModule } from '../people/people.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([Photo]),
    forwardRef(() => AlbumModule),
    forwardRef(() => TagModule),
    forwardRef(() => PeopleModule),
    forwardRef(() => FaceModule)
  ],
  providers: [PhotoService],
  controllers: [PhotoController],
  exports: [PhotoService]
})
export class PhotoModule {}
