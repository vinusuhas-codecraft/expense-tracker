import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dtos/auth.dtos';

interface registerParams {
  email: string;
  username: string;
  password: string;
  name: string;
}
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signin(dto: signInDto) {
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
    const { refreshToken } = await this.refreshToken({ email });
    return { messge: 'logged in successfully', token, refreshToken };
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

  async register({
    email,
    username,
    password,
    name,
  }: registerParams): Promise<any> {
    let userExists = await this.findAccountByEmail(email);
    if (userExists) throw new ConflictException('Email already registered');
    userExists = await this.findAccountByUsername(username);
    if (userExists) throw new ConflictException('Username already registered');
    else {
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS),
      );
      const result = await this.addUser({
        email,
        password: hashedPassword,
        username,
        name,
      });
      return result;
    }
  }

  async findAccountByEmail(email: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findAccountByUsername(username: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    return user;
  }
  async addUser({ email, password, username, name }) {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password,
        username,
        name,
      },
    });

    return user;
  }
}
