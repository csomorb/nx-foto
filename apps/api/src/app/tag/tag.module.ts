import { forwardRef, Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { PhotoModule } from '../photo/photo.module';
import { VideoModule } from '../video/video.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([Tag]),
    forwardRef(() => PhotoModule),
    forwardRef(() => VideoModule)
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService]
})
export class TagModule {}
