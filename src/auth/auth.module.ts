import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
// import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600000s' },
    }),
  ],
  providers: [AuthService, JwtService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
