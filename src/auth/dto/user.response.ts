import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponse {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ example: '2025-09-05T12:34:56.789Z' })
  createdAt: string; // ISO
}

export const toUserResponse = (u: {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}): UserResponse => ({
  id: u.id,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt.toISOString(),
});

export class AuthMeResponse {
  @ApiProperty({ type: () => UserResponse })
  data: { user: UserResponse };
}

export class AuthLoginResponse {
  @ApiProperty({ type: () => UserResponse })
  user: UserResponse;

  @ApiProperty({ example: 'jwt.access.token.here' })
  accessToken: string;
}

export class AuthRegisterResponse {
  @ApiProperty({ type: () => UserResponse })
  user: UserResponse;

  @ApiProperty({ example: 'jwt.access.token.here' })
  accessToken: string;
}

export class AuthRefreshResponse {
  @ApiProperty({ example: 'jwt.new.access.token.here' })
  accessToken: string;
}

export class LogoutResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

export class ApiError {
  @ApiProperty()
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
