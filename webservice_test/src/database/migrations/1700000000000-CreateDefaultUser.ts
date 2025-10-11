import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultUser1700000000000 implements MigrationInterface {
  name = 'CreateDefaultUser1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verifica se já existe algum usuário no banco
    const existingUsers = await queryRunner.query(
      `SELECT COUNT(*) as count FROM "user"`
    );

    if (existingUsers[0].count === '0') {
      // Insere o usuário padrão apenas se não houver nenhum usuário
      await queryRunner.query(
        `INSERT INTO "user" (email, access_key, "createdAt", "updatedAt") 
         VALUES ('admin@brandanalyzer.com', 'admin-access-key', NOW(), NOW())`
      );
      
      console.log('Usuário padrão criado com sucesso!');
      console.log('Email: admin@brandanalyzer.com');
      console.log('Access Key: admin-access-key');
    } else {
      console.log(`Já existem ${existingUsers[0].count} usuário(s) no banco de dados. Usuário padrão não será criado.`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove o usuário padrão
    await queryRunner.query(
      `DELETE FROM "user" WHERE email = 'admin@brandanalyzer.com'`
    );
    
    console.log('Usuário padrão removido do banco de dados.');
  }
}
