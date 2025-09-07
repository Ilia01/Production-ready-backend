export interface JwtPayload {
  sub: string; // user id
  role: string;
  iat?: number;
  exp?: number;
}
