import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { CustomHttpModule } from 'src/common/http/http.module';
import { CustomCacheModule } from 'src/common/cache/cache.module';

@Module({  
  imports: [CustomHttpModule, CustomCacheModule],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
