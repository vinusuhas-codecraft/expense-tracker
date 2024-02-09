import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dtos/auth.dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(@Body() body: registerDto) {
    return await this.authService.register(body);
  }
}
