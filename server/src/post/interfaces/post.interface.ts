import { Document } from 'mongoose';

export interface Post extends Document {
  title: string;
  description: string;
  content: string;
  author: string;
  category: Array<string>;
  created_time: string;
  updated_time: string;
  status: number;
}