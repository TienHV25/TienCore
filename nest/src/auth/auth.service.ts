import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/modules/users/users.service'; 
import { User } from '@/modules/users/schemas/user.schema'; 
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // validate user when login
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
     throw new UnauthorizedException('Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email và kích hoạt tài khoản.');
    }


    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const plainUser = user.toObject();
      delete plainUser.password;
      return plainUser;
    }
    return null;
  }

  //login => create token
  async login(user: any) {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email }; // sub: subject
    return {
      statusCode: 200,
      message: 'Login success',
      data: {
        user: {
          _id: user._id,
          email: user.email,
        },
        access_token: this.jwtService.sign(payload),
      }
    };
  }

  // register => create new user 
  async register(userData: any) {
    return this.usersService.create({
      ...userData
    });
    
  }

  async verifyActivation(email: string, code: string) {
    return this.usersService.verifyActivation(email, code);
  }

  async resendActivationCode(email: string) {
    return this.usersService.resendActivationCode(email);
  }
}
