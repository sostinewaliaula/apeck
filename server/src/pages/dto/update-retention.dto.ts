import { IsInt, Min } from 'class-validator';

export class UpdateRetentionDto {
  @IsInt()
  @Min(1)
  days: number;
}

