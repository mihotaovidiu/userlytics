import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard, SelfOrAdminGuard } from '../../common';
import { NotFoundException } from '@nestjs/common';
import { PublicUser, PublicUserCollection } from '../../common/types/users';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findPublicAll: jest.fn(),
            findPublicById: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .overrideGuard(SelfOrAdminGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPublicUsers', () => {
    it('should return paginated users', async () => {
      const result: PublicUserCollection = {
        users: [
          { id: 1, name: 'Test', email: 'test@test.com', role: 'user' },
        ],
        total: 1,
        page: 1,
        pageSize: 10,
      };
      jest.spyOn(service, 'findPublicAll').mockResolvedValue(result);
      await expect(controller.getPublicUsers(1, 10, '')).resolves.toEqual(result);
      expect(service.findPublicAll).toHaveBeenCalledWith({ page: 1, limit: 10, search: '' });
    });
  });

  describe('getPublicUser', () => {
    it('should return a user', async () => {
      const user: PublicUser = { id: 1, name: 'Test', email: 'test@test.com', role: 'user' };
      jest.spyOn(service, 'findPublicById').mockResolvedValue(user);
      await expect(controller.getPublicUser(1)).resolves.toEqual(user);
      expect(service.findPublicById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findPublicById').mockResolvedValue(null);
      await expect(controller.getPublicUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update and return the user', async () => {
      const user: PublicUser = { id: 1, name: 'Test', email: 'test@test.com', role: 'user' };
      jest.spyOn(service, 'updateProfile').mockResolvedValue(user);
      await expect(controller.updateProfile(1, { name: 'Test' })).resolves.toEqual(user);
      expect(service.updateProfile).toHaveBeenCalledWith(1, { name: 'Test' });
    });
  });
});
