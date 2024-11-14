import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDomain } from './user.domain';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get(':id')
    findById(@Res() response: Response, @Param('id') id: string) {
        //Dessa forma retorna o status code da requisição
        return response.status(200).json(this.usersService.findById(id));
    }

    @Get()
    async findAllUsers(@Res() response: Response) {
        const users = await this.usersService.findAllUsers()
        return response.status(200).json(users);
    }

    @Post()
    async createUsers(@Res() response: Response, @Body() user: UserDomain) {
        const created_user = await this.usersService.createUser(user);
        return response.status(201).json(created_user);
    }
}
