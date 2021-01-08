import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PeopleModule } from '../people/people.module';
import { PhotoModule } from '../photo/photo.module';
import { UserModule } from '../user/user.module';
import { FaceController } from './face.controller';
import { Face } from './face.entity';
import { FaceService } from './face.service';

@Module({
  imports:[
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([Face]),
    forwardRef(() => PhotoModule),
    forwardRef(() => PeopleModule)
  ],
  controllers: [FaceController],
  providers: [FaceService],
  exports: [FaceService]
})
export class FaceModule {}
