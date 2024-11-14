export class CreateUserDto {
    readonly id?: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly created_at?: string;
    readonly updated_at?: string;
}
