import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './create-user.dto';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async getUserInfo(user): Promise<User> {
    const userInfo = await this.userModel
      .findById(user.userId).select('-password').exec();
    return userInfo
  }

  async getUserByName(username: string): Promise<User> {
    const user = await this.userModel
      .findOne({ username: username })
      .exec();
    return user;
  }

  async addUser(createUserDTO: CreateUserDTO): Promise<User> {
    let res = await this.getUserByName(createUserDTO.username)
    if (res) return null
    const newUser = await new this.userModel(createUserDTO);
    return newUser.save();
  }
}
