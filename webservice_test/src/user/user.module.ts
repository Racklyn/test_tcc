import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { SeedingService } from '../database/seeding.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UsersService, SeedingService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
