import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { Role } from '../../../common/types';

export class CreateAccountDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsIn(['admin', 'user'])
    role?: Role;
}
