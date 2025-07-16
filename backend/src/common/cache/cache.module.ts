import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

const DEFAULT_TTL = 3600;

interface RedisConfig {
  host: string;
  port: number;
  ttl: number;
}

@Module({
  imports: [
    CacheModule.registerAsync<RedisConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.getOrThrow<string>('REDIS_HOST');
        const port = configService.getOrThrow<number>('REDIS_PORT');
        
        return {
          store: redisStore,
          host,
          port,
          ttl: configService.get<number>('CACHE_TTL') ?? DEFAULT_TTL,
        };
      },
      isGlobal: true,
    }),
  ],
  exports: [CacheModule],
})
export class CustomCacheModule {}