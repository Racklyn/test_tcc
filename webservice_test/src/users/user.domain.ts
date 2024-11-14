import { IsOptional, IsString, IsNotEmpty, IsEmail, IsDate, MaxLength, MinLength } from "class-validator";

export class UserDomain {
    @IsOptional()
    @IsString({ message: 'ID should be a string'})
    readonly id?: string;

    @IsString({ message: 'Name should be a string'})
    readonly name: string;

    @IsString({ message: 'Email should be a string'})
    readonly email: string;

    @IsString({ message: 'password should be a string'})
    readonly password: string;

    @IsOptional()
    @IsString({ message: 'created_at should be a string'})
    readonly created_at?: string;

    @IsOptional()
    @IsString({ message: 'updated_at should be a string'})
    readonly updated_at?: string;
}