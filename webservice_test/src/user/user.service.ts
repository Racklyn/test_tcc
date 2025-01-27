import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    async create(userDto: CreateUserDto): Promise<User> {
        try {
            const user = new User();
            user.email = userDto.email;
            user.access_key = userDto.access_key;

            //TODO: verificar se faz sentido inserir essa lista:
            // user.brands = userDto.brands ?? [];
    
            return await this.usersRepository.save(user);
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOne(id: number): Promise<User> {
        try {
            return await this.usersRepository.findOne({
                where: {
                    id: id
                },
            });
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.usersRepository.find();
            return users;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(id:number, userDto: UpdateUserDto): Promise<UpdateUserDto> {
        try {
            const user = await this.findOne(id);
    
            if (!user) {
            throw new NotFoundException('User not found.');
            }
    
            const { id: dtoId, ...dtoWithoutId } = userDto;
            Object.assign(user, dtoWithoutId);
    
            const updatedUser = await this.usersRepository.save(user);
            return updatedUser;
        } catch(error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async remove(id: number) {
        try {
          await this.usersRepository.delete(id);
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
