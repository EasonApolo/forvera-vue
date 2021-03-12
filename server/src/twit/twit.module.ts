import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from 'src/file/file.module';
import { UsersModule } from 'src/user/user.module';
import { TwitController } from './twit.controller';
import { TwitSchema } from './twit.schema';
import { TwitService } from './twit.service';

@Module({
  imports: [
    FileModule,
    UsersModule,
    MongooseModule.forFeature([{ name: 'Twit', schema: TwitSchema }])
  ],
  controllers: [TwitController],
  providers: [TwitService]
})
export class TwitModule {
  constructor() {}
}
