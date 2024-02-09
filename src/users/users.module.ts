import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  exports: [UsersService],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
