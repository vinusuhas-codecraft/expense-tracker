import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  // Mock PrismaService
  const prismaServiceMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  // Mock JwtService
  const jwtServiceMock = {
    sign: jest.fn(),
  };

  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when email and password are correct', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        image: 'test.jpg',
        password: await bcrypt.hash('password', 10),
      };
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        image: 'test.jpg',
      });
    });

    it('should throw BadRequestException when user is not found', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return null when password is incorrect', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        image: 'test.jpg',
        password: await bcrypt.hash('password', 10),
      };
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });

    // Add more test cases for different scenarios
  });

  describe('signin', () => {
    it('should generate access token and refresh token', async () => {
      jwtServiceMock.sign.mockReturnValue('access_token');

      const result = await service.signin({
        email: 'test@example.com',
        userId: 1,
      });
      expect(result.accessToken).toBe('access_token');
      expect(jwtServiceMock.sign).toHaveBeenCalled();
    });

    // Add more test cases for different scenarios
  });

  describe('refreshToken', () => {
    it('should generate new access token', async () => {
      jwtServiceMock.sign.mockReturnValue('new_access_token');

      const result = await service.refreshToken({ email: 'test@example.com' });
      expect(result.accessToken).toBe('new_access_token');
      expect(jwtServiceMock.sign).toHaveBeenCalled();
    });

    // Add more test cases for different scenarios
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const data = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        image: 'test.jpg',
      };
      prismaServiceMock.user.findFirst.mockResolvedValue(null);
      prismaServiceMock.user.create.mockResolvedValue(data);

      const result = await service.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        name: 'Test User',
        image: 'test.jpg',
      });
      expect(result).toEqual(data);
    });

    it('should throw ConflictException if email is already registered', async () => {
      const data = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        image: 'test.jpg',
      };
      prismaServiceMock.user.findFirst.mockResolvedValue({
        email: 'test@example.com',
      });
      prismaServiceMock.user.create.mockResolvedValue(data);
      await expect(
        service.register({
          email: 'test@example.com',
          username: 'testuser',
          password:
            '$2b$10$oD689ZOkALTh0W1O9cYE7.s/svUPfO9WcazgGqmrHdH4yW9INyIu6',
          name: 'Test User',
          image: 'test.jpg',
        }),
      ).rejects.toThrow(ConflictException);
    });
    it('should throw ConflictException if username is already registered', async () => {
      const data = {
        id: 1,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        image: 'test.jpg',
      };
      prismaServiceMock.user.findFirst.mockResolvedValue({
        username: 'testuser',
      });
      prismaServiceMock.user.create.mockResolvedValue(data);

      await expect(
        service.register({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password',
          name: 'Test User',
          image: 'test.jpg',
        }),
      ).rejects.toThrow(ConflictException);
    });

    // Add more test cases for different scenarios
  });
});
