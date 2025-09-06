import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  AuthLoginResponse,
  AuthRegisterResponse,
  LogoutResponse,
} from './dto/user.response';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthLoginResponse })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthLoginResponse> {
    const { user, accessToken, refreshToken } =
      await this.authService.login(loginDto);
    this.setRefreshTokenCookie(res, refreshToken);
    return { user, accessToken };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: AuthRegisterResponse })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthRegisterResponse> {
    const { user, accessToken, refreshToken } =
      await this.authService.register(registerDto);

    this.setRefreshTokenCookie(res, refreshToken);

    return { user, accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LogoutResponse })
  logout(@Res({ passthrough: true }) res: Response): Promise<LogoutResponse> {
    this.clearAuthCookie(res);

    return Promise.resolve({ success: true });
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 min
    });
  }

  private clearAuthCookie(res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }
}
