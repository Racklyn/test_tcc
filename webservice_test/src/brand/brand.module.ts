import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { User } from 'src/user/user.entity';
import { Page } from 'src/page/page.entity';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, User, Page]),
    ItemModule
  ],
  controllers: [BrandController],
  providers: [BrandService]
})
export class BrandModule {}
