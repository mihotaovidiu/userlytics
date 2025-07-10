import { IsIn } from 'class-validator';
import { Role } from '../../../common/types';

export class ChangeRoleDto {
    @IsIn(['user', 'admin'])
    role: Role;
}