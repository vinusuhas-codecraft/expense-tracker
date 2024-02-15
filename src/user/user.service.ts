import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAddress(body, userId): Promise<any> {
    const res = await this.prismaService.address.create({
      data: {
        ...body,
        userId,
      },
    });
    return res;
  }
}
