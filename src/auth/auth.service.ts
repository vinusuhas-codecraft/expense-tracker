import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface registerParams {
  email: string;
  username: string;
  password: string;
  name: string;
  image?: string;
}


// interface User{

// }
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signin(user) {
    const payload = {
      username: user.email,
      sub: {
        user,
      },
    };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user) {
    const payload = {
      username: user.email,
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
  }: registerParams): Promise<any> {
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

  async findAccount(email: string, username: string): Promise<any> {
    const user = await this.prismaService.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    return user;
  }

  /**
   * Create an account and stores the user account in the database
   */
  async addUser({ email, password, username, name, image }) {
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
