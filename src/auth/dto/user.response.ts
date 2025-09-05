import { type UserRole } from 'generated/prisma';

export type UserResponse = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO
};

export const toUserResponse = (u: {
  id: string;
  email: string;
  role: keyof typeof UserRole;
  createdAt: Date;
}): UserResponse => ({
  id: u.id,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt.toISOString(),
});

export type AuthMeResponse = { data: { user: UserResponse } };
export type AuthLoginResponse = {
  data: {
    user: UserResponse;
    accessToken: string;
  };
};

export type AuthRegisterResponse = {
  data: {
    user: UserResponse;
    accessToken: string;
  };
};

export type AuthRefreshResponse = {
  data: {
    accessToken: string;
  };
};

export type LogoutResponse = {
  data: {
    success: true;
  };
};

// error (global)
export type ApiError = {
  error: { code: string; message: string; details?: unknown };
};
