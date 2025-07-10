import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PublicUser } from '../../common/types/users';
import { Role } from '../../common/types/role';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            getCurrentUser: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call AuthService.login on login', async () => {
    const dto: LoginDto = { email: 'test@test.com', password: 'pass' };
    const result = {
      access_token: 'token',
      user: { id: 1, name: 'Test', email: 'test@test.com', role: 'user' as Role },
    };
    jest.spyOn(service, 'login').mockResolvedValue(result);
    expect(await controller.login(dto)).toEqual(result);
    expect(service.login).toHaveBeenCalledWith(dto);
  });

  it('should call AuthService.register on register', async () => {
    const dto: RegisterDto = { name: 'Test', email: 'test@test.com', password: 'pass' };
    const result = {
      access_token: 'token',
      user: { id: 1, name: 'Test', email: 'test@test.com', role: 'user' as Role },
    };
    jest.spyOn(service, 'register').mockResolvedValue(result);
    expect(await controller.register(dto)).toEqual(result);
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('should call AuthService.getCurrentUser on whoami', async () => {
    const req = { user: { id: 1 } };
    const user: PublicUser = { id: 1, name: 'Test', email: 'test@test.com', role: 'user' };
    jest.spyOn(service, 'getCurrentUser').mockResolvedValue(user);
    expect(await controller.whoami(req)).toEqual(user);
    expect(service.getCurrentUser).toHaveBeenCalledWith(1);
  });
});
