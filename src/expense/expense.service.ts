import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private prismaService: PrismaService) {}

  async insert({ amount, title, userID }) {
    const result = await this.prismaService.expense.create({
      data: {
        amount,
        title,
        userID,
      },
    });
    return result;
  }

  async findAll({ userId }) {
    const result = await this.prismaService.expense.findMany({ data: { id } });
    return result;
  }

  async findOne(id: number) {
    const result = await this.prismaService.expense.findOne({ data: { id } });
    return result;
  }

  async update(id: number, { title, amount }) {
    const updatedItem = await this.prismaService.expense.update({
      where: {
        id,
      },
      data: {
        title,
        amount,
      },
    });
    return updatedItem;
  }

  async delete(id: number) {
    const deletedItem = await this.prismaService.expense.delete({
      where: {
        id,
      },
    });
    return deletedItem;
  }
}
