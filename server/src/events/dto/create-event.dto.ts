import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export const EVENT_STATUS_VALUES = ['draft', 'published'] as const;
export type EventStatus = (typeof EVENT_STATUS_VALUES)[number];

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(EVENT_STATUS_VALUES)
  @IsOptional()
  status?: EventStatus;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  category?: string;

  // Accept either uploaded media id or a direct URL for convenience
  @IsString()
  @IsOptional()
  coverMediaId?: string;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;
}
