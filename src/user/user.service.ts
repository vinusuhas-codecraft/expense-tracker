import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddressParams, TotalExpenseResult } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAddress(body, userId): Promise<AddressParams> {
    const result = await this.prismaService.address.create({
      data: {
        ...body,
        userId,
      },
    });
    return result;
  }
  async totalUserExpenses(userId): Promise<TotalExpenseResult> {
    const result = await this.prismaService.expense.aggregate({
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
    return result._sum;
  }
}
