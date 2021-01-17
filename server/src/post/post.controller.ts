import { Controller, Get, NotFoundException, Param, Body, Post, Request, Put, Delete, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PostService } from './post.service';
import { ValidateObjectId } from '../shared/validate-object-id.pipes'
import { Public } from 'src/shared/public.decorator';
import { Req } from '@nestjs/common';
import { EditPostDTO } from './dto/edit.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Public()
  @Get()
  async getPosts() {
    const posts = await this.postService.getPostsMeta()
    return posts
  }

  @Public()
  @Get('/:postId')
  async getPostById (@Param('postId', new ValidateObjectId()) postId: string) {
    return await this.postService.getPost(postId)
  }

  @Post('user')
  async getPostMetasByUserId (@Request() req) {
    const userId = req.user.userId
    const posts = await this.postService.getPostsMetaByUserId(userId)
    return posts
  }

  @Post()
  async addPost (@Req() req) {
    const author_id = req.user.userId
    const newPost = await this.postService.addPost(author_id);
    return newPost
  }
  
  @Put('/:postId')
  async editPost (
    @Req() req,
    @Param('postId', new ValidateObjectId()) postId: string,
    @Body() editPostDTO: EditPostDTO
  ) {
    let isAuthor = await this.postService.validateAuthor(req.user.userId, postId)
    if (!isAuthor) {
      throw new UnauthorizedException(`${ req.user.username } is not the author of ${ postId }.`)
    }
    const newPost = await this.postService.editPost(postId, editPostDTO);
    if (!newPost) throw new NotFoundException('Post does not exist!');
    return { statusCode: 200, data: newPost}
  }

  @Delete('/:postId')
  async deletePost (
    @Req() req,
    @Param('postId', new ValidateObjectId()) postId
  ) {
    let isAuthor = await this.postService.validateAuthor(req.user.userId, postId)
    if (!isAuthor) {
      throw new UnauthorizedException(`${ req.user.username } is not the author of ${ postId }.`)
    }
    const newPost = await this.postService.deletePost(postId);
    if (!newPost) throw new NotFoundException('Post does not exist!');
    return { statusCode: 200 }
  }
}
