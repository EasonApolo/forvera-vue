import * as mongoose from 'mongoose'

export const TwitSchema = new mongoose.Schema({
  user: String,
  content: String,
  created_time: Date,
  level: Number,
  
  reactions: [Number],
  files: [String],

  children: [String],
  parent: String,
  ancestor: String,
  descendants: [String],
})