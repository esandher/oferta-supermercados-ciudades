/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsIn, Matches } from "class-validator";

export class CiudadDto {
   @IsString()
   @IsNotEmpty()
   readonly nombre: string;

   @IsString()
   @IsNotEmpty()
   @IsIn(['Argentina', 'Ecuador', 'Paraguay'])
   //@Matches(/^[A-Z]{3}$/)
   readonly pais: string;

   @IsNumber()
   @IsNotEmpty()
   readonly habitantes: number;
}