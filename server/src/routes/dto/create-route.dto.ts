import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  target: string;

  @IsBoolean()
  isActive = true;
}
