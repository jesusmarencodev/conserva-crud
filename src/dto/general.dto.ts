import { IsUUID, IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}

export class UpdateOrderDto {
  @IsString()
  name: string;
}


export class ItemDto {

  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}