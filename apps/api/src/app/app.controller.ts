import { Controller, Get } from '@nestjs/common';

import { Message } from '@nx-foto/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getData() {
    return this.appService.getData();
  }
}
