import { forwardRef, Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { PhotoModule } from '../photo/photo.module';
import { FaceModule } from '../face/face.module';
import { VideoModule } from '../video/video.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([People]),
    forwardRef(() => FaceModule),
    forwardRef(() => PhotoModule),
    forwardRef(() => VideoModule),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [PeopleService]
})
export class PeopleModule {}
