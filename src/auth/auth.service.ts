import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshTokenParams,
  SignInTokenParams,
  UserAccountParams,
} from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{
    id: number;
    name: string;
    username: string;
    email: string;
    image: string;
  }> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signin(user: SignInTokenParams): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      email: user.email,
      sub: {
        user,
      },
    };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: RefreshTokenParams): Promise<{
    accessToken: string;
  }> {
    const payload = {
      sub: {
        user,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
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
