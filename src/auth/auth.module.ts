import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PrismaService } from 'nestjs-prisma';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
