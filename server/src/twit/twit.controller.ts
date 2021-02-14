import { Body, Controller, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddTwitDTO } from './add.dto';
import { TwitService } from './twit.service';

@Controller('twit')
export class TwitController {
  constructor (private twitService: TwitService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files'))
  async addTwit(@Req() req, @Body() addTwitDTO: AddTwitDTO, @UploadedFiles() files) {
    let userId = req.user.userId
    return await this.twitService.addTwit(userId, addTwitDTO, files)
  }
}
