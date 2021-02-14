import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { AddTwitDTO } from './add.dto';
import { Twit } from './twit.interface';

@Injectable()
export class TwitService {
  @Inject() private readonly fileService: FileService
  constructor(@InjectModel('Twit') private readonly twitModel: Model<Twit>) { }

  async addTwit(userId: string, addTwitDTO: AddTwitDTO, uploadedFiles: Array<File>): Promise<Twit> {
    let reactions: Array<number> = new Array(12).fill(0);
    let created_time: Date = new Date();
    let files = new Array();
    const level = 0 + (addTwitDTO.ancestor ? 1 : 0) + (addTwitDTO.parent ? 1 : 0);
    let twit: any = {
      user: userId, created_time, level,
      reactions, files, ...addTwitDTO
    }
    twit = await new this.twitModel(twit).save()
    if (twit.ancestor) {
      let _ = await this.twitModel.findByIdAndUpdate(twit.ancestor,
        { $push: { "descendants": twit._id } },
      )
    }
    if (twit.parent) {
      let _ = await this.twitModel.findByIdAndUpdate(twit.parent,
        { $push: { "children": twit._id } }, { new : true },
      )
    }
    let savedFiles = await this.fileService.saveFiles(userId, twit._id, uploadedFiles)
    let fileIds = savedFiles.map(f => f._id)
    twit = await this.twitModel.findByIdAndUpdate(
      twit._id, { files: fileIds }, { new: true }
    )
    return twit;
  }
}
