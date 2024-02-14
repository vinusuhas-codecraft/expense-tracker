import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Inserts a new expense into the database.
   *
   * @param {Object} data - The data for the new expense.
   * @param {number} data.amount - The amount of the expense.
   * @param {string} data.title - The title of the expense.
   * @param {number} userId - The ID of the user associated with the expense.
   * @returns {Promise<any>} A promise that resolves to the created expense.
   */

  async insert({ amount, title }, userId: number) {
    const result = await this.prismaService.expense.create({
      data: {
        amount,
        title,
        userId,
      },
    });
    return result;
  }

  /**
   * Retrieves all expenses associated with a specific user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<any[]>} A promise that resolves to an array of expenses.
   */

  async findAll(userId: number) {
    const result = await this.prismaService.expense.findMany({
      where: { userId },
    });
    return result;
  }

  /**
   * Retrieves a specific expense by ID and user ID.
   *
   * @param {number} id - The ID of the expense.
   * @param {number} userId - The ID of the user associated with the expense.
   * @returns {Promise<any>} A promise that resolves to the found expense.
   */
  async findOne(id: number, userId: number) {
    const result = await this.prismaService.expense.findUnique({
      where: { id, userId },
    });
    return result;
  }

  /**
   * Updates a specific expense by ID and user ID.
   *
   * @param {number} id - The ID of the expense to update.
   * @param {Object} data - The updated data for the expense.
   * @param {string} data.title - The updated title of the expense.
   * @param {number} data.amount - The updated amount of the expense.
   * @param {number} userId - The ID of the user associated with the expense.
   * @returns {Promise<any>} A promise that resolves to the updated expense.
   */
  async update(id: number, { title, amount }, userId) {
    const updatedItem = await this.prismaService.expense.update({
      where: {
        id,
        userId,
      },
      data: {
        title,
        amount,
      },
    });
    return updatedItem;
  }

  /**
   * Deletes a specific expense by ID and user ID.
   *
   * @param {number} id - The ID of the expense to delete.
   * @param {number} userId - The ID of the user associated with the expense.
   * @returns {Promise<any>} A promise that resolves to the deleted expense.
   */
  async delete(id: number, userId: number) {
    const deletedItem = await this.prismaService.expense.delete({
      where: {
        id,
        userId,
      },
    });
    return deletedItem;
  }
}
