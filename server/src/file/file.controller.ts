import { Controller, Get, Param, Post, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/shared/public.decorator';
import { File } from './file.interface';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor (private fileService: FileService) {}

  @Post('upload/:postId')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@Param('postId') postId, @Req() req, @UploadedFiles() files): Promise<File[]> {
    let userId = req.user.userId
    let savedFiles = await this.fileService.saveFiles(userId, postId, files);
    return savedFiles
  }

  @Post('uploadSingle/:postId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Param('postId') postId, @Req() req, @UploadedFile() file): Promise<File> {
    let userId = req.user.userId
    let savedFile = await this.fileService.saveFile(userId, postId, file);
    return savedFile
  }

  @Post('post/:postId')
  async listPagedUserImages(@Param('postId') postId, @Req() req, @Param('index') index: number) {
    let userId = req.user.userId
    return await this.fileService.getByPostId(postId);
  }
}
