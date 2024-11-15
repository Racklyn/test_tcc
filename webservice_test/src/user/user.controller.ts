import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UsersService } from './user.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get(':id')
    findById(@Res() response: Response, @Param('id') id: number) {
        //Dessa forma retorna o status code da requisição
        return response.status(200).json(this.usersService.findById(id));
    }

    @Get()
    async findAll(@Res() response: Response) {
        const users = await this.usersService.findAll()
        return response.status(200).json(users);
    }

    @Post()
    async create(@Res() response: Response, @Body() user: CreateUserDto) {
        const created_user = await this.usersService.create(user);
        return response.status(201).json(created_user);
    }
}
