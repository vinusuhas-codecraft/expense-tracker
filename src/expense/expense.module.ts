import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExpenseController } from './expense.controller';
import { AuthService } from 'src/auth/auth.service';
@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService, PrismaService, AuthService],
})
export class ExpenseModule {}
