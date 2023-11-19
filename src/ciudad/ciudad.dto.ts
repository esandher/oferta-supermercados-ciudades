/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class CiudadDto {
   @IsString()
   @IsNotEmpty()
   readonly nombre: string;

   @IsString()
   @IsNotEmpty()
   @Matches(/^[A-Z]{3}$/)
   readonly pais: string;

   @IsNumber()
   @IsNotEmpty()
   readonly habitantes: number;
}