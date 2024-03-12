import { Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RmqService],
  exports: [RmqService],
})
export class RMqModule {}
