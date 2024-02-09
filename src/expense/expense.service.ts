import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpenseService {
  create() {
    return 'This action adds a new expense';
  }

  findAll() {
    return `This action returns all expense`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number) {
    return `This action updates a #${id} expense`;
  }

  delete(id: number) {
    return `This action delete a #${id} expense`;
  }
}
