import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AddressParams } from './user.interface';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAddress', () => {
    it('should create a new address and return the result', async () => {
      const body = {
        street: '123 Main St',
        city: 'Example City',
        country: 'Example Country',
      };
      const userId = 1;
      const expectedResult: AddressParams = {
        id: 1,
        ...body,
        userId,
        location: '',
        state: '',
        pincode: 0,
      };

      jest
        .spyOn(prismaService.address, 'create')
        .mockResolvedValue(expectedResult);

      const result = await userService.createAddress(body, userId);

      expect(prismaService.address.create).toHaveBeenCalledWith({
        data: {
          ...body,
          userId,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('totalUserExpenses', () => {
    it('should calculate the total expenses for a user', async () => {
      const userId = 1;
      const totalExpenseResult = {
        _sum: { amount: 500 },
      };

      jest
        .spyOn(prismaService.expense, 'aggregate')
        .mockResolvedValue(totalExpenseResult as any);

      const result = await userService.totalUserExpenses(userId);

      expect(prismaService.expense.aggregate).toHaveBeenCalledWith({
        _sum: {
          amount: true,
        },
        where: {
          userId: {
            equals: userId,
          },
        },
        orderBy: {
          amount: 'asc',
        },
      });
      expect(result).toEqual(totalExpenseResult._sum);
    });
  });
});
