import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Album } from './album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from '../photo/photo.module';
import { VideoModule } from '../video/video.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => PhotoModule),
    forwardRef(() => VideoModule)
  ],
  providers: [AlbumService],
  controllers: [AlbumController],
  exports: [AlbumService]
})
export class AlbumModule {}
