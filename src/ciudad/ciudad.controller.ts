/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor'
import { CiudadDto } from './ciudad.dto';
import { plainToInstance } from 'class-transformer';
import { CiudadEntity } from './ciudad.entity';

@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  @Get()
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @Get(':ciudadId')
  async findOne(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadService.findOne(ciudadId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() ciudadDto: CiudadDto) {
    const tienda: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.create(tienda);
  }

  @Put(':ciudadId')
  async update(@Param('ciudadId') ciudadId: string, @Body() ciudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.update(ciudadId, ciudad);
  }

  @Delete(':ciudadId')
  @HttpCode(204)
  async delete(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadService.delete(ciudadId);
  }
}
