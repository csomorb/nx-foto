import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from '../album/album.module';
import { AuthModule } from '../auth/auth.module';
import { FaceModule } from '../face/face.module';
import { PeopleModule } from '../people/people.module';
import { TagModule } from '../tag/tag.module';
import { VideoController } from './video.controller';
import { Video } from './video.entity';
import { VideoService } from './video.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Video]),
    forwardRef(() => AlbumModule),
    forwardRef(() => TagModule),
    forwardRef(() => PeopleModule),
    forwardRef(() => FaceModule)
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService]
})
export class VideoModule {}
