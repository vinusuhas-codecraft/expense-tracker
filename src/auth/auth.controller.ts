import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dtos/auth.dtos';
import { signInDto } from './dtos/auth.dtos';
import { RefershJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(@Body() body: registerDto) {
    return await this.authService.register(body);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signin(@Request() req, @Body() dto: signInDto) {
    console.log(req.user);

    return await this.authService.signin(dto);
  }

  @UseGuards(RefershJwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
}
