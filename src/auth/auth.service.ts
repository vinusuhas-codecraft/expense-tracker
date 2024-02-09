import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { signInDto } from './dtos/auth.dtos';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signin(dto: signInDto, req: Request, res: Response) {
    const { email, password } = dto;

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!foundUser) {
      throw new BadRequestException('User Not Found');
    }

    const compareSuccess = await this.comparePasswords({
      password,
      hash: foundUser.password,
    });
    if (!compareSuccess) {
      throw new BadRequestException('Invalid login credentials');
    }
    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
    });
    if (!token) {
      throw new ForbiddenException();
    }
    res.cookie('token', token);
    const refreshTokens = await this.refreshToken({ email });
    res.cookie('refreshToken', refreshTokens.refreshToken);
    return res.send({ messge: 'logged in successfully' });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return res.send({ message: 'Logged out succefully' });
  }

  async refreshToken(args: { email: string }) {
    const payload = args;
    return {
      refreshToken: await this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  async comparePasswords(args: { hash: string; password: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: number; email: string }) {
    const payload = args;
    const token = this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return token;
  }
}
