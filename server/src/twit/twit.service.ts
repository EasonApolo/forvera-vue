import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { AddTwitDTO } from './add.dto';
import { Twit } from './twit.interface';

@Injectable()
export class TwitService {
  @Inject() private readonly fileService: FileService;
  private readonly PER_PAGE: number = 5;
  constructor(@InjectModel('Twit') private readonly twitModel: Model<Twit>) { }

  async addTwit(userId: string, addTwitDTO: AddTwitDTO, uploadedFiles): Promise<Twit> {
    let reactions: Array<number> = new Array(12).fill(0);
    let created_time: Date = new Date();
    let files = new Array();
    let level = 0
    if (addTwitDTO.ancestor) { 
      level += 1;
      if (addTwitDTO.parent == addTwitDTO.ancestor) level += 1
    }
    const twit2Save: any = {
      user: userId, created_time, level,
      reactions, files, ...addTwitDTO
    }
    let twit: Twit = await new this.twitModel(twit2Save).save()
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
    let savedFiles = await this.fileService.saveFiles(userId, twit._id.toString(), uploadedFiles)
    let fileIds: string[] = savedFiles.map(f => f._id.toString())
    twit = await this.twitModel.findByIdAndUpdate(
      twit._id, { files: fileIds }, { new: true }
    )
    return twit;
  }

  async getTwit(page: number): Promise<Twit[]> {
    const twits = this.twitModel.find({ ancestor: { $exists: false } })
      .populate('user', 'username')
      .populate('files', 'url thumb')
      .skip(this.PER_PAGE * page).limit(this.PER_PAGE).exec();
    return twits;
  }
  
  async getReplies(twitId: string) {
    const replies = await this.twitModel.findById(twitId)
      .populate({ path: 'descendants', populate: { path: 'user', select: 'username' } })
      .select('children')
    return replies.descendants
  }
}
