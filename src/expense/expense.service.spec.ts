import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseService } from './expense.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpenseService, PrismaService],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insert', () => {
    it('should create a new expense and return the result', async () => {
      const amount = 100;
      const title = 'Test Expense';
      const userId = 1;
      const expectedResult = {
        id: 1,
        amount,
        title,
        userId,
        createdAt: undefined,
        updatedAt: undefined,
      };

      jest
        .spyOn(prismaService.expense, 'create')
        .mockResolvedValue(expectedResult);

      const result = await service.insert({ amount, title }, userId);

      expect(prismaService.expense.create).toHaveBeenCalledWith({
        data: {
          amount,
          title,
          userId,
          createdAt: undefined,
          updatedAt: undefined,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if expense creation fails', async () => {
      const amount = 100;
      const title = 'Test Expense';
      const userId = 1;
      const expectedError = new Error('Expense creation failed');

      jest
        .spyOn(prismaService.expense, 'create')
        .mockRejectedValue(expectedError);

      await expect(service.insert({ amount, title }, userId)).rejects.toThrow(
        expectedError,
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all expenses associated with a specific user', async () => {
      const userId = 1;
      const expectedResult = [
        {
          id: 1,
          amount: 100,
          title: 'Expense 1',
          userId,
          createdAt: undefined,
          updatedAt: undefined,
        },
        {
          id: 2,
          amount: 150,
          title: 'Expense 2',
          userId,
          createdAt: undefined,
          updatedAt: undefined,
        },
      ];

      jest
        .spyOn(prismaService.expense, 'findMany')
        .mockResolvedValue(expectedResult);

      const result = await service.findAll(userId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should retrieve a specific expense by ID and user ID', async () => {
      const expenseId = 1;
      const userId = 1;
      const expectedResult = {
        id: expenseId,
        amount: 100,
        title: 'Test Expense',
        userId,
        createdAt: undefined,
        updatedAt: undefined,
      };

      jest
        .spyOn(prismaService.expense, 'findUnique')
        .mockResolvedValue(expectedResult);

      const result = await service.findOne(expenseId, userId);

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if expense is not found', async () => {
      const expenseId = 1;
      const userId = 1;

      jest.spyOn(prismaService.expense, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(expenseId, userId)).resolves.toBeNull();
    });
  });
  describe('update', () => {
    it('should update a specific expense and return the result', async () => {
      const expenseId = 1;
      const userId = 1;
      const updatedData = { title: 'Updated Expense', amount: 200 };
      const expectedResult = {
        id: expenseId,
        amount: updatedData.amount,
        title: updatedData.title,
        userId,
        createdAt: undefined,
        updatedAt: undefined,
      };

      jest
        .spyOn(prismaService.expense, 'update')
        .mockResolvedValue(expectedResult);

      const result = await service.update(expenseId, updatedData, userId);

      expect(prismaService.expense.update).toHaveBeenCalledWith({
        where: { id: expenseId, userId },
        data: updatedData,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if expense to update is not found', async () => {
      const expenseId = 1;
      const userId = 1;
      const updatedData = { title: 'Updated Expense', amount: 200 };

      jest.spyOn(prismaService.expense, 'update').mockResolvedValue(null);

      await expect(
        service.update(expenseId, updatedData, userId),
      ).resolves.toBeNull();
    });
  });
  describe('delete', () => {
    it('should delete a specific expense and return the result', async () => {
      const expenseId = 1;
      const userId = 1;
      const expectedResult = {
        id: expenseId,
        amount: 100,
        title: 'Test Expense',
        userId,
        createdAt: undefined,
        updatedAt: undefined,
      };

      jest
        .spyOn(prismaService.expense, 'delete')
        .mockResolvedValue(expectedResult);

      const result = await service.delete(expenseId, userId);

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if expense to delete is not found', async () => {
      const expenseId = 1;
      const userId = 1;

      jest.spyOn(prismaService.expense, 'delete').mockResolvedValue(null);

      await expect(service.delete(expenseId, userId)).resolves.toBeNull();
    });
  });
});
