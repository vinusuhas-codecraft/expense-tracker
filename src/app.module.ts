import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { UserModule } from './user/user.module';
@Module({
  imports: [AuthModule, ExpenseModule, PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
