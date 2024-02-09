import { ConflictException, Injectable } from '@nestjs/common';
// import type { User } from '/../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
interface registerParams {
  email: string;
  username: string;
  password: string;
  name: string;
}
@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register({
    email,
    username,
    password,
    name,
  }: registerParams): Promise<any> {
    let userExists = await this.findAccountByEmail(email);
    if (userExists) throw new ConflictException('Email already registered');
    userExists = await this.findAccountByUsername(email);
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
