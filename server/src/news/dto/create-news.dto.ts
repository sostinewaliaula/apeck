import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export const NEWS_STATUS_VALUES = ['draft', 'scheduled', 'published'] as const;
export type NewsStatus = (typeof NEWS_STATUS_VALUES)[number];

export class CreateNewsDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsEnum(NEWS_STATUS_VALUES, {
    message: `status must be one of: ${NEWS_STATUS_VALUES.join(', ')}`,
  })
  status?: NewsStatus;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsBoolean()
  showOnHome?: boolean;

  @IsOptional()
  @IsInt()
  homeDisplayOrder?: number;

  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @IsOptional()
  @IsUUID()
  heroMediaId?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsString()
  readingTime?: string;
}

