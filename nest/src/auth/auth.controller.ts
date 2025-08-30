import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './passport/jwt-auth.guards'; 
import { LocalAuthGuard } from './passport/local-auth.guards'; 
import { Public } from './decorator/public-decorator'; 
import { CreateAuthDto } from './dto/create-auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // login
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user); 
  }

  // register
  @Public()
  @Post('register')
  async register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }

  // get infor profile
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  // active account
  @Public()
  @Post('verify-activation')
  async verifyActivation(@Body() body: { email: string; code: string }) {
    return this.authService.verifyActivation(body.email, body.code);
  }

  // resend code
  @Public()
  @Post('resend-activation')
  async resendActivation(@Body() body: { email: string }) {
    return this.authService.resendActivationCode(body.email);
  }
}
