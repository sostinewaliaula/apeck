import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @Type(() => Number)
  @IsNumber()
  displayOrder: number;

  @IsObject()
  content: Record<string, unknown>;

  @IsString()
  @IsOptional()
  status?: 'draft' | 'published';
}

