/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { faker } from '@faker-js/faker';

let ciudadesList = [];

describe('MuseumService', () => {
 let service: CiudadService;
 let repository: Repository<CiudadEntity>;
 const seedDatabase = async () => {
   repository.clear();
   ciudadesList = [];
   for (let i = 0; i < 5; i++) {
     const ciudad: CiudadEntity = await repository.save({
       nombre: faker.lorem.sentence(),
       pais: faker.lorem.sentence(),
       habitantes: faker.number.int(),
     });
     ciudadesList.push(ciudad);
   }
 };

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [CiudadService],
   }).compile();

   service = module.get<CiudadService>(CiudadService);
   repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
   await seedDatabase();
 });
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

 it('create should return a new ciudad', async () => {
   const ciudad: CiudadEntity = {
     id: '',
     nombre: faker.lorem.sentence(),
       pais: faker.lorem.sentence(),
       habitantes: faker.number.int(),
     supermercados: [],
   };
   const newCiudad: CiudadEntity = await service.create(ciudad);
   expect(newCiudad).not.toBeNull();
   const storedCiudad: CiudadEntity = await repository.findOne({where: {id: newCiudad.id}})
   expect(storedCiudad).not.toBeNull();
   expect(storedCiudad.nombre).toEqual(newCiudad.nombre);
   expect(storedCiudad.pais).toEqual(newCiudad.pais);
   expect(storedCiudad.habitantes).toEqual(newCiudad.habitantes);
 });

 it('update should modify a ciudad', async () => {
   const ciudad: CiudadEntity = ciudadesList[0];
   ciudad.nombre = 'Nuevo nombre';
   ciudad.pais = 'Nuevo pais';
   ciudad.habitantes = 10;
   const updateCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
   expect(updateCiudad).not.toBeNull();
   const storedCiudad: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
   expect(storedCiudad).not.toBeNull();
   expect(storedCiudad.nombre).toEqual(ciudad.nombre)
   expect(storedCiudad.pais).toEqual(ciudad.pais)
   expect(storedCiudad.habitantes).toEqual(ciudad.habitantes)
 });

 it('update should throw an exception for an invalid ciudad', async () => {
   let ciudad: CiudadEntity = ciudadesList[0];
   ciudad = {
     ...ciudad, nombre: 'Nuevo nombre', pais: 'Nuev ciudad', habitantes: 10
   };
   await expect(() => service.update("0", ciudad)).rejects.toHaveProperty('message', 'No se encuentra ninguna ciudad con este id')
 }); 

 it('delete should throw an exception for an invalid ciudad', async () => {
  const ciudad: CiudadEntity = ciudadesList[0];
  await expect(() => service.delete("0")).rejects.toHaveProperty('message', 'No se encuentra ninguna ciudad con este id')
});

});