import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class SeedingService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedDefaultUser();
  }

  private async seedDefaultUser() {
    try {
      // Verifica se já existe algum usuário no banco
      const userCount = await this.userRepository.count();

      if (userCount === 0) {
        // Cria o usuário padrão apenas se não houver nenhum usuário
        const defaultUser = this.userRepository.create({
          email: 'admin@brandanalyzer.com',
          access_key: 'admin-access-key-2024'
        });

        await this.userRepository.save(defaultUser);
        
        console.log('Seeding: Usuário padrão criado com sucesso!');
        console.log('Email: admin@brandanalyzer.com');
        console.log('Access Key: admin-access-key-2024');
      } else {
        console.log(`Seeding: Já existem ${userCount} usuário(s) no banco de dados. Usuário padrão não será criado.`);
      }
    } catch (error) {
      console.error('Erro ao criar usuário padrão:', error.message);
    }
  }

  // Método público para executar seeding manualmente se necessário
  async runSeeding() {
    await this.seedDefaultUser();
  }
}
