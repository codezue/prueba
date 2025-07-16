import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT') || 5000,
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS') || 5,
        baseURL: configService.get('POKEAPI_BASE_URL') || 'https://pokeapi.co/api/v2',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [HttpModule],
})
export class CustomHttpModule {}