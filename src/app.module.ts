import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
// import { LocalStrategy } from './auth/strategies/local.strategy';
// import { ExpenseService } from './expense/expense.service';
// import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [AuthModule, UsersModule, ExpenseModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
