import { Brand } from 'src/brand/brand.entity';

export class CreateUserDto {
    id?: number;
    email: string;
    access_key: string;
    brand: Brand[];
    created_at?: string;
    updated_at?: string;
}
