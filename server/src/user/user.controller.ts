import { Controller, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('info')
  async checkStatus(@Request() req) {
    return await this.userService.getUserInfo(req.user)
  }
}
