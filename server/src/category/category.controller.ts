import { Body, Delete, Put } from '@nestjs/common';
import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Public } from 'src/shared/public.decorator';
import { ValidateObjectId } from 'src/shared/validate-object-id.pipes';
import { Category } from './category.interface';
import { CategoryService } from './category.service';

@Controller('cat')
export class CategoryController {
  constructor(private catServer: CategoryService) {}

  @Public()
  @Get()
  async getCategories() {
    const posts = await this.catServer.getCategories()
    return posts
  }

  @Post()
  async addCat(@Req() req, @Body() catDTO: Category) {
    const cats = await this.catServer.addCategory(catDTO)
    return { statusCode: 200, data: cats }
  }
  
  @Put('/:id')
  async edit(
    @Param('id', new ValidateObjectId()) catId,
    @Body() catDTO: Category
  ) {
      const cats = await this.catServer.edit(catId, catDTO);
      return { statusCode: 200, data: cats }
  }
  
  @Delete('/:id')
  async delete(
    @Param('id', new ValidateObjectId()) catId
  ) {
      const cats = await this.catServer.delete(catId);
      return { statusCode: 200, data: cats }
  }
}
