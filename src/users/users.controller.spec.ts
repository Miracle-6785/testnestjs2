import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: Partial<User> = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateUserDto: CreateUserDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    name: 'Updated Name',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockReturnValue(mockUser),
            findAll: jest.fn().mockReturnValue([mockUser]),
            findOne: jest.fn().mockImplementation((id: number) => {
              if (id === 1) return mockUser;
              throw new NotFoundException(`User with ID ${id} not found`);
            }),
            update: jest.fn().mockImplementation((id: number, dto: UpdateUserDto) => {
              if (id === 1) return { ...mockUser, ...dto };
              throw new NotFoundException(`User with ID ${id} not found`);
            }),
            remove: jest.fn().mockImplementation((id: number) => {
              if (id !== 1) throw new NotFoundException(`User with ID ${id} not found`);
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', () => {
      expect(controller.create(mockCreateUserDto)).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      expect(controller.findAll()).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      expect(controller.findOne(1)).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an exception for invalid user', () => {
      expect(() => controller.findOne(2)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      expect(controller.update(1, mockUpdateUserDto)).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(1, mockUpdateUserDto);
    });

    it('should throw an exception for invalid user', () => {
      expect(() => controller.update(2, mockUpdateUserDto)).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', () => {
      controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an exception for invalid user', () => {
      expect(() => controller.remove(2)).toThrow(NotFoundException);
    });
  });
});