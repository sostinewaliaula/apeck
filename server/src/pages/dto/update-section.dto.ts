import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateSectionDto {
  @IsString()
  @IsOptional()
  key?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @IsObject()
  @IsOptional()
  content?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  status?: 'draft' | 'published';
}
