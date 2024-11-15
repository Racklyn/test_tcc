import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    async findById(id: number): Promise<User> {
        return await this.usersRepository.findOne({
            where: {
                id: id
            },
        });
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.usersRepository.find();
            return users;
        } catch(error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // O seguinte código lança uma exceção, mas ela não quebra o código (parece ser automaticamente 'lidada')
        //if (users.length === 0) throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    }

    async create(userDto: CreateUserDto): Promise<User> {
        return await this.usersRepository.save(userDto);
    }

    async update(userDto: UpdateUserDto): Promise<UpdateUserDto> {
        // const user = await this.findOne(id);

        // if (!user) {
        //     throw new NotFoundException('Usuário não encontrado');
        // }

        // const { id: dtoId, ...dtoWithoutId } = userDto;

        // Object.assign(user, dtoWithoutId);
        //const updatedUser = await this.usersRepository.save(user);

        const updatedUser = await this.usersRepository.save(userDto);
        return updatedUser;
    }

}
