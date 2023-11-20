/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadSupermercadoService } from '../ciudad-supermercado/ciudad-supermercado.service';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { plainToInstance } from 'class-transformer';

@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
   constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService){}

   @Post(':ciudadId/supermercados/:supermercadoId')
   async addSupermarketToCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return await this.ciudadSupermercadoService.addSupermarketToCity(ciudadId, supermercadoId);
   }

   @Get(':ciudadId/supermercados/:supermercadoId')
   async findTiendaFromProducto(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return await this.ciudadSupermercadoService.findSupermarketFromCity(ciudadId, supermercadoId);
   }   

   @Get(':ciudadId/supermercados')
   async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string){
       return await this.ciudadSupermercadoService.findSupermarketsFromCity(ciudadId);
   }

   @Get(':ciudadId/supermercados/:supermercadoId')
   async findSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return await this.ciudadSupermercadoService.findSupermarketFromCity(ciudadId, supermercadoId);
   }

   @Put(':ciudadId/supermercados')
   async updateSupermarketsFromCity(@Body() tiendasDto: SupermercadoDto[], @Param('ciudadId') ciudadId: string){
       const tiendas = plainToInstance(SupermercadoEntity, tiendasDto)
       return await this.ciudadSupermercadoService.updateSupermarketsFromCity(ciudadId, tiendas);
   }
   
   @Delete(':ciudadId/supermercados/:supermercadoId')
   @HttpCode(204)
   async deleteSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return await this.ciudadSupermercadoService.deleteSupermarketFromCity(ciudadId, supermercadoId);
   }
}