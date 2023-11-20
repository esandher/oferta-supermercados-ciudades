/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {

  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList : SupermercadoEntity[];

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();
 
    supermercadosList = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await supermercadoRepository.save({
          nombre: faker.lorem.sentence(),
          longitud: faker.number.int(),
          latitud: faker.number.int(),
          pagina_web: faker.lorem.sentence(),
        })
        supermercadosList.push(supermercado);
    }
 
    ciudad = await ciudadRepository.save({
        nombre: faker.lorem.sentence(),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        pagina_web: faker.lorem.sentence()
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermercadoToCiudad should add a supermercado to a ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.lorem.sentence(),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        pagina_web: faker.lorem.sentence()
    });
 
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.lorem.sentence(),
       pais: faker.lorem.sentence(),
       habitantes: faker.number.int()
    })
 
    const result: CiudadEntity = await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);
   
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermercado.nombre)
    expect(result.supermercados[0].longitud).toBe(newSupermercado.longitud)
    expect(result.supermercados[0].latitud).toBe(newSupermercado.latitud)
    expect(result.supermercados[0].pagina_web).toBe(newSupermercado.pagina_web)
  });

  it('addSupermercadoToCiudad should thrown exception for an invalid supermercado', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.lorem.sentence(),
       pais: faker.lorem.sentence(),
       habitantes: faker.number.int()
    })
 
    await expect(() => service.addSupermarketToCity(newCiudad.id, '0')).rejects.toHaveProperty('message', 'No existe el supermercado (id)');
  });

  it('addSupermercadoToCiudad should throw an exception for an invalid ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.lorem.sentence()
    });
 
    await expect(() => service.addSupermarketToCity('0', newSupermercado.id)).rejects.toHaveProperty('message', 'No existe la ciudad (id)');
  });

  it('findSupermercadoFromCiudad should return supermercado from ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.lorem.sentence()
    });
 
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.lorem.sentence(),
       pais: faker.lorem.sentence(),
       habitantes: faker.number.int()
    })
 
    const result: CiudadEntity = await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);
    const storedSupermercado: SupermercadoEntity = await service.findSupermarketsFromCity(newCiudad.id)
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(result.supermercados[0].nombre);
    expect(storedSupermercado.longitud).toBe(result.supermercados[0].longitud);
    expect(storedSupermercado.latitud).toBe(result.supermercados[0].longitud);
    expect(storedSupermercado.pagina_web).toBe(result.supermercados[0].pagina_web);
  });

  it('findSupermercadoFromCiudad should throw an exception for an invalid supermercado', async () => {
    await expect(()=> service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty('message', 'No existe el supermercado');
  });

  it('findSupermercadoFromCiudad should throw an exception for an invalid ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.findSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty('message', 'No se encuentra ningún ciudad con ese id');
  });

  it('findSupermercadoFromCiudad should throw an exception for an supermercado not associated to the ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.lorem.sentence()
    });
 
    await expect(()=> service.findSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty('message', 'La supermercado con el id indicado no está asociada al ciudad con el id indicado');
  });

  it('findSupermercadosFromCiudad should return supermercados from ciudad', async ()=>{
    
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.lorem.sentence()
    });
 
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.lorem.sentence(),
       pais: faker.lorem.sentence(),
       habitantes: faker.number.int()
    })
 
    await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(newCiudad.id);
    expect(supermercados.length).toBe(1)
  });

  it('findSupermercadosFromCiudad should throw an exception for an invalid ciudad', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.toHaveProperty('message', 'No se encuentra ningún ciudad con ese id');
  });

  it('updateSupermercadosFromCiudad should update supermercados list for a ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      ciudad: 'BTA',
      direccion: faker.lorem.sentence()
    });
 
    const updatedCiudad: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);
 
    expect(updatedCiudad.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(updatedCiudad.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(updatedCiudad.supermercados[0].latitud).toBe(newSupermercado.latitud);
    expect(updatedCiudad.supermercados[0].pagina_web).toBe(newSupermercado.pagina_web);
  });

  it('updateSupermercadosFromCiudad should throw an exception for an invalid ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      ciudad: 'BTA',
      direccion: faker.lorem.sentence()
    });
 
    await expect(()=> service.updateSupermarketsFromCity("0", [newSupermercado])).rejects.toHaveProperty('message', 'No se encuentra ningún ciudad con ese id');
  });

  it('updateSupermercadosFromCiudad should throw an exception for an invalid supermercado', async () => {
    const nuevaSupermercado: SupermercadoEntity = supermercadosList[0];
    nuevaSupermercado.id = "0";
 
    await expect(()=> service.updateSupermarketsFromCity(ciudad.id, [nuevaSupermercado])).rejects.toHaveProperty('message', 'No se encuentra ninguna supermercado con ese id');
  });

  it('deleteSupermercadoFromCiudad should remove a supermercado from a ciudad', async () => {
    
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      ciudad: 'BTA',
      direccion: faker.lorem.sentence()
    });
 
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.lorem.sentence(),
      tipo: 'Perecedero',
      precio: faker.lorem.sentence()
    })
 
    await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);
   
    await service.deleteSupermarketFromCity(newCiudad.id, newSupermercado.id);
 
    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: newCiudad.id}, relations: ["supermercados"]});
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find(a => a.id === newSupermercado.id); 
    expect(deletedSupermercado).toBeUndefined(); 
  });

  it('deleteSupermercadoFromCiudad should thrown an exception for an invalid supermercado', async () => {
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty('message', 'No se encuentra ninguna supermercado con ese id');
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an invalid ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(()=> service.deleteSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty('message', 'No se encuentra ningún ciudad con ese id');
  });

  it('deleteSupermercadoFromCiudad should thrown an exception for an non asocciated supermercado', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      ciudad: 'BTA',
      direccion: faker.lorem.sentence()
    });
 
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty('message', 'La supermercado con el id indicado no está asociada al ciudad con el id indicado');
  });
});
