/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { faker } from '@faker-js/faker';

let supermercadosList = [];

describe('MuseumService', () => {
 let service: SupermercadoService;
 let repository: Repository<SupermercadoEntity>;
 const seedDatabase = async () => {
   repository.clear();
   supermercadosList = [];
   for (let i = 0; i < 5; i++) {
     const supermercado: SupermercadoEntity = await repository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.lorem.sentence(),
     });
     supermercadosList.push(supermercado);
   }
 };

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [SupermercadoService],
   }).compile();

   service = module.get<SupermercadoService>(SupermercadoService);
   repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
   await seedDatabase();
 });
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

 it('create should return a new supermercado', async () => {
   const supermercado: SupermercadoEntity = {
     id: '',
     nombre: faker.lorem.sentence(),
     longitud: faker.number.int(),
     latitud: faker.number.int(),
     pagina_web: faker.lorem.sentence(),
     ciudades: [],
   };
   const newSupermercados: SupermercadoEntity = await service.create(supermercado);
   expect(newSupermercados).not.toBeNull();
   const storedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: newSupermercados.id}})
   expect(storedSupermercado).not.toBeNull();
   expect(storedSupermercado.nombre).toEqual(newSupermercados.nombre);
   expect(storedSupermercado.longitud).toEqual(newSupermercados.longitud);
   expect(storedSupermercado.latitud).toEqual(newSupermercados.latitud);
   expect(storedSupermercado.pagina_web).toEqual(newSupermercados.pagina_web);
 });

  it('update should modify a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = 'Nuevo nombre';
    supermercado.longitud = 1234;
    supermercado.latitud = 1235;
    supermercado.pagina_web = 'Nueva pagina';
    const updateSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updateSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre)
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud);
   expect(storedSupermercado.latitud).toEqual(supermercado.latitud);
   expect(storedSupermercado.pagina_web).toEqual(supermercado.pagina_web);
  });

  it('update should throw an exception for an invalid supermercado', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado, nombre: 'Nuevo nombre', longitud : 1234, latitud : 1235, pagina_web : 'Nueva pagina'
    };
    await expect(() => service.update("0", supermercado )).rejects.toHaveProperty('message', 'No se encuentra ningún supermercado con este id')
  }); 

  it('delete should throw an exception for an invalid supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty('message', 'No se encuentra ningún supermercado con este id')
  });

});