import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { JwtAuthGuard, RolesGuard } from '../../common';
import { NotFoundException } from '@nestjs/common';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            findById: jest.fn(),
            remove: jest.fn(),
            updateRole: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteAccount', () => {
    const mockAccount = {
      id: 1,
      email: 'test@test.com',
      password: 'pass',
      role: 'user' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {} as any, // Use as any to bypass deep circular type for test
    };
    it('should delete account and return message', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockAccount);
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      await expect(controller.deleteAccount(1)).resolves.toEqual({ message: 'Account 1 deleted successfully' });
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if account not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);
      await expect(controller.deleteAccount(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changeRole', () => {
    const mockAccount = {
      id: 1,
      email: 'test@test.com',
      password: 'pass',
      role: 'user' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {} as any, // Use as any to bypass deep circular type for test
    };
    it('should update role and return message', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockAccount);
      jest.spyOn(service, 'updateRole').mockResolvedValue(undefined);
      const dto: ChangeRoleDto = { role: 'admin' };
      await expect(controller.changeRole(1, dto)).resolves.toEqual({ message: 'Account 1 role updated to admin' });
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(service.updateRole).toHaveBeenCalledWith(1, 'admin');
    });

    it('should throw NotFoundException if account not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);
      const dto: ChangeRoleDto = { role: 'admin' };
      await expect(controller.changeRole(1, dto)).rejects.toThrow(NotFoundException);
    });
  });
});
