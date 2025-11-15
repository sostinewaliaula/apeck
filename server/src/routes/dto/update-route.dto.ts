import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRouteDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  target?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
