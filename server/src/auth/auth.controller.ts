import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { Public } from 'src/shared/public.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const tokenObj = await this.authService.getToken(req.user)
    return { 'statusCode': 200, token: tokenObj.token }
  }

  @Public()
  @Post('register')
  async register(@Request() req) {
    return this.authService.register(req.body)
  }

  @Post('status')
  async checkStatus(@Request() req) {
    return { 'statusCode': 200 }
  }
}
