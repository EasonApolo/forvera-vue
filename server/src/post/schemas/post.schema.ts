import * as mongoose from 'mongoose'

export const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  description: String,
  author: String,
  category: [ String ],
  created_time: Date,
  updated_time: Date,
  status: { type: Number, default: 0 },
})