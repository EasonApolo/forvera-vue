import { Document } from 'mongoose';

export interface Twit extends Document {
  user: string,
  content: string,
  created_time: string,
  level: number,
  
  reactions: Array<string>,
  files: Array<string>,

  children: Array<string>,
  parent: string,
  ancestor: string,
  descendants: Array<string>,
}