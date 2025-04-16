import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  
  const mockCreateUserDto: CreateUserDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', () => {
      const result = service.create(mockCreateUserDto);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', mockCreateUserDto.name);
      expect(result).toHaveProperty('email', mockCreateUserDto.email);
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      service.create(mockCreateUserDto);
      const users = service.findAll();
      
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0]).not.toHaveProperty('password');
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      const newUser = service.create(mockCreateUserDto);
      const user = service.findOne(newUser.id);
      
      expect(user).toHaveProperty('id', newUser.id);
      expect(user).toHaveProperty('name', mockCreateUserDto.name);
      expect(user).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when user not found', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      const newUser = service.create(mockCreateUserDto);
      
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      
      const updatedUser = service.update(newUser.id, updateUserDto);
      
      expect(updatedUser).toHaveProperty('name', updateUserDto.name);
      expect(updatedUser).toHaveProperty('email', mockCreateUserDto.email);
      expect(updatedUser).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when trying to update non-existent user', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      
      expect(() => service.update(999, updateUserDto)).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', () => {
      const newUser = service.create(mockCreateUserDto);
      service.remove(newUser.id);
      
      expect(() => service.findOne(newUser.id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when trying to remove non-existent user', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });
}); 