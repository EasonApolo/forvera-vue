import { Body, Controller, Get, Param, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/shared/public.decorator';
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

  @Public()
  @Get('/:page')
  async getTwit(@Param('page') page) {
    return this.twitService.getTwit(parseInt(page))
  }
}
