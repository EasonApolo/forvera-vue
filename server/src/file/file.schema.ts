import * as mongoose from 'mongoose'

export const FileSchema = new mongoose.Schema({
  user: String,
  post: String,
  name: String,
  encoding: String,
  mimetype: String,
  url: String,
  size: Number,
  created_time: Date,
})