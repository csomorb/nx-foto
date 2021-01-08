import { Injectable } from '@nestjs/common';
import { Message } from '@nx-foto/api-interfaces';

@Injectable()
export class AppService {
  constructor(){
    console.log(process.mainModule['path']);
    console.log(__dirname);
  }

  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}
