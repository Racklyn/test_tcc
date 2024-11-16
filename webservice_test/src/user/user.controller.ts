import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
//import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Post()
    async create(@Body() user: CreateUserDto) { //@Res() response: Response, 
        const created_user = await this.usersService.create(user);
        //return response.status(201).json(created_user);
        return created_user;
    }

    @Get(':id')
    findOne(@Param('id') id: number) { //@Res() response: Response, 
        //Dessa forma retorna o status code da requisição
        //return response.status(200).json(this.usersService.findOne(id));
        return this.usersService.findOne(id);
    }

    @Get()
    async findAll(){ //@Res() response: Response{ 
        const users = await this.usersService.findAll();
        //return response.status(200).json(users);
        return users;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}