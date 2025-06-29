import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BotUpdate],
})
export class BotModule {}
