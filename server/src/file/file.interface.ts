import { Document } from 'mongoose';

export interface File extends Document {
  user: string,
  post: string,
  name: string,
  encoding: string,
  mimetype: string,
  url: string,
  size: number,
  created_time: string,
}