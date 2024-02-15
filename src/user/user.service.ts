import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAddress(body, userId): Promise<any> {
    const res = await this.prismaService.address.create({
      data: {
        ...body,
        userId,
      },
    });
    return res;
  }
  async totalUserExpenses(userId): Promise<any> {
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
      // take: 5, //pagination
    });
    return result._sum;
  }
}
