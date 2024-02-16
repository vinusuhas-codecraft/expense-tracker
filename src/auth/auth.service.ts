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
import {
  ComparePasswordParams,
  RefreshTokenParams,
  UserAccountParams,
  SignInTokenParams,
} from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signin(dto: signInDto): Promise<{
    messge: string;
    token: string;
    refreshToken: string;
  }> {
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
      userId: foundUser.id,
      email: foundUser.email,
    });
    if (!token) {
      throw new ForbiddenException();
    }
    const { refreshToken } = await this.refreshToken({ email });
    return { messge: 'logged in successfully', token, refreshToken };
  }

  async refreshToken(args: RefreshTokenParams): Promise<{
    refreshToken: string;
  }> {
    const payload = args;
    return {
      refreshToken: await this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    };
  }

  async comparePasswords(args: ComparePasswordParams): Promise<string> {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: SignInTokenParams): Promise<string> {
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
    image,
  }: UserAccountParams): Promise<UserAccountParams> {
    const userExists = await this.findAccount(email, username);
    if (userExists) {
      if (userExists.email === email)
        throw new ConflictException('Email already registered');
      else throw new ConflictException('Username already registered');
    } else {
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS),
      );
      const result = await this.addUser({
        email,
        password: hashedPassword,
        username,
        name,
        image,
      });
      return result;
    }
  }

  /**
   * Checks whether email or username already exists
   */

  async findAccount(
    email: string,
    username: string,
  ): Promise<UserAccountParams> {
    const user = await this.prismaService.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    return user;
  }

  /**
   * Create an account and stores the user account in the database
   */
  async addUser({
    email,
    password,
    username,
    name,
    image,
  }: UserAccountParams): Promise<UserAccountParams> {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password,
        username,
        name,
        image,
      },
    });

    return user;
  }
}
