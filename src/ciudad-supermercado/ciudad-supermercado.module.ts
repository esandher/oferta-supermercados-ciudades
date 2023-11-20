import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';

@Module({
  providers: [CiudadSupermercadoService],
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
  controllers: [CiudadSupermercadoController],
})
export class CiudadSupermercadoModule {}
