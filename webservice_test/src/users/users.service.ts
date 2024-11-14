import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDomain } from './user.domain';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    async findById(id: string): Promise<User> {
        return await this.usersRepository.findOne({
            where: {
                id: id
            },
        });
    }

    async findAllUsers(): Promise<User[]> {
        const users = await this.usersRepository.find();

        // O seguinte código lança uma exceção, mas ela não quebra o código (parece ser automaticamente 'lidada')
        if (users.length === 0) throw new HttpException('Users not found', HttpStatus.NOT_FOUND);

        return users;
    }

    async createUser(userDto: UserDomain): Promise<UserDomain> {
        return await this.usersRepository.save(userDto);
    }

    async updateUser(userDto: UpdateUserDto): Promise<UpdateUserDto> {
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
