import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100,
      },
      {
        name: 'auth',
        ttl: 60000, // 1 minute
        limit: 5,
      },
    ]),
  ],
})
export class SecurityModule {}
