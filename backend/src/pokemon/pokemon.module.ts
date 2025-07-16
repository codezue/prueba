import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { CustomHttpModule } from '../common/http/http.module';
import { CustomCacheModule } from '../common/cache/cache.module';

@Module({  
  imports: [CustomHttpModule, CustomCacheModule],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
