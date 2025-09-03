import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/modules/users/users.module'; 
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './passport/jwt.strategy';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './passport/jwt-auth.guards';
import { TransformInterceptor } from './core/transform.interceptor';

@Module({
  imports: [
    UsersModule,
    PassportModule, 
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy, {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
  },{
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    }
  ],
  exports: [AuthService],
})
export class AuthModule {}
