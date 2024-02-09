import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dtos/auth.dtos';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(@Body() dto: signInDto, @Req() req, @Res() res) {
    return await this.authService.signin(dto, req, res);
  }

  @Post('signout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }
  @Post('refresh')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }
}
