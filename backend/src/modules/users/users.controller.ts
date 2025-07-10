import {
    Controller,
    Get,
    Param,
    Query,
    Put,
    Body,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PublicUser, PublicUserCollection } from '../../common/types';
import { SelfOrAdminGuard, JwtAuthGuard } from '../../common';
import { UpdateUserDto } from './dto/update-user-name.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getPublicUsers(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
    ): Promise<PublicUserCollection> {
        return this.usersService.findPublicAll({ page, limit, search });
    }

    @Get(':id')
    @UseGuards(SelfOrAdminGuard)
    async getPublicUser(@Param('id') id: number): Promise<PublicUser> {
        const user = await this.usersService.findPublicById(id);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    @Put(':id')
    @UseGuards(SelfOrAdminGuard)
    async updateProfile(
        @Param('id') id: number,
        @Body() data: UpdateUserDto,
    ): Promise<PublicUser> {
        return this.usersService.updateProfile(id, data);
    }
}
