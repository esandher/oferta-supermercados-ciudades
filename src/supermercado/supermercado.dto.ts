/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsNumber, IsIn} from 'class-validator';
export class SupermercadoDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsNumber()
 @IsNotEmpty()
 //@IsIn(['Perecedero', 'No perecedero'])
 readonly longitud: number;

 @IsNumber()
 @IsNotEmpty()
 //@IsIn(['Perecedero', 'No perecedero'])
 readonly latitud: number;
 
 @IsString()
 @IsNotEmpty()
 readonly pagina_web: string;
}