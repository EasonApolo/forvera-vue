import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt'
import { CreateUserDTO } from 'src/user/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByName(username);
    if (user && user.password === pass) {
      const result = { username: user.username, userId: user._id }
      return result;
    }
    return null;
  }
  
  async getToken(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateUserDTO) {
    let res = await this.userService.addUser(user)
    if (!res) return null
    return await this.getToken(user)
  }
}
