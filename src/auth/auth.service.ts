import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserResponse, toUserResponse } from './dto/user.response';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.getUserByEmail(dto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken();

    // Store refresh token in database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDto): Promise<{
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
  }> {
    const existingUser = await this.getUserByEmail(dto.email);
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const refreshToken = this.generateRefreshToken();

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        role: dto.role,
        refreshToken,
      },
    });

    const accessToken = await this.generateAccessToken(
      newUser.id,
      newUser.role,
    );

    return {
      user: toUserResponse(newUser),
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(
    userId: string,
    role: string,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, role },
      { expiresIn: '15m' },
    );
  }

  private generateRefreshToken(): string {
    return randomBytes(40).toString('hex');
  }

  private async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        passwordHash: true,
        refreshToken: true,
      },
    });
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findFirst({
      where: { refreshToken },
      select: {
        id: true,
        email: true,
        role: true,
        refreshToken: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const newAccessToken = await this.generateAccessToken(user.id, user.role);
    const newRefreshToken = this.generateRefreshToken();

    // Update refresh token in database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null },
    });
  }

  async getCurrentUser(token: string): Promise<UserResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return toUserResponse(user);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
