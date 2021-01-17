import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Category } from './category.interface';

@Injectable()
export class CategoryService {
  constructor (
    @InjectModel('Category') private readonly categoryModel: Model<Category>
  ) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }
  
  async addCategory (newCat: Category) {
    await new this.categoryModel(newCat).save()
    return await this.getCategories()
  }

  async edit (id: string, newCat: Category) {
    await this.categoryModel.findByIdAndUpdate(id, newCat)
    return await this.getCategories()
  }

  async delete (id: string) {
    await this.categoryModel.findByIdAndDelete(id)
    return await this.getCategories()
  }
}
