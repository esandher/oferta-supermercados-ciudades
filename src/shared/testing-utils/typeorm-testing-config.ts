/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from '../../supermercado/supermercado.entity';
import { CiudadEntity } from '../../ciudad/ciudad.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [SupermercadoEntity, CiudadEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([SupermercadoEntity, CiudadEntity]),
];