import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

const DEFAULT_TIMEOUT = 5000;
const DEFAULT_MAX_REDIRECTS = 5;
const DEFAULT_BASE_URL = 'https://pokeapi.co/api/v2';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>('HTTP_TIMEOUT') ?? DEFAULT_TIMEOUT,
        maxRedirects: configService.get<number>('HTTP_MAX_REDIRECTS') ?? DEFAULT_MAX_REDIRECTS,
        baseURL: configService.get<string>('POKEAPI_BASE_URL') ?? DEFAULT_BASE_URL,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [HttpModule],
})
export class CustomHttpModule {}