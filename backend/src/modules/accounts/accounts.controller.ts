import {
    Controller,
    Delete,
    Param,
    Put,
    Body,
    NotFoundException,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { RolesGuard, JwtAuthGuard, Roles } from '../../common';

@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)

export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @Delete(':id')
    @Roles('admin')
    async deleteAccount(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        const account = await this.accountsService.findById(id);
        if (!account) {
            throw new NotFoundException(`Account with ID ${id} not found`);
        }

        await this.accountsService.remove(id);

        return { message: `Account ${id} deleted successfully` };
    }

    @Put(':id/role')
    @Roles('admin')
    async changeRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ChangeRoleDto,
    ): Promise<{ message: string }> {
        const account = await this.accountsService.findById(id);
        if (!account) {
            throw new NotFoundException(`Account with ID ${id} not found`);
        }

        await this.accountsService.updateRole(id, dto.role);

        return { message: `Account ${id} role updated to ${dto.role}` };
    }
}
