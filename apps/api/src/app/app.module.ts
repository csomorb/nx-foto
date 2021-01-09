import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { environment } from '../environments/environment';
import { Album } from './album/album.entity';
import { AlbumModule } from './album/album.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Face } from './face/face.entity';
import { FaceModule } from './face/face.module';
import { People } from './people/people.entity';
import { PeopleModule } from './people/people.module';
import { Photo } from './photo/photo.entity';
import { PhotoModule } from './photo/photo.module';
import { Tag } from './tag/tag.entity';
import { TagModule } from './tag/tag.module';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
import { Video } from './video/video.entity';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: environment.host,
      port: environment.port,
      username: environment.username,
      password: environment.password,
      database: environment.database,
      entities: [Album,Photo,Tag,People,Face,Video,UserEntity],
      synchronize: true,
      // logging: true,
      // debug: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'foto'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.mainModule['path'], '..', '..', '..', 'files'),
      serveRoot: '/files',
    }),
    AlbumModule,
    PhotoModule,
    TagModule,
    PeopleModule,
    FaceModule,
    VideoModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
